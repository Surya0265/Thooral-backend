# Thooral-backend

An Express.js backend for the Thooral project.

## Features
- RESTful API structure
- Organized folders for routes, controllers, models, middlewares, and config
- Environment variable support via `.env`

## Project Structure

```
src/
  server.js         # Main entry point
  routes/           # API route definitions
  controllers/      # Route handler logic
  models/           # Data models
  middlewares/      # Express middlewares
  config/           # Configuration files
  .env              # Environment variables (not committed)
```

## Setup

1. Install dependencies:
	```
	npm install
	```
2. Create a `.env` file in `src/` for environment variables (see `.env.example` if available).
3. Start the development server:
	```
	npm run dev
	```

## Usage

API will be available at `http://localhost:3000/api` by default.

## Scripts
- `npm run dev` — Start server with nodemon (auto-reloads on changes)
- `npm start` — Start server normally

## License
MIT