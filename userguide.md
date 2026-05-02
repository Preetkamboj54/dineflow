# DineFlow — User Guide

**Version:** 1.0  
**Last Updated:** May 2026  

Welcome to DineFlow! This guide walks you through every feature of the platform, organized by your role. Whether you're a **customer** ordering food, a **restaurant owner** managing your business, or a **platform administrator** overseeing operations — this guide has you covered.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Customer Guide](#2-customer-guide)
3. [Restaurant Owner Guide](#3-restaurant-owner-guide)
4. [Admin Guide](#4-admin-guide)

---

## 1. Getting Started

### 1.1 Creating an Account

1. Open the DineFlow application in your browser.
2. Click the **"Register"** button in the top-right corner of the navigation bar.
3. Fill in the registration form:
   - **Full Name** — Your display name on the platform.
   - **Email Address** — Must be unique. This is your login credential.
   - **Phone Number** — Your contact number.
   - **Password** — Choose a secure password.
   - **Role** — Select one:
     - **Customer** — If you want to order food and make reservations.
     - **Restaurant** — If you are a restaurant owner wanting to list your business.
4. Click **"Register"** to create your account.
5. You will be automatically logged in and redirected to your home page.

> **Note for Restaurant Owners:** After registering, your restaurant will **not** be visible to customers immediately. A platform administrator must first approve your listing. You can still set up your menu and profile in the meantime.

### 1.2 Logging In

1. Click **"Login"** in the navigation bar.
2. Enter your registered **Email** and **Password**.
3. Click **"Login"**.
4. You will be redirected based on your role:
   - **Customer / Admin** → Restaurant listings page (homepage).
   - **Restaurant Owner** → Merchant Dashboard.

### 1.3 Logging Out

- Click the **"Logout"** button in the navigation bar. You will be redirected to the login page.
- Your cart contents are preserved in the browser for when you return.

### 1.4 Navigation Bar

Once logged in, the navigation bar shows links based on your role:

| Role | Links Visible |
|:---|:---|
| **Customer** | Orders, Reservations, Profile, Logout |
| **Restaurant** | Merchant Dashboard, Logout |
| **Admin** | Orders, Reservations, Profile, Admin Panel, Logout |

---

## 2. Customer Guide

As a customer, you can browse restaurants, order food, reserve tables, manage your profile, and rate your meals.

### 2.1 Browsing Restaurants

**Where:** Homepage (`/`)

1. After logging in, you land on the **Restaurants** page.
2. You'll see a grid of restaurant cards, each showing:
   - Restaurant name
   - Cuisine type (e.g., Indian, Italian, Chinese)
   - Restaurant image
   - Average rating (⭐ out of 5)
3. **Search:** Use the search bar at the top to filter restaurants by **name** or **cuisine type**. Results update as you type.
4. **Note:** Only restaurants that have been approved by the admin and are currently open will appear in this list.

### 2.2 Viewing a Restaurant's Menu

**Where:** Restaurant Menu page (`/restaurant/:id`)

1. Click on any restaurant card to open its menu.
2. The menu page displays:
   - Restaurant name, cuisine, and address at the top.
   - All available food items with:
     - 🍽️ Item name
     - 📝 Description
     - 💰 Price (in ₹)
     - 📸 Item image
     - ⭐ Average dish rating
3. Items are grouped by **category** (e.g., Starters, Main Course, Desserts, Beverages).
4. Only items marked as **available** by the restaurant are shown.

### 2.3 Adding Items to Cart

**Where:** Restaurant Menu page

1. Next to each menu item, click the **"Add to Cart"** button.
2. The item is added to your shopping cart with a quantity of 1.
3. Adding more of the same item increases the quantity.

> ⚠️ **Important:** Your cart can only contain items from **one restaurant** at a time. If you try to add an item from a different restaurant, your existing cart will be cleared and replaced. A confirmation may be shown.

### 2.4 Reviewing Your Cart

**Where:** Cart page (`/cart`)

1. Click **"Cart"** or navigate to `/cart`.
2. Your cart shows:
   - Each item with its name, unit price, and quantity.
   - **Quantity controls** — Use the **+** and **−** buttons to adjust quantities.
   - **Remove** — Set quantity to 0 or click remove to delete an item.
   - **Running total** — The cart total updates automatically as you change quantities.
3. Click **"Proceed to Checkout"** when you're ready.

### 2.5 Checkout & Placing an Order

**Where:** Checkout page (`/checkout`)

The checkout page is split into two sections:

#### Step 1: Select a Delivery Address

- Your **saved addresses** are displayed as selectable cards.
- The card with the blue checkmark (✓) is your currently selected address.
- Click any address card to select it.
- To add a new address:
  1. Click **"+ Add New Address"** at the top right.
  2. A modal form appears. Fill in:
     - **Label** — e.g., "Home", "Office", "Hostel"
     - **Street Address**
     - **City**
     - **State**
     - **Zip Code**
  3. Click **"Save & Select"** — the address is saved to your profile and auto-selected.

#### Step 2: Choose Payment Method

Select one of two options:
- **💵 Cash on Delivery (COD)** — Pay the delivery person in cash when your food arrives.
- **🏪 Pay at Restaurant** — Pick up your order and pay in person at the restaurant counter.

#### Step 3: Review Order Summary

The right sidebar shows:
- Itemized list with quantities and line totals.
- Subtotal.
- Delivery Fee: **FREE**.
- **Total amount** highlighted in the brand color.

#### Step 4: Place Order

1. Ensure an address is selected (a warning appears if none is chosen).
2. Click **"Place Order"**.
3. Wait for confirmation — a success alert will appear.
4. Your cart is automatically cleared.
5. You are redirected to the **Order History** page.

### 2.6 Viewing Order History

**Where:** Order History page (`/order-history`)  
**Navigation:** Click **"Orders"** in the navbar.

1. All your past orders are listed in reverse chronological order (newest first).
2. Each order card shows:
   - 🏪 Restaurant name
   - 🔖 Order ID (last 8 characters) and date
   - 💰 Total amount
   - 📊 Status badge:
     - 🟢 Green = **Completed**
     - 🔴 Red = **Cancelled**
     - 🟣 Indigo = **Pending / Preparing / Ready**

3. **View Details:** Click any order card to open a detail modal showing:
   - Restaurant name
   - Order date and time
   - Full itemized list with quantities and prices at time of order
   - Payment method
   - Total amount

4. **Rate Order:** If an order's status is **"Completed"**, a **"Rate Order"** button appears in the detail modal.

### 2.7 Rating & Reviewing an Order

**Where:** Review Modal (opened from Order History)

1. In the Order History detail modal, click **"Rate Order"** (only visible for completed orders).
2. The **Review Modal** opens with:

   **a) Restaurant Rating:**
   - Click on the stars (1–5) to rate the overall restaurant experience.
   - Stars light up in amber as you click.

   **b) Dish Ratings:**
   - Each dish you ordered is listed separately.
   - Rate each dish individually from 1–5 stars.

   **c) Comment (Optional):**
   - Write a text comment about your experience.
   - This field is optional — you can submit with just star ratings.

3. Click **"Submit Review"**.
4. A confirmation alert appears: *"Thank you for your feedback!"*

> **Note:** You can only review an order **once**. If you've already reviewed an order, attempting again will show an error: *"Order already reviewed."*

> **How Ratings Work:** Your ratings are aggregated into the restaurant's and each dish's overall rating using a running average. This means every review has a real impact on what other customers see.

### 2.8 Making a Table Reservation

**Where:** Reservation page (`/reservation/:id`)  
**How to get there:** Click the **"Reserve a Table"** button on a restaurant's menu page.

1. Fill in the reservation form:
   - **📅 Date** — Select a future date. Past dates are rejected by the server.
   - **🕐 Time** — Choose your preferred dining time.
   - **👥 Party Size** — Enter the number of guests (minimum 1).
   - **🪑 Seating Preference** — Choose from:
     - Indoor
     - Outdoor
     - Window
     (Options depend on what the restaurant offers.)

2. Click **"Request Reservation"**.
3. If the time slot has available capacity, your reservation is created with status **"Pending"**.
4. If the slot is full, you'll see: *"This time slot is already full."*

> The restaurant owner will then **Confirm** or **Cancel** your reservation from their dashboard.

### 2.9 Viewing Your Reservations

**Where:** My Reservations page (`/my-reservations`)  
**Navigation:** Click **"Reservations"** in the navbar.

1. All your reservations are listed, sorted by date and time.
2. Each reservation shows:
   - Restaurant name
   - Date and time
   - Party size
   - Status badge:
     - 🟡 **Pending** — Awaiting restaurant confirmation
     - 🟢 **Confirmed** — Your table is booked
     - 🔴 **Cancelled** — The reservation was cancelled

### 2.10 Managing Your Profile

**Where:** Profile page (`/profile`)  
**Navigation:** Click **"Profile"** in the navbar.

The profile page has two sections:

#### Account Details (Left Panel)

1. Edit your:
   - **Full Name**
   - **Email Address** (must be unique — the system checks for duplicates)
   - **Phone Number**
2. Click **"Update Profile"** to save changes.
3. A green success message confirms the update.

#### Saved Addresses (Right Panel)

1. **View:** All your saved addresses are displayed as cards with the label, full address, and a "Default" badge if applicable.

2. **Add New Address:**
   - Click **"+ Add New"**.
   - Fill in: Label, Street, City, State, Zip Code.
   - Check **"Set as default address"** if desired.
   - Click **"Save Address"**.

3. **Edit Address:**
   - Click **"Edit"** on any address card.
   - Modify the fields and save.

4. **Delete Address:**
   - Click **"Delete"** on any address card.
   - Confirm the deletion in the popup.
   - If you delete the default address, the first remaining address automatically becomes the new default.

---

## 3. Restaurant Owner Guide

As a restaurant owner, you manage your business through the **Merchant Dashboard** — a dedicated control center with four tabbed sections.

### 3.1 Accessing the Merchant Dashboard

**Where:** Dashboard page (`/dashboard`)

- After logging in with a restaurant account, you are automatically redirected to the Merchant Dashboard.
- The dashboard header displays:
  - Your restaurant's **image**, **name**, **cuisine type**, and **address**.
  - **Status Badges:**
    - 🟢 **"Accepting Orders"** — Your restaurant is open and receiving orders.
    - 🔴 **"Store Closed"** — Your restaurant is temporarily closed.
    - 🟣 **"Verified Partner"** — An admin has approved your listing.
    - 🟠 **"Verification Pending"** — Your listing is awaiting admin approval. Customers cannot see your restaurant yet.

### 3.2 Tab 1: Live Orders (🛍️)

This is the real-time order management hub — the heart of your daily operations.

#### Understanding the Kanban Board

Orders are displayed in a **4-column Kanban board**. Each column represents a stage in the order pipeline:

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  PENDING │→│PREPARING │→│  READY   │→│COMPLETED │
│          │  │          │  │          │  │          │
│ New      │  │ Being    │  │ Waiting  │  │ Done &   │
│ orders   │  │ cooked   │  │ for      │  │ archived │
│ arrive   │  │          │  │ pickup   │  │          │
│ here     │  │          │  │          │  │          │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

Each column header shows a **count badge** with the number of orders in that stage.

#### Order Cards

Every order card displays:
- **Order ID** — Last 6 characters for quick reference.
- **Total Amount** — In ₹ (green highlight).
- **Customer Name** — Who placed the order.
- **Customer Phone** — For direct contact if needed.
- **Timestamp** — When the order was placed.
- **Delivery Address** — The customer's delivery location (label, street, city).
- **Items List** — Itemized breakdown (e.g., "2x Butter Chicken", "1x Naan").

#### Processing Orders Step-by-Step

1. **New Order Arrives:**
   - The order appears in the **Pending** column automatically via real-time Socket.io updates.
   - You receive a **browser notification** (if you've allowed notifications): *"New Order Received!"*
   - No page refresh needed — it just appears.

2. **Accept the Order:**
   - Click the **"Accept"** button on the order card.
   - The order moves from **Pending → Preparing**.
   - The customer's order status is updated in real-time.

3. **Mark as Ready:**
   - Once the food is prepared, click **"Mark Ready"**.
   - The order moves from **Preparing → Ready**.
   - This signals that the food is waiting for pickup/delivery.

4. **Complete the Order:**
   - After the customer receives their food, click **"Complete"**.
   - The order moves from **Ready → Completed**.
   - This order now counts toward your platform revenue.

> **Tip:** Keep this tab open during business hours. The real-time connection means orders appear the instant a customer places them — no delays, no missed orders.

### 3.3 Tab 2: Reservations (📅)

**Where:** Reservations tab in the Merchant Dashboard

This tab shows all **upcoming reservations** (today and future) for your restaurant.

#### Reservation Details

Each reservation card displays:
- **Customer Name** — Who made the reservation.
- **Email** — Customer's email address.
- **Phone Number** — For direct contact.
- **Date & Time** — When the reservation is scheduled.
- **Party Size** — Number of guests expected.
- **Seating Preference** — Indoor, Outdoor, or Window.
- **Status** — Current reservation status.

#### Managing Reservations

- **Confirm:** Click the **"Confirm"** button to confirm a pending reservation. The customer will know their table is secured.
- **Cancel:** Click the **"Cancel"** button to decline a reservation. This frees up the time slot for other customers.

> Only reservations from **today onward** are displayed. Past reservations are automatically filtered out.

### 3.4 Tab 3: Menu Manager (🍴)

**Where:** Menu Manager tab in the Merchant Dashboard

This is where you manage your restaurant's food offerings. You have full **Create, Read, Update, Delete (CRUD)** control.

#### Viewing Your Menu

- All your menu items are displayed in a list/grid format.
- Each item shows: name, description, price, category, image, availability status, and rating.

#### Adding a New Menu Item

1. Click the **"Add New Item"** button.
2. Fill in the form:
   - **Name** — Dish name (e.g., "Butter Chicken").
   - **Description** — Brief description of the dish.
   - **Price** — Price in ₹.
   - **Category** — Group your item (e.g., "Starters", "Main Course", "Desserts", "Beverages").
   - **Image URL** — Link to a dish image.
   - **Available** — Toggle whether the item is currently available.
3. Click **"Save"** to add the item to your menu.
4. The item is immediately visible to customers (if your restaurant is approved and the item is marked available).

#### Editing a Menu Item

1. Click the **"Edit"** button on any existing menu item.
2. Modify any field — name, description, price, category, image, or availability.
3. Click **"Save"** to apply changes.

> **Price Update Note:** Changing a price only affects future orders. Past orders retain the price at the time they were placed (historical price is captured in `OrderItem.priceAtTimeOfOrder`).

#### Deleting a Menu Item

1. Click the **"Delete"** button on an item.
2. The item is permanently removed from your menu.
3. It will no longer appear to customers.

#### Toggling Availability

- Use the **availability toggle** to quickly mark an item as unavailable (e.g., out of stock) without deleting it.
- Unavailable items are hidden from the customer-facing menu but remain in your dashboard for easy re-enabling.

### 3.5 Tab 4: Profile Settings (⚙️)

**Where:** Profile Settings tab in the Merchant Dashboard

Update your restaurant's public information:

| Field | What It Controls |
|:---|:---|
| **Restaurant Name** | The name customers see in listings |
| **Cuisine Type** | Searchable cuisine category (e.g., "North Indian", "Chinese") |
| **Address** | Your restaurant's physical location |
| **Phone Number** | Contact number shown to admin |
| **Image URL** | Your restaurant's display image |
| **Seating Options** | Available seating types for reservations (Indoor, Outdoor, Window) |

1. Edit any field.
2. Click **"Save Changes"**.
3. Changes are reflected immediately across the platform.

---

## 4. Admin Guide

As the platform administrator, you have two superpowers: **platform-wide oversight** and **full customer capabilities**.

### 4.1 Accessing the Admin Panel

**Where:** Admin Dashboard (`/admin-dashboard`)  
**Navigation:** Click **"Admin Panel"** in the navbar.

The Admin Panel is divided into two main sections:
1. **KPI Dashboard** — Platform-wide performance metrics at a glance.
2. **Restaurant Management** — Control over all restaurants on the platform.

### 4.2 KPI Dashboard Cards

At the top of the Admin Panel, four stat cards give you an instant snapshot of the platform:

| Card | What It Shows | How It's Calculated |
|:---|:---|:---|
| 💰 **Total Revenue** | Total earnings from completed orders | Sum of `totalAmount` from all orders with status "Completed". Only fully completed orders count — pending, preparing, or cancelled orders are excluded. |
| 👥 **Total Users** | Number of registered accounts | Count of all users in the database — includes customers, restaurant owners, and admin accounts. |
| 📦 **Active Orders** | Total order count | Count of all orders ever placed on the platform (all statuses included). |
| 🏆 **Top Restaurant** | Most popular restaurant | The restaurant that has received the most orders (by total order count, not revenue). Determined by grouping all orders by restaurant and picking the one with the highest count. |

> These metrics refresh every time you load or revisit the Admin Panel.

### 4.3 Restaurant Onboarding

When a new restaurant registers on DineFlow, here's what happens behind the scenes:

```
Restaurant Owner                        System                              Admin
      |                                   |                                   |
      | 1. Registers with role="restaurant"|                                   |
      |──────────────────────────────────→|                                   |
      |                                   | 2. Creates User + Restaurant       |
      |                                   |    (isApproved = false)            |
      |                                   |                                   |
      |                                   | 3. Restaurant is HIDDEN            |
      |                                   |    from customers                  |
      |                                   |                                   |
      |                                   |                                   |
      |                                   | 4. Restaurant appears in          |
      |                                   |    Admin Panel with                |
      |                                   |    "Pending" badge       ────────→|
      |                                   |                                   |
      |                                   |                         5. Admin  |
      |                                   |                         clicks    |
      |                                   |                         "Approve" |
      |                                   |←──────────────────────────────────|
      |                                   |                                   |
      |                                   | 6. isApproved = true              |
      |                                   |    Restaurant is NOW VISIBLE       |
      |                                   |    to all customers                |
      |                                   |                                   |
```

**Your role as Admin:**
1. Navigate to the **Admin Panel**.
2. Scroll down to the **Restaurant Management** table.
3. Look for restaurants with a 🟠 **"Pending"** badge in the Approval column.
4. Review the restaurant details (Name, Cuisine).
5. Click **"Approve"** to make the restaurant live.

### 4.4 Restaurant Management Table

The table lists **all restaurants** (both approved and pending) with the following columns:

| Column | Description |
|:---|:---|
| **Name** | Restaurant display name |
| **Cuisine** | Type of cuisine offered |
| **Status** | 🟢 Open or 🔴 Closed — whether the restaurant is accepting orders |
| **Approval** | 🔵 Approved or 🟠 Pending — whether the restaurant is visible to customers |
| **Actions** | Control buttons for managing the restaurant |

### 4.5 Admin Actions

For each restaurant, you have two toggle actions:

#### Approve / Revoke Access

- **"Approve"** button (shown when Pending) → Sets `isApproved = true`. The restaurant immediately becomes visible in customer listings.
- **"Revoke"** button (shown when Approved) → Sets `isApproved = false`. The restaurant is **immediately hidden** from all customer-facing pages. Existing orders are not affected, but no new orders can be placed.

> **Use Case:** If a restaurant consistently provides poor service or violates platform policies, revoking access removes them from the platform without deleting their data.

#### Open / Close Restaurant

- **"Close"** button → Sets `isOpen = false`. The restaurant remains visible in listings but cannot receive new orders.
- **"Open"** button → Sets `isOpen = true`. The restaurant resumes accepting orders.

> **Use Case:** Useful when a restaurant needs to temporarily pause operations (e.g., during renovations or holidays) without losing their platform presence.

### 4.6 Using DineFlow as a Customer (Admin Dual-Role)

As an admin, you have **full access to all customer features**. The navigation bar includes:
- **Orders** — View your own order history.
- **Reservations** — View your own reservations.
- **Profile** — Manage your profile and delivery addresses.

You can:
- ✅ Browse restaurants and menus.
- ✅ Add items to cart and place orders.
- ✅ Make table reservations.
- ✅ Rate and review completed orders.
- ✅ Manage your profile and saved addresses.

This dual-role capability allows you to:
- **Test the customer experience** first-hand.
- **Place real orders** to verify restaurant operations.
- **Quality-check new restaurants** before or after approving them.

> Your admin orders appear as regular customer orders in the restaurant's order queue — the restaurant owner sees your name and order just like any other customer.

---

## 5. Quick Reference & Tips

### 5.1 Keyboard Shortcuts

The platform is fully navigable via mouse/touch. No custom keyboard shortcuts are implemented in v1.0.

### 5.2 Browser Notifications (Restaurant Owners)

- The first time you open the Live Orders tab, your browser will ask for **notification permission**.
- **Allow** notifications to receive instant alerts when new orders arrive, even if the browser tab is in the background.
- These are standard Web Notifications — they work on Chrome, Firefox, Edge, and Safari.

### 5.3 Cart Persistence

- Your shopping cart is saved in the browser's **localStorage**.
- If you close the browser or navigate away, your cart items are preserved when you return.
- Logging out does **not** clear your cart.

### 5.4 Session Duration

- Your login session lasts **30 days** (JWT token expiry).
- After 30 days, you will need to log in again.
- Sessions are synced across browser tabs — logging in/out in one tab affects all tabs.

---

## 6. Frequently Asked Questions

**Q: I registered as a restaurant, but customers can't find me. Why?**  
A: New restaurants require admin approval before they appear in customer listings. Wait for the admin to approve your restaurant. You'll see "Verified Partner" in your dashboard when approved.

**Q: Can I order from multiple restaurants at once?**  
A: No. Your cart is locked to one restaurant at a time. Adding items from a different restaurant will clear your existing cart.

**Q: I changed my menu prices. Will it affect existing orders?**  
A: No. The system captures the price at the time of ordering. Past orders retain their original prices.

**Q: How do I become an admin?**  
A: Admin accounts are created by running the `seed-admin.js` script on the server. They cannot be created through the regular registration flow.

**Q: Can I cancel my own order?**  
A: In v1.0, order cancellation is handled by the restaurant or admin. Contact the restaurant directly using their listed phone number.

**Q: How are restaurant ratings calculated?**  
A: Ratings use a running average. Each new review updates the average: `newAvg = (oldAvg × totalReviews + newRating) / (totalReviews + 1)`. Both restaurant-level and dish-level ratings work this way.

**Q: Can a restaurant owner also order food as a customer?**  
A: In v1.0, each account has a single role. To order food, a restaurant owner would need a separate customer account.

---

*End of User Guide*
