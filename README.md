# Ticketing System 

This repository contains a support ticketing app with a TypeScript/Express backend, Prisma/PostgreSQL data layer, and a Vite/React frontend.

## Setup

### Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL database

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Ticketing-System
```

### 2. Configure the backend

Create `Backend/.env` from `Backend/.env.example` and fill in the values:

```env
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/ticketing_system
```

Install backend dependencies:

```bash
cd Backend
npm install
```

If you want sample data, run the seed script after your database is ready:

```bash
npm run db:seed
```

### 3. Configure the frontend

Install frontend dependencies:

```bash
cd ../Frontend
npm install
```

If your backend is not running on `http://localhost:3000`, set `VITE_API_BASE_URL` in a frontend `.env` file.

## Run the app

Open two terminals.

### Backend

```bash
cd Backend
npm start
```

This starts the API and watches TypeScript changes.

### Frontend

```bash
cd Frontend
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Test the API

Run the backend integration/API tests with:

```bash
cd Backend
npm test
```

The current test coverage includes:

- creating a ticket
- listing tickets with pagination and filters
- returning ticket status stats

## Useful API Endpoints

- `GET /health` - health check
- `GET /api/tickets` - list tickets
- `GET /api/tickets/stats` - ticket status summary
- `GET /api/tickets/:id` - fetch a single ticket
- `POST /api/tickets` - create a ticket
- `PATCH /api/tickets/:id` - update a ticket

## Decisions & Tradeoffs

I assumed the assessment favored a compact one-page interface over a route-heavy dashboard, so I collapsed the frontend into a single screen and kept toast notifications for feedback.
I treated the Prisma enums as the source of truth for ticket status and priority, and only mirrored them in TypeScript where the client needed literal unions.
I used Axios directly instead of a custom HTTP abstraction so the frontend stayed small and easy to follow. I assumed the backend would run locally on port `3000` and the frontend on `5173`, with CORS configured through `FRONTEND_ORIGIN`. With more time, I would add broader API coverage, stronger input/error-state UI, and a deployment-ready environment split for development versus production.

## Notes

- The frontend uses `VITE_API_BASE_URL` only when the API is not available at `http://localhost:3000`.
- The backend requires `DATABASE_URL` and `FRONTEND_ORIGIN` to be set before starting.
