# Phase 8 Plan: User Address & Profile Management

## 08-01: Backend Models and APIs
**Goal**: Update the User model and implement the profile/address management endpoints.

### Tasks
- [ ] **Task 1**: Update `server/models/User.js` to include the `addresses` schema.
- [ ] **Task 2**: Create `server/routes/userRoutes.js` and register it in `server/index.js`.
- [ ] **Task 3**: Implement `updateProfile`, `addAddress`, `updateAddress`, and `deleteAddress` controllers in a new `server/controllers/userController.js`.
- [ ] **Task 4**: Verify endpoints with a test script or Postman/Curl.

## 08-02: Frontend Profile Management UI
**Goal**: Build the user profile page and address management components.

### Tasks
- [ ] **Task 1**: Create `client/src/pages/Profile.jsx` with personal details and address list.
- [ ] **Task 2**: Implement `AddressForm` component (modal or inline) for adding/editing addresses.
- [ ] **Task 3**: Connect the UI to the new backend endpoints using `api.js` utility.
- [ ] **Task 4**: Add a "Profile" link to the global navigation header.

## 08-03: Checkout Integration
**Goal**: Allow users to select or add addresses during the checkout process.

### Tasks
- [ ] **Task 1**: Update `client/src/pages/Checkout.jsx` to fetch and display saved addresses.
- [ ] **Task 2**: Implement address selection logic (setting the delivery address for the order).
- [ ] **Task 3**: Ensure the "Place Order" API call sends the selected address details to the backend.
- [ ] **Task 4**: Test the full flow from address creation to checkout completion.
