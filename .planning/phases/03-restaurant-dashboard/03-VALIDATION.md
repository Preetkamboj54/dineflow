# Phase 3: Restaurant Dashboard - Validation

**Created:** 2026-04-22
**Status:** Pending

## Validation Strategy
We will validate Phase 3 by ensuring:
1. Restaurant staff can perform CRUD operations on their menu items inline.
2. The real-time order queue (Kanban) functions correctly with Socket.io updates.
3. Order statuses can be advanced.
4. Table reservations are listed accurately.
5. Browser notifications trigger on new orders.

## Must-Haves
- Socket.io connection established.
- JWT token used for Socket.io authentication.
- API endpoints for `/api/restaurants/menu` and `/api/orders` are protected.

## Observability Checks
- Server logs Socket.io connection and disconnection events.
