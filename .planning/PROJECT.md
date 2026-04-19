# DineFlow

## What This Is

DineFlow is a full-stack online food ordering and restaurant management platform. It bridges the gap between customers and restaurants by providing a seamless, responsive web application where users can browse menus, place orders, and reserve tables, while restaurant owners can manage their offerings, inventory, and orders from a single dashboard.

## Core Value

A fast, intuitive, and scalable food ordering experience that eliminates manual processes and empowers restaurant operators with modern tools.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Provide user registration, login, and profile management for customers, restaurants, and admins.
- [ ] Allow customers to browse restaurants, view menus, search for food, and manage a cart.
- [ ] Enable customers to place orders (COD/Pay at Restaurant) and track order history.
- [ ] Implement a table reservation system with conflict-free scheduling.
- [ ] Provide a dashboard for restaurants to manage menus (CRUD) and a live order queue via Socket.io.
- [ ] Supply an admin panel for user management, restaurant onboarding, and platform oversight.

### Out of Scope

- Online payment gateway integration (Credit Card/UPI) — Deferred to future releases.
- Real-time GPS delivery tracking — Deferred to future releases.
- Native mobile application (iOS/Android) — Deferred to future releases.
- AI-based food recommendation engine — Deferred to future releases.
- Customer ratings and reviews system — Deferred to future releases.
- Multi-language / localization support — Deferred to future releases.

## Context

Traditional restaurant operations rely heavily on manual processes (paper menus, verbal orders), leading to inaccuracies, long wait times, and inefficiency. DineFlow targets both individual consumers seeking convenience and restaurant operators aiming to reduce manual overhead. The platform is built on a modern MERN-adjacent stack (React, Node, Express, MongoDB, Socket.io).

## Constraints

- **Tech Stack**: MERN Stack with Socket.io — Defined by the PRD for scalable architecture.
- **Performance**: Page load < 3s, API response < 500ms — Ensure a fast experience.
- **Responsiveness**: Support 320px to 1920px — Must work across all devices.
- **Security**: JWT auth, bcrypt passwords — Protect user data.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Socket.io for live orders | Enables real-time queue management without manual refreshing | — Pending |
| Defer Payments to v2 | Focuses v1 on core ordering and reservation workflows | — Pending |

---
*Last updated: 2026-04-19 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
