# Plan: Phase 06 - Advanced Table Management

## 1. Schema & Backend Updates

### 1.1 Restaurant Model
- [ ] Add `seatingOptions` array to `Restaurant` model (e.g., `['Indoor', 'Outdoor', 'Window']`).
- [ ] Ensure `seatingOptions` is editable in `RestaurantSettings.jsx`.

### 1.2 Reservation Model
- [ ] Add `seatingPreference` field to `Reservation` model.
- [ ] Ensure `status` enum includes `Confirmed` and `Cancelled` (already does).

### 1.3 Controllers
- [ ] Create `updateReservationStatus` in `reservationController.js`.
- [ ] Update `createReservation` to accept `seatingPreference`.

## 2. Restaurant Dashboard Updates

### 2.1 Management UI
- [ ] Update `ReservationList.jsx` to include **Confirm** and **Decline** buttons.
- [ ] Display the customer's seating preference.

### 2.2 Settings UI
- [ ] Add a way for restaurants to manage their `seatingOptions` in `RestaurantSettings.jsx`.

## 3. Customer Portal Updates

### 3.1 Booking Form
- [ ] Update `Reservation.jsx` to fetch restaurant seating options and show a dropdown.

### 3.2 My Reservations Page
- [ ] Create `MyReservations.jsx` to show all reservations made by the user.
- [ ] Add "My Reservations" link to the main navigation header.

## 4. Visual Polish
- [ ] Use the new "Premium Card" design for reservation lists.
- [ ] Add status-based color badges.
