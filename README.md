# MovieMatch

A full-stack movie discovery and organization web app. Create an account, swipe through real movies, save the ones you like into watchlists, and share lists with the community.

**Live Demo:** https://movie-match-eight-omega.vercel.app/

## Features

- **Authentication** — sign up / log in / log out with JWT sessions and bcrypt-hashed passwords
- **Movie discovery** — browse real movie data from the TMDB API in two modes: a Tinder-style swipe view and a traditional scroll view, with search by title, genre, rating, and release year
- **Watchlists** — every user gets a default watchlist; create, rename, and delete lists; add/remove movies, move them between lists, and mark them as watched
- **Public Channel** — publish a watchlist to the community feed, browse everyone else's public lists, and like the ones you enjoy

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Create React App), Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| APIs | TMDB, JWT auth |
| Hosting | Vercel (frontend), Render (backend) |

## Getting Started

### Prerequisites

- Node.js 16+
- A MongoDB connection string (MongoDB Atlas free tier works)

### 1. Run the backend

```bash
cd MovieMatch/server
npm install
```

Create a `.env` file in `MovieMatch/server`:

```
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<any-long-random-string>
PORT=5001
```

Then start it:

```bash
node server.js
```

The API will be available at `http://localhost:5001/api`.

### 2. Run the frontend

```bash
cd MovieMatch/client
npm install
npm start
```

Open `http://localhost:3000` in your browser.

By default the frontend talks to `http://localhost:5001/api`. To point it at a different backend, create a `.env` file in `MovieMatch/client`:

```
REACT_APP_API_URL=http://localhost:5001/api
```

(Note: Create React App bakes this value in at build time, so set it before running `npm run build`.)

## Project Structure

```
MovieMatch/
├── client/          # React frontend
│   └── src/
│       ├── components/  # Auth, Navbar, ...
│       ├── pages/       # Home, Swipe, Scroll, Watchlists, PublicChannel, ...
│       └── utils/       # backendApi.js (configured axios instance)
└── server/          # Express backend
    ├── models/      # User, Watchlist (Mongoose)
    └── server.js    # routes + app entry
```

## Deployment Notes

- Frontend is deployed on Vercel, backend on Render's free tier, database on MongoDB Atlas.
- Render's free tier sleeps after ~15 minutes of inactivity, so the first request after idle may take ~30 seconds (cold start).

## Authors

Lixin Guo and Nachuan Ding — originally built as a course project for WashU CSE 3300.
