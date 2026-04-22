# Specification: Phase 04 - Admin Panel & Polish

## Goal
Provide platform administrators with tools for oversight, manage restaurant status, and perform a final aesthetic and functional polish across the entire application.

## Requirements

### ADMN-01: Admin Dashboard & Routing
- The main login page must detect the `admin` role and redirect to `/admin-dashboard`.
- Create a secure `AdminDashboard.jsx` page restricted to users with `role: 'admin'`.
- Dashboard should display high-level stats:
    - **Total Users** (Customer vs. Restaurant vs. Admin).
    - **Total Revenue** (Sum of all completed orders).
    - **Top Restaurant** (Restaurant with the most orders).
    - **Recent Activity** (Latest 5 orders platform-wide).

### ADMN-02: Restaurant Management
- Display a list of all registered restaurants.
- Allow Admins to toggle:
    - `isOpen`: Manually close/open a restaurant.
    - `isApproved`: New field to control if a restaurant is visible to customers.
- Update the `Restaurant` model to include `isApproved: { type: Boolean, default: false }`.

### ADMN-03: Global Visual Polish
- Apply consistent, premium styling to all pages:
    - **Home/Restaurants:** Refine grid layout and cards.
    - **Menu:** Enhance dish presentation and add-to-cart animations.
    - **Auth:** Standardize Login/Register forms.
    - **Navigation:** Improve header responsiveness and active link states.
- Ensure 100% mobile responsiveness for critical flows (ordering, viewing menu).

## Deliverables
1. `AdminDashboard.jsx` and associated components.
2. Updated `Restaurant` model and backend routes for Admin actions.
3. Refined `style.css` with a global design system overhaul.

## Success Criteria
1. Admins can log in and see platform-wide statistics.
2. Admins can approve a new restaurant, making it visible to customers.
3. The entire application feels like a cohesive, high-end product on both desktop and mobile.

## Ambiguity Score: 1/10
Requirements are clear. Polishing is subjective but will follow modern "premium" design principles as per system instructions.
