# Plan: Phase 05 - Image & Profile Polish

## 1. Backend Updates

### 1.1 Restaurant Model & Controller
- [ ] Ensure `Restaurant` model has all necessary fields (name, cuisine, address, phone, image). (Verified: already has most, just needs ensuring they are editable).
- [ ] Create `updateRestaurantProfile` controller in `restaurantController.js`.
- [ ] Add `PUT /api/restaurants/profile` route (protected by `verifyToken` and `authorize('restaurant')`).

### 1.2 Menu Item Updates
- [ ] Ensure `MenuItem` model has an `image` field.
- [ ] Update `updateMenuItem` controller to handle the `image` URL field.

## 2. Frontend Updates

### 2.1 Restaurant Settings Page
- [ ] Create `RestaurantSettings.jsx` page.
- [ ] Add form to edit restaurant name, cuisine, address, phone, and image URL.
- [ ] Add "Save Changes" button with loading state.

### 2.2 Menu Management Polish
- [ ] Update `MenuManagement.jsx` to include an "Image URL" input in the Add/Edit item forms.
- [ ] Show a preview of the image if the URL is valid.

### 2.3 Dashboard Navigation
- [ ] Add "Settings" link to the Restaurant Dashboard sidebar/header.

## 3. Visual Polish
- [ ] Update `Restaurants.jsx` (Customer Portal) to use the dynamic image URL instead of the placeholder.
- [ ] Update `Menu.jsx` (Customer Portal) to show item images.
- [ ] Implement a fallback image for missing/broken URLs.

## Verification Loop (UAT)
1. Login as restaurant.
2. Go to Settings and update the image URL with a link from the web.
3. Check if the Customer Portal shows the new image.
4. Add a menu item with an image URL and verify its display.
