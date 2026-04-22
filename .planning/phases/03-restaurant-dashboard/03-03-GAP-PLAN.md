---
gap_closure: true
---

# Plan 03-03 (Gaps)

## Identified Gaps
1. **Server Crash on Start**: `orderSocket.js` fails to find `../utils/tokenUtils`.
2. **Client Build Error**: `MenuManager.jsx`, `ReservationList.jsx`, `OrderKanban.jsx`, and `RestaurantDashboard.jsx` fail to resolve `../utils/api`.

## Fix Implementation
1. Updated `server/sockets/orderSocket.js` to require `../src/utils/tokenUtils`.
2. Created `client/src/utils/api.js` with an axios instance that automatically injects the Bearer token from localStorage to satisfy the imports in the new UI components.
