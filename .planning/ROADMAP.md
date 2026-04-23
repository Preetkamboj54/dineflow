# Roadmap: DineFlow

## Overview

DineFlow v1.0 development is structured in 4 phases, starting from foundational architecture and authentication, building the customer-facing applications, then the restaurant-facing dashboard, and finally the administrative oversight and polish.

## Phases

- [x] **Phase 1: Foundation & Auth** - Initial setup, models, and authentication system
- [x] **Phase 2: Customer Portal** - Browsing, cart, orders, and reservations
- [x] **Phase 3: Restaurant Dashboard** - Menu management and live order tracking
- [x] **Phase 4: Admin Panel & Polish** - Admin management and final optimizations
- [x] **Phase 5: Image & Profile Polish** - Support for external image URLs and profile editing
- [x] **Phase 6: Advanced Table Management** - Status flow, seating preferences, and user visibility
- [ ] **Phase 7: Rating & Review System** - Order and dish-wise ratings with average calculations
- [ ] **Phase 8: User Address & Profile Management** - Multi-address support and comprehensive profile editing
- [ ] **Phase 9: Tailwind CSS Migration** - Replace style.css with Tailwind CSS utility classes across all components

## Phase Details

### Phase 1: Foundation & Auth
**Goal**: Establish the MERN architecture, database schemas, and robust user authentication.
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. Users can register as Customer, Restaurant, or Admin.
  2. Users can log in and receive a secure session token (JWT).
  3. API securely rejects unauthorized requests.
**Plans**: 3 plans

Plans:
- [x] 01-01: Environment setup and database models
- [x] 01-02: Authentication endpoints and security middleware
- [x] 01-03-GAP-PLAN.md — Close authentication middleware gap (protected route)

### Phase 2: Customer Portal
**Goal**: Build the core customer experience for browsing and ordering food.
**Depends on**: Phase 1
**Requirements**: CUST-01, CUST-02, CUST-03, CUST-04, CUST-05, CUST-06, CUST-07
**Success Criteria** (what must be TRUE):
  1. Customer can find a restaurant and view its menu.
  2. Customer can add items to a persistent cart and complete checkout.
  3. Customer can reserve a table without conflicts.
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Restaurant browsing and search UI/API
- [x] 02-02-PLAN.md — Cart state management and checkout flow
- [x] 02-03-PLAN.md — Table reservation system

### Phase 3: Restaurant Dashboard
**Goal**: Provide restaurants with tools to manage menus and handle incoming orders in real-time.
**Depends on**: Phase 2
**Requirements**: REST-01, REST-02, REST-03, REST-04, REST-05
**Success Criteria** (what must be TRUE):
  1. Staff can perform CRUD operations on their menu items.
  2. Orders appear instantly on the dashboard without reloading.
  3. Staff can advance order status and manage reservations.
**Plans**: 2 plans

Plans:
- [x] 03-01: Menu and reservation management endpoints and UI
- [x] 03-02: Socket.io integration for real-time order queue

### Phase 4: Admin Panel & Polish
**Goal**: Give platform administrators oversight and finalize application readiness.
**Depends on**: Phase 3
**Requirements**: ADMN-01, ADMN-02, ADMN-03
**Success Criteria** (what must be TRUE):
  1. Admin can approve or suspend restaurants and users.
  2. Application is responsive across target devices.
  3. Performance requirements (load time, response time) are met.
**Plans**: 2 plans

Plans:
- [x] 04-01: Admin dashboard and management APIs
- [x] 04-02: Final UI polish, responsiveness, and performance review

### Phase 5: Image & Profile Polish
**Goal**: Support external image URLs and profile editing for restaurants.
**Depends on**: Phase 4
**Success Criteria**:
  1. Restaurants can update their profile details and image URLs.
  2. Menu items support dynamic image URLs.

### Phase 6: Advanced Table Management
**Goal**: Refine the reservation system with status workflows and seating options.
**Depends on**: Phase 2
**Success Criteria**:
  1. Restaurant can confirm/decline reservations.
  2. Customers can see their reservation status.
  3. Seating preferences (Indoor/Outdoor) are supported.

### Phase 7: Rating & Review System
**Goal**: Implement a feedback loop for food quality and restaurant service.
**Depends on**: Phase 2 (Orders)
**Success Criteria**:
  1. Customers can rate completed orders and individual dishes.
  2. Restaurant average ratings are calculated automatically.
  3. Dish-wise ratings are displayed on the menu.

### Phase 8: User Address & Profile Management
**Goal**: Enhance user profiles with multi-address support and comprehensive personal information management.
**Depends on**: Phase 2 (Customer Portal/Checkout)
**Success Criteria**:
  1. User can add, edit, and delete multiple delivery addresses in their profile.
  2. At checkout, users can select from their saved addresses or add a one-time address.
  3. Profile page allows updating name, mobile number, and email.

### Phase 9: Tailwind CSS Migration
**Goal**: Replace the monolithic `style.css` with Tailwind CSS utility classes across all client components for maintainability and consistency.
**Depends on**: Phase 4 (UI baseline established)
**Success Criteria**:
  1. All JSX components use Tailwind utility classes instead of custom CSS class names from `style.css`.
  2. `style.css` retains only global resets, CSS variables, and Google Fonts import.
  3. UI appearance and responsiveness are preserved or improved after migration.
  4. No unused CSS classes remain in `style.css`.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Auth | 3/3 | Complete | 2026-04-19 |
| 2. Customer Portal | 3/3 | Complete | 2026-04-22 |
| 3. Restaurant Dashboard | 2/2 | Complete | 2026-04-22 |
| 4. Admin Panel & Polish | 2/2 | Complete | 2026-04-22 |
| 5. Image & Profile Polish | 1/1 | Complete | 2026-04-22 |
| 6. Advanced Table Management | 1/1 | Complete | 2026-04-23 |
| 7. Rating & Review System | 0/1 | In Progress | - |
| 8. User Address & Profile Management | 0/1 | Planned | - |
| 9. Tailwind CSS Migration | 3/3 | Planned (Ready to execute) | - |
