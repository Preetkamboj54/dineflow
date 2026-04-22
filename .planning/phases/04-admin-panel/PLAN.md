# Plan: Phase 04 - Admin Panel & Polish

## Overview
Implement administrative oversight tools and perform a global aesthetic polish to ensure a premium MERN stack experience.

---

## 04-01: Admin Backend & Model Update
**Goal:** Add restaurant approval fields and create admin-only API endpoints for statistics and management.

- [ ] **Task 1: Update Restaurant Model**
    - File: `server/models/Restaurant.js`
    - Action: Add `isApproved: { type: Boolean, default: false }`.
- [ ] **Task 2: Create Admin Controller**
    - File: `server/controllers/adminController.js`
    - Action: Implement `getPlatformStats` (Users, Revenue, Top Restaurant) and `toggleRestaurantStatus` (Approval and Open status).
- [ ] **Task 3: Define Admin Routes**
    - File: `server/routes/adminRoutes.js`
    - Action: Register `/stats` and `/restaurants` routes protected by `verifyToken` and `verifyRole(['admin'])`.
- [ ] **Task 4: Mount Admin Routes**
    - File: `server/app.js`
    - Action: Mount `/api/admin` routes.
- [ ] **Task 5: Update Customer Visibility**
    - File: `server/controllers/restaurantController.js`
    - Action: Filter `getRestaurants` to only return `isApproved: true`.

---

## 04-02: Admin Dashboard UI
**Goal:** Build the admin interface with stats cards, a management table, and role-based redirection.

- [ ] **Task 1: Role-Based Redirection**
    - File: `client/src/pages/Login.jsx`
    - Action: Detect `admin` role and redirect to `/admin-dashboard`.
- [ ] **Task 2: Create Admin Dashboard Page**
    - File: `client/src/pages/AdminDashboard.jsx`
    - Action: Build stats cards (Total Revenue, Users) and a table to Approve/Reject restaurants.
- [ ] **Task 3: Update App Routing**
    - File: `client/src/App.jsx`
    - Action: Register `/admin-dashboard` route.

---

## 04-03: Global Visual Polish & Design System
**Goal:** Refactor CSS for a high-end, cohesive aesthetic with glassmorphism and modern micro-interactions.

- [ ] **Task 1: Centralize Design Tokens**
    - File: `client/src/style.css`
    - Action: Define CSS variables for colors, shadows, and gradients. Apply a global layout refinement.
- [ ] **Task 2: Refine Component Styling**
    - Files: `client/src/components/*`, `client/src/pages/*`
    - Action: Apply consistent card styling, better typography (Outfit/Inter), and smooth hover states.
- [ ] **Task 3: Polish Navigation & Footer**
    - File: `client/src/App.jsx` (Header)
    - Action: Ensure a premium responsive menu and clear active states.
- [ ] **Task 4: Final Mobile Audit**
    - Action: Verify all critical paths work smoothly on smaller viewports.

---

## Verification Plan
1. **Admin Login:** Log in with an admin account and verify redirection to `/admin-dashboard`.
2. **Stats:** Verify revenue and user counts match DB state.
3. **Approval:** Create a new restaurant, verify it's HIDDEN from customers until Admin approves it.
4. **Visuals:** Visual inspection of all pages for consistency and "premium" feel.
