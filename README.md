# Thooral-backend

A simple backend API built with Express and TypeScript.

## Features

- TypeScript support
- Express.js framework
- Structured project architecture
- Middleware for security, logging, and error handling
- API routing with controllers
- Development tools (ESLint, Nodemon)

## Project Structure

```
thooral-backend/
├── src/
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── routes/         # API routes
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── server.ts       # Application entry point
├── .env                # Environment variables
├── .eslintrc.json      # ESLint configuration
├── .gitignore          # Git ignore rules
├── nodemon.json        # Nodemon configuration
├── package.json        # Project dependencies and scripts
├── README.md           # Project documentation
└── tsconfig.json       # TypeScript configuration
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=3000
   NODE_ENV=development
   ```

## Development

Start the development server:

```
npm run dev
```

This will start the server with nodemon for automatic reloading when changes are detected.

## Building for Production

Build the TypeScript code to JavaScript:

```
npm run build
```

This will generate a `dist` directory with the compiled JavaScript files.

## Running in Production

Start the production server:

```
npm start
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## License

ISC

