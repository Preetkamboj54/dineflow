---
phase: 01-foundation-auth
plan: 03
type: execute
wave: 1
depends_on: []
files_modified:
  - server/src/controllers/authController.js
  - server/src/routes/authRoutes.js
autonomous: true
requirements:
  - AUTH-04
gap_closure: true

must_haves:
  truths:
    - "GET /api/auth/me returns 200 and user details when a valid Bearer token is provided"
    - "GET /api/auth/me returns 401 when no Authorization header is provided"
    - "GET /api/auth/me returns 401 when an invalid or expired token is provided"
  artifacts:
    - path: "server/src/controllers/authController.js"
      provides: "getMe controller function"
    - path: "server/src/routes/authRoutes.js"
      provides: "Protected /me route"
  key_links:
    - from: "server/src/routes/authRoutes.js"
      to: "server/src/middleware/authMiddleware.js"
      via: "verifyToken middleware"
      pattern: "router.get('/me', verifyToken, getMe)"
---

<objective>
Close the verification gap where authentication middleware was implemented but not applied to any routes. 
Implement a protected `/me` endpoint to verify the end-to-end authentication flow.

Purpose: Prove that the API securely rejects unauthorized requests and correctly identifies authenticated users.
Output: A functional, protected API endpoint.
</objective>

<execution_context>
@$HOME/.config/opencode/get-shit-done/workflows/execute-plan.md
@$HOME/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation-auth/01-VERIFICATION.md

<interfaces>
From server/src/middleware/authMiddleware.js:
```javascript
export { verifyToken, verifyRole };
```

From server/src/utils/tokenUtils.js:
```javascript
export { generateToken, verifyToken };
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Implement getMe controller</name>
  <files>server/src/controllers/authController.js</files>
  <action>
    Add a `getMe` export. This function should:
    1. Use `req.user` (populated by `verifyToken` middleware) to identify the user.
    2. Fetch the full user record from the `User` model (excluding the passwordHash).
    3. Return the user details with a 200 status.
    4. Handle database errors with a 500 status.
  </action>
  <verify>
    <automated>node -c server/src/controllers/authController.js</automated>
  </verify>
  <done>getMe function implemented and exported in authController.js</done>
</task>

<task type="auto">
  <name>Task 2: Create and protect /me route</name>
  <files>server/src/routes/authRoutes.js</files>
  <action>
    1. Import `verifyToken` from `../middleware/authMiddleware`.
    2. Import `getMe` from `../controllers/authController`.
    3. Define a GET route at `/me` that uses `verifyToken` middleware before calling `getMe`.
  </action>
  <verify>
    <automated>node -c server/src/routes/authRoutes.js</automated>
  </verify>
  <done>/me route defined and protected by verifyToken in authRoutes.js</done>
</task>

<task type="auto">
  <name>Task 3: End-to-End Verification of Auth Flow</name>
  <files></files>
  <action>
    Perform a manual test sequence via curl or Postman:
    1. Register a test user: POST /api/auth/register
    2. Login: POST /api/auth/login -> capture JWT token.
    3. Access /me WITHOUT token: GET /api/auth/me -> Expect 401.
    4. Access /me WITH invalid token: GET /api/auth/me (Header: Bearer invalid) -> Expect 401.
    5. Access /me WITH valid token: GET /api/auth/me (Header: Bearer &lt;token&gt;) -> Expect 200 + User Data.
  </action>
  <verify>
    <automated>
      curl -X GET http://localhost:5000/api/auth/me -H "Authorization: Bearer invalid" | grep "401"
    </automated>
  </verify>
  <done>End-to-end auth flow verified: unauthorized requests rejected, authorized requests succeed</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Client -> /api/auth/me | Untrusted JWT token provided in Authorization header |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01-GAP-01 | Spoofing | /api/auth/me | mitigate | Use `verifyToken` middleware to validate JWT signature and expiry before accessing controller |
| T-01-GAP-02 | Information Disclosure | /api/auth/me | mitigate | Ensure `passwordHash` is explicitly excluded from the returned user object |
</threat_model>

<verification>
Confirm that `curl` requests to `/api/auth/me` return 401 for missing/invalid tokens and 200 for valid tokens.
</verification>

<success_criteria>
- [ ] `/api/auth/me` endpoint exists and is protected.
- [ ] Unauthorized requests are rejected with 401.
- [ ] Authorized requests return the correct user data.
- [ ] No password hashes are leaked in the response.
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation-auth/01-03-SUMMARY.md`
</output>
