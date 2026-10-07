# Taskflow

A focused todo board built with FastAPI, SQLAlchemy, MySQL, and a browser-native drag-and-drop UI.

## Run it

1. Install `uv` if it is not already available: `curl -LsSf https://astral.sh/uv/install.sh | sh`
2. Use the existing Docker MySQL service published at `localhost:3306`.
3. Create the environment file: `cp .env.example .env`, then replace `YOUR_EXISTING_PASSWORD` with the password configured for the existing `appuser` account.
4. Install dependencies with uv: `uv sync`
5. Start the API: `uv run uvicorn app.main:app --reload`
6. Open http://127.0.0.1:8000

The API documentation is available at http://127.0.0.1:8000/docs. The board supports creating, reading, updating, and deleting todos. Drag a card between columns to persist its status through the PATCH endpoint. The existing Docker container reports database `myapp` and user `appuser`; the included `docker-compose.yml` is optional and is not needed for this setup.

## API routes

| Method | Route             | Purpose                              |
| ------ | ----------------- | ------------------------------------ |
| GET    | `/api/todos`      | List todos                           |
| POST   | `/api/todos`      | Create a todo                        |
| PATCH  | `/api/todos/{id}` | Update title, description, or status |
| DELETE | `/api/todos/{id}` | Delete a todo                        |
