---
status: skipped
phase: 02-customer-portal
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md]
started: 2026-04-19T10:00:00Z
updated: 2026-04-22T10:00:00Z
---

## Current Test

number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.

## Tests

### 1. Cold Start Smoke Test
expected: Server boots from scratch without errors and returns live data on basic API call.
result: [pending]

### 2. Restaurant Search
expected: Searching for a cuisine (e.g., "Italian") returns restaurants matching that cuisine.
result: [pending]

### 3. Food Search
expected: Searching for a food item (e.g., "Pizza") returns matching items across various restaurants.
result: [pending]

### 4. Menu Loading
expected: Navigating to a specific restaurant's menu loads the correct items for that restaurant.
result: [pending]

### 5. Persistent Cart
expected: Items added to the cart persist after a page refresh.
result: [pending]

### 6. Cart Restaurant Isolation
expected: Adding an item from Restaurant B clears the cart if it contains items from Restaurant A.
result: [pending]

### 7. Secure Checkout
expected: Checkout completes successfully and the server validates the total price against the database.
result: [pending]

### 8. Order History
expected: Customers can view a list of their past orders and their current statuses.
result: [pending]

### 9. Table Reservation
expected: Customers can successfully book a table for a future date, time, and party size.
result: [pending]

### 10. Reservation Conflict Detection
expected: Booking a table for a slot that is already full returns a conflict error.
result: [pending]

### 11. Future Date Validation
expected: Attempting to book a table for a date in the past returns a validation error.
result: [pending]

## Summary

total: 11
passed: 0
issues: 0
pending: 11
skipped: 0

## Gaps

[none yet]
