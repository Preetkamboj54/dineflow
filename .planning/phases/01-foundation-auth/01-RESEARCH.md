# Phase 1: Foundation & Auth - Research

## Context

DineFlow is a full-stack MERN application. Phase 1 focuses on the core architecture and user authentication for Customers, Restaurants, and Admins.

## Technical Stack & Best Practices

1. **Backend Framework**: Node.js with Express.js.
2. **Database**: MongoDB using Mongoose ODM.
3. **Authentication**: JSON Web Tokens (JWT) for stateless session management.
4. **Password Hashing**: `bcryptjs` is preferred for secure password hashing before storing in MongoDB.
5. **Security**:
   - `cors` middleware to allow requests from the React frontend.
   - `dotenv` for environment variable management.
   - JWT tokens should ideally be returned to the client and included in the `Authorization: Bearer <token>` header for subsequent requests.

## Architecture Guidelines

- Separate the application into `server` and `client` directories.
- Backend structure:
  - `/config`: Database connection and config files.
  - `/models`: Mongoose schemas.
  - `/controllers`: Request handlers.
  - `/routes`: Express routers.
  - `/middleware`: Custom middleware (e.g., auth, error handling).
- **User Model Schema**: Needs `name`, `email`, `phoneNumber`, `passwordHash`, `role` (enum: 'customer', 'restaurant', 'admin').

## Potential Pitfalls

- Forgetting to handle MongoDB connection errors.
- Storing passwords in plain text or using a weak hash round (use bcrypt with salt rounds = 10).
- Exposing the JWT Secret Key in the codebase. Always use `process.env.JWT_SECRET`.
- Not verifying roles in the auth middleware (e.g., allowing a customer to access admin endpoints).
