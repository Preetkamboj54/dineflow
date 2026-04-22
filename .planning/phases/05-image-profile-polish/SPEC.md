# Specification: Phase 05 - Image & Profile Polish

## Goal
Allow restaurant owners to update their profile information and provide external image URLs for their restaurant and menu items, eliminating the use of hardcoded placeholders.

## Requirements

### IMG-01: Restaurant Profile Editing
- Add a "Settings" or "Profile" section to the `RestaurantDashboard.jsx`.
- Allow editing:
    - **Restaurant Name**
    - **Cuisine Type**
    - **Address**
    - **Phone Number**
    - **Image URL** (Link to an image on the internet)

### IMG-02: Menu Item Image Support
- Update the Menu Management section to include an **Image URL** field for each dish.
- Ensure the Menu display on the customer side uses these URLs.

### IMG-03: Default Fallbacks
- If no URL is provided, display a high-quality default "Food" image instead of a broken link.

## Success Criteria
1. Restaurant owners can change their storefront image by pasting a link.
2. Customers see actual food images instead of placeholders.
3. The "Address" and "Phone" fields are no longer hardcoded to defaults.

## Ambiguity Score: 0/10
Extremely clear. Just adding input fields and updating the database.
