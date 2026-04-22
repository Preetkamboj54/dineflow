# Plan: Phase 07 - Rating & Review System

## 1. Schema & Backend Updates

### 1.1 Review Model
- [ ] Create `Review` model:
    - `userId`: Reference to User.
    - `restaurantId`: Reference to Restaurant.
    - `orderId`: Reference to Order (to ensure only buyers review).
    - `dishRatings`: Array of `{ menuItemId, rating, comment }`.
    - `restaurantRating`: Number (1-5).
    - `comment`: String (general feedback).

### 1.2 Model Enhancements
- [ ] Update `Restaurant` model:
    - Add `numReviews`: Number (default 0).
    - Add `totalRatingScore`: Number (to calculate avg efficiently).
- [ ] Update `MenuItem` model:
    - Add `rating`: Number (default 0).
    - Add `numReviews`: Number (default 0).

### 1.3 Controllers & Routes
- [ ] `reviewController.js`:
    - `createReview`: Save review and update Restaurant/MenuItem aggregates.
    - `getRestaurantReviews`: Fetch reviews for a specific restaurant.
- [ ] `reviewRoutes.js`: Add routes and register in `server.js`.

## 2. Frontend Implementation

### 2.1 Order History Update
- [ ] Update `OrderHistory.jsx`:
    - Show "Rate This Order" button for `Delivered` or `Completed` orders.
    - Prevent multiple reviews for the same order.

### 2.2 Review Interface
- [ ] Create `ReviewModal.jsx`:
    - Star rating for the restaurant.
    - List of items from the order with individual star ratings.
    - Text area for comments.

### 2.3 Display Updates
- [ ] `Restaurants.jsx`: Show star rating and review count on cards.
- [ ] `RestaurantMenu.jsx`: Show average rating badge next to each dish.

## 3. Logic: Aggregating Ratings
- [ ] When a review is saved:
    - `avgRating = (totalScore + newRating) / (numReviews + 1)`
    - Update both Restaurant and relevant MenuItems.
