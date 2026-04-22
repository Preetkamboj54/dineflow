# Phase 3: Restaurant Dashboard - Research

## Goal
Understand the implementation details for the Restaurant Dashboard, focusing on real-time order tracking (Socket.io), Kanban board UI, browser notifications, and menu management.

## Key Findings

### 1. Real-time Order Tracking (Socket.io)
- **Pattern:** The server needs a Socket.io instance attached to the Express app.
- **Client:** The React frontend will use `socket.io-client` to listen for `new_order` and `order_status_update` events.
- **Authentication:** Socket connections should authenticate using the JWT token (passing it via auth headers during connection) to ensure only authorized restaurant staff receive updates.

### 2. Kanban Board UI
- **Pattern:** We will use a column-based layout. CSS Grid or Flexbox is sufficient.
- **Columns:** New, Preparing, Ready, Completed.
- **Interactions:** Moving an order between columns triggers an API call (`PUT /api/orders/:id/status`) which broadcasts the update via Socket.io.

### 3. Browser Notifications
- **Implementation:** Use the native browser `Notification` API.
- **Flow:** When a Socket.io `new_order` event fires, check `Notification.permission`. If granted, instantiate a `new Notification()`. If default, request permission.

### 4. Menu Management (Inline Editing)
- **Implementation:** The menu list maps over items. Each item has an `isEditing` state. When true, fields become inputs.
- **State Management:** Local React state for the edited values, pushing to the server via `PUT /api/restaurants/:id/menu/:itemId` on save.

## Dependencies Needed
- `socket.io` (Server)
- `socket.io-client` (Frontend)

## Validation Architecture
- [ ] Socket connection logic exists on the client and server.
- [ ] Order status updates persist to the database.
- [ ] Kanban layout CSS exists.
- [ ] Browser Notification API usage exists in the client order listener.
