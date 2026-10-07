# Nestly PG Finder

Nestly is a full-stack PG finder practical built to explore GitHub Copilot assisted development. Users can search demo listings, filter by area/budget/room type, view owner details, and drag listing cards to shortlist them. Owners get a profile dashboard preview and a publish-ready API.

## Stack

- Node.js + Express.js REST API
- MongoDB with Mongoose (falls back to demo data when MongoDB is unavailable)
- Tailwind CSS via CDN with custom CSS for the visual system
- Native HTML Drag and Drop API

## Run

1. Install Node.js 18+ and MongoDB (optional for demo mode).
2. Copy `.env.example` to `.env` and adjust `MONGODB_URI` if needed.
3. Run `npm install`.
4. Run `npm run dev` and open `http://localhost:3000`.
5. Run `npm run docs` to regenerate `report.docx`.

## API

- `GET /api/pgs?area=Koramangala&maxRent=16000`
- `POST /api/pgs` with a listing JSON body
- `GET /api/health`

## Feature map for the practical

### Main features

1. PG search and filtering
2. Owner profile/dashboard view
3. Drag-and-drop shortlist interaction

### Side features

1. Verified listing and rating signals
2. Responsive Tailwind UI
3. MongoDB persistence with demo fallback
4. REST health and publish endpoints

See `report.docx` for the Word document explaining how GitHub Copilot can assist with code generation, completion, debugging, documentation, and developer productivity in this project.
