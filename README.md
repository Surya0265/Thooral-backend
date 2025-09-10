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

## API Documentation

### Authentication

The API uses JWT (JSON Web Token) authentication. Access tokens are valid for **15 minutes**, and refresh tokens are valid for **7 days**.

- To authenticate, include the token in the Authorization header: `Authorization: Bearer <token>`
- When an access token expires, use the refresh token to obtain a new access token

### API Endpoints

#### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | `/api/auth/register` | Register a new user | `{ "fullName": "String", "email": "String", "password": "String", "schoolName": "String" }` | `{ "status": "success", "message": "Registration successful", "data": { "user": {...} } }` |
| POST | `/api/auth/verify-email` | Verify email address | `{ "email": "String", "code": "String" }` | `{ "status": "success", "message": "Email verified successfully" }` |
| POST | `/api/auth/login` | Login user | `{ "email": "String", "password": "String" }` | `{ "status": "success", "message": "Login successful", "data": { "accessToken": "String", "refreshToken": "String", "user": {...} } }` |
| POST | `/api/auth/refresh-token` | Refresh access token | `{ "refreshToken": "String" }` | `{ "status": "success", "message": "Access token refreshed successfully", "data": { "accessToken": "String" } }` |
| POST | `/api/auth/forgot-password` | Request password reset | `{ "email": "String" }` | `{ "status": "success", "message": "Reset password email sent" }` |
| POST | `/api/auth/reset-password` | Reset password | `{ "token": "String", "password": "String" }` | `{ "status": "success", "message": "Password reset successful" }` |

#### User Endpoints

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|--------------|-------------|----------|
| GET | `/api/users` | Get all users | No | - | `{ "status": "success", "results": Number, "data": { "users": [...] } }` |
| GET | `/api/users/:id` | Get user by ID | No | - | `{ "status": "success", "data": { "user": {...} } }` |
| GET | `/api/users/me` | Get current user | Yes | - | `{ "status": "success", "data": { "user": {...} } }` |
| PUT | `/api/users/me` | Update current user | Yes | `{ "fullName": "String", "schoolName": "String" }` | `{ "status": "success", "data": { "user": {...} } }` |
| DELETE | `/api/users/:id` | Delete user (admin only) | Yes | - | `{ "status": "success", "message": "User deleted successfully" }` |

### Authentication Flow

1. **Registration**: User registers with email and password
2. **Email Verification**: User verifies email with code sent to their inbox
3. **Login**: User logs in and receives access token (15m validity) and refresh token (7d validity)
4. **API Access**: Protected endpoints are accessed using the access token
5. **Token Refresh**: When access token expires, use refresh token to get a new access token
6. **Password Reset**: If password is forgotten, user can request a reset link via email

### Token Management

#### Access Tokens
- **Purpose**: Used for authenticating API requests
- **Duration**: 15 minutes
- **Storage**: Should be stored in memory or short-term client storage
- **Usage**: Include in the Authorization header as `Bearer <token>`

#### Refresh Tokens
- **Purpose**: Used to obtain new access tokens without re-authentication
- **Duration**: 7 days
- **Storage**: Should be stored securely in HTTP-only cookies or secure storage
- **Usage**: Send to `/api/auth/refresh-token` endpoint when access token expires

#### Token Security Best Practices
1. Never store tokens in localStorage (vulnerable to XSS attacks)
2. Always use HTTPS in production
3. Implement token rotation for refresh tokens
4. Set appropriate CORS policies
5. Validate tokens on every request

### Error Responses

All API errors follow this format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

Common error status codes:
- 400: Bad Request - Invalid input data
- 401: Unauthorized - Invalid or expired token
- 404: Not Found - Resource not found
- 500: Internal Server Error - Server-side error

### Troubleshooting Authentication Issues

#### "Invalid or expired token" error
- **Check token expiration**: Access tokens expire after 15 minutes
- **Verify token format**: Ensure the token is correctly formatted in the Authorization header
- **Secret key mismatch**: Make sure the JWT_ACCESS_SECRET in .env matches the one used to create the token
- **Use refresh token**: If your access token has expired, use the refresh token to get a new one

#### "Access denied. No token provided." error
- Ensure the Authorization header is included in your request
- Check that the header is formatted correctly: `Authorization: Bearer <token>`
- Verify there are no extra spaces or characters in the header

#### Login issues
- Ensure email and password are correct
- Check that the email has been verified
- Verify you're using the correct API endpoint

#### Token refresh issues
- Ensure you're using a valid refresh token
- Check that the refresh token hasn't expired (7-day limit)
- Verify you're sending the token in the correct format to the refresh endpoint

## License

ISC

