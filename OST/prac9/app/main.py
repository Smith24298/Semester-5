from datetime import datetime
from enum import Enum
from pathlib import Path
import os

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import DateTime, String, Text, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://appuser:app_password@localhost:3306/myapp",
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


class TodoStatus(str, Enum):
    backlog = "backlog"
    progress = "progress"
    done = "done"


class Todo(Base):
    __tablename__ = "todos"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    status: Mapped[TodoStatus] = mapped_column(String(20), default=TodoStatus.backlog, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class TodoCreate(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    description: str = Field(default="", max_length=2000)
    status: TodoStatus = TodoStatus.backlog


class TodoUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=180)
    description: str | None = Field(default=None, max_length=2000)
    status: TodoStatus | None = None


class TodoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    status: TodoStatus
    created_at: datetime
    updated_at: datetime


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI(title="Taskflow API", version="1.0.0")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")


@app.on_event("startup")
def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/", include_in_schema=False)
def serve_index():
    return FileResponse(BASE_DIR / "templates" / "index.html")


@app.get("/api/todos", response_model=list[TodoResponse])
def list_todos(db: Session = Depends(get_db)):
    return db.scalars(select(Todo).order_by(Todo.created_at.desc())).all()


@app.post("/api/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)):
    todo = Todo(**payload.model_dump())
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.patch("/api/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, payload: TodoUpdate, db: Session = Depends(get_db)):
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(todo, key, value)
    todo.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/api/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()
