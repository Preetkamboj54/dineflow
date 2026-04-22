---
status: testing
phase: 01-foundation-auth
source: [.planning/phases/01-foundation-auth/01-01-SUMMARY.md, .planning/phases/01-foundation-auth/01-02-SUMMARY.md, .planning/phases/01-foundation-auth/01-03-SUMMARY.md]
started: 2026-04-19T10:30:00Z
updated: 2026-04-19T09:09:20Z
---

## Current Test

number: 4
name: Access Protected Me Endpoint
expected: |
  Submitting a GET request to /api/auth/me with a valid JWT returns the authenticated user's profile (excluding password).
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.
result: pass

### 2. Register a User
expected: Submitting a POST request to /api/auth/register with valid details (email, password, role) creates a user in the database and returns a JWT.
result: pass

### 3. Login to Account
expected: Submitting a POST request to /api/auth/login with valid credentials returns a JWT.
result: pass

### 4. Access Protected Me Endpoint
expected: Submitting a GET request to /api/auth/me with a valid JWT returns the authenticated user's profile (excluding password).
result: [pending]

### 5. Access Protected Route without Token
expected: Submitting a GET request to /api/auth/me without a token (or with an invalid token) returns a 401 Unauthorized error.
result: [pending]

### 6. Unauthorized Role Access
expected: Accessing a route restricted to 'Admin' with a 'Customer' token returns a 403 Forbidden error.
result: [pending]

## Summary

total: 6
passed: 3
issues: 0
pending: 3
skipped: 0

## Gaps

[none yet]
