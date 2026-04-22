# Context: Phase 04 - Admin Panel & Polish

## Decisions

### 1. Admin Authentication & Routing
- **Decision:** The existing `Login.jsx` will be updated to check the `role` in the JWT payload immediately after login.
- **Redirection Logic:**
    - `customer` -> `/restaurants`
    - `restaurant` -> `/dashboard`
    - `admin` -> `/admin-dashboard`
- **Protection:** All admin routes will be protected by `verifyToken` and `verifyRole(['admin'])` middleware on the backend.

### 2. Admin Statistics (ADMN-01)
- **Decision:** Create a new `adminController.js` and `adminRoutes.js`.
- **Stat Implementation:**
    - `totalUsers`: `User.countDocuments()`
    - `totalRevenue`: `Order.aggregate([{ $match: { status: 'Completed' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }])`
    - `topRestaurant`: `Order.aggregate([{ $group: { _id: '$restaurantId', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 1 }])` followed by a lookup.

### 3. Restaurant Approval Flow (ADMN-02)
- **Decision:** Add `isApproved: { type: Boolean, default: false }` to `Restaurant.js`.
- **Customer Filter:** Update `getRestaurants` in `restaurantController.js` to only return restaurants where `isApproved: true`.
- **Admin Override:** Admins can view all restaurants and toggle the `isApproved` and `isOpen` flags via a new PUT endpoint.

### 4. UI/UX Polish (ADMN-03)
- **Decision:** Use a **Dark/Glassmorphic** theme for the Admin Panel to differentiate it.
- **Global CSS:** Refactor `style.css` to use CSS variables for colors (e.g., `--primary`, `--secondary`, `--bg-main`).
- **Micro-interactions:** Add hover transitions to all buttons and cards.
- **Loading States:** Implement skeleton screens or refined spinners for all data-fetching operations.

## Reusable Assets
- `verifyToken` / `verifyRole` middleware from `server/src/middleware/authMiddleware.js`.
- `api` utility from `client/src/utils/api.js`.

## Gray Areas Resolved
- **Admin UI:** Will be integrated into the main SPA, not a separate build.
- **Restaurant Visibility:** New restaurants will be hidden until an admin clicks "Approve".

## Next Steps
1. Researcher to verify MongoDB aggregation syntax for stats.
2. Planner to break down into:
    - Plan 04-01: Admin Backend (Model, Routes, Controller).
    - Plan 04-02: Admin Dashboard UI.
    - Plan 04-03: Global Styling & Polish.
