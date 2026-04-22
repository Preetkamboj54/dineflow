# Phase 3: Restaurant Dashboard - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Provide restaurants with tools to manage menus and handle incoming orders in real-time. Includes menu management (REST-01), live order tracking via Socket.io (REST-02, REST-03, REST-04), and viewing upcoming table reservations (REST-05).

</domain>

<decisions>
## Implementation Decisions

### Real-time Order Queue UI
- **D-01:** Present incoming orders using a Kanban board format (with columns for statuses like New, Preparing, Ready, Completed).

### Menu Management Flow
- **D-02:** Edit menu items inline on the menu page rather than using a dedicated form or modal.

### Notification Behavior
- **D-03:** Alert staff of new orders via Socket.io using browser notifications.

### Reservation View
- **D-04:** Display today's table reservations as a simple list.

### the agent's Discretion
- Exact styling and colors for the Kanban board columns
- Layout of the inline menu editing fields
- Browser notification text/content

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `.planning/REQUIREMENTS.md` — Section "Restaurant Dashboard" for REST-01 to REST-05 definitions.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `server/src/middleware/authMiddleware.js`: Use for protecting restaurant routes.
- `server/models/User.js`: Verify user role is 'Restaurant'.

### Established Patterns
- JWT session authentication pattern from Phase 1.
- Mongoose schemas established in Phase 1 and 2.

### Integration Points
- REST API routes should integrate under `/api/restaurant` or similar protected space.
- Socket.io connection needs to be initialized in `server/server.js`.

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-restaurant-dashboard*
*Context gathered: 2026-04-22*
