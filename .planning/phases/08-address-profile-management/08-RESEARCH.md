# Phase 8 Research: User Address & Profile Management

## Problem Statement
Currently, users (customers) have minimal profile management. Specifically:
1. No way to store or manage delivery addresses.
2. Checkout requires manual address entry (or it's currently hardcoded/simplified).
3. No dedicated UI to update personal details (name, email, phone).

## Proposed Solution

### 1. Data Model Updates
- **User Model**: Add `addresses` field.
  - `addresses`: Array of Objects
    - `label`: String (e.g., "Home", "Work")
    - `street`: String
    - `city`: String
    - `state`: String
    - `zipCode`: String
    - `isDefault`: Boolean
- **Order Model**: (Verification) Ensure it captures the specific address used at the time of order, rather than just a reference (to handle address deletions/changes).

### 2. API Endpoints
- `GET /api/users/profile`: Fetch current user's full profile including addresses.
- `PUT /api/users/profile`: Update name, phone, and email.
- `POST /api/users/addresses`: Add a new address.
- `PUT /api/users/addresses/:addressId`: Update an existing address.
- `DELETE /api/users/addresses/:addressId`: Remove an address.

### 3. Frontend Components
- **Profile Page (`/profile`)**:
  - Personal Details Form (Name, Email, Phone).
  - Address Manager (List of cards with Edit/Delete/Add buttons).
- **Checkout Integration**:
  - Address selection dropdown or card list.
  - "Add New Address" modal/form inline.

## Technical Considerations
- **Security**: Ensure users can only modify their own profiles/addresses.
- **UX**: Use the "Indigo Essence" design system (glassmorphism, Tailwind).
- **Default Address**: Logic to automatically select the default address at checkout.

## UI Sketch (Indigo Essence)
- Profile header with user avatar and basic info.
- Tabbed interface or vertical sections for "Account Details" and "Saved Addresses".
- Address cards with subtle borders and "Default" badges.
