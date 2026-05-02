# DineFlow — Comprehensive Project Documentation

**Version:** 1.0  
**Date:** May 2026  
**Author:** Preet  
**Institution:** Govt. Polytechnic for Women, Sirsa  

---

## 1. Project Overview

DineFlow is a full-stack online food ordering and restaurant management platform that digitizes the traditional dining experience. It connects **customers**, **restaurant owners**, and **platform administrators** through a single, responsive web application. Customers can browse restaurants, place orders, reserve tables, and rate their meals. Restaurant owners manage menus, process orders in real-time, and handle reservations. Administrators oversee the entire platform — onboarding restaurants, monitoring KPIs, and managing access control.

**Live Deployment:** The backend API is deployed on Render at `https://dirflow.onrender.com`.

---

## 2. Technology Stack

### 2.1 Frontend Technologies

| Technology | Version | Purpose |
|:---|:---|:---|
| **React.js** | 19.2.5 | Component-based UI library for building the single-page application |
| **React Router DOM** | 7.14.1 | Client-side routing and navigation between pages |
| **Vite** | 8.0.4 | Lightning-fast development server and production build tool |
| **Tailwind CSS** | 4.2.4 | Utility-first CSS framework for responsive styling |
| **Axios** | 1.15.0 | Promise-based HTTP client for making API requests |
| **Socket.io Client** | 4.8.3 | Real-time WebSocket communication for live order updates |
| **TypeScript** | 6.0.2 | Type-safe JavaScript superset (build tooling) |

### 2.2 Backend Technologies

| Technology | Version | Purpose |
|:---|:---|:---|
| **Node.js** | — | Server-side JavaScript runtime environment |
| **Express.js** | 5.2.1 | RESTful API framework with middleware support |
| **Mongoose** | 9.4.1 | MongoDB ODM for schema-based data modeling |
| **Socket.io** | 4.8.3 | Real-time bidirectional event-based communication |
| **JSON Web Token (JWT)** | 9.0.3 | Stateless authentication via signed tokens |
| **bcryptjs** | 3.0.3 | Secure password hashing with salt rounds |
| **cors** | 2.8.6 | Cross-Origin Resource Sharing middleware |
| **dotenv** | 17.4.2 | Environment variable management |

### 2.3 Database

| Technology | Purpose |
|:---|:---|
| **MongoDB** | NoSQL document-oriented database for flexible, schema-less data storage |

### 2.4 Development & Testing Tools

| Tool | Version | Purpose |
|:---|:---|:---|
| **Nodemon** | 3.1.14 | Auto-restart server on file changes during development |
| **Jest** | 30.3.0 | JavaScript testing framework |
| **Supertest** | 7.2.2 | HTTP assertion library for API endpoint testing |
| **MongoDB Memory Server** | 11.0.1 | In-memory MongoDB instance for isolated unit tests |

---

## 3. Backend Architecture

### 3.1 Architecture Pattern

The backend follows a **layered MVC (Model-View-Controller)** architecture:

```
server/
├── server.js              # Entry point — HTTP server + Socket.io setup
├── app.js                 # Express app configuration, middleware, route mounting
├── config/
│   └── db.js              # MongoDB connection using Mongoose
├── middleware/
│   └── authMiddleware.js  # JWT verification & role-based authorization
├── models/                # Mongoose schemas (data layer)
│   ├── User.js
│   ├── Restaurant.js
│   ├── MenuItem.js
│   ├── Order.js
│   ├── OrderItem.js
│   ├── Reservation.js
│   └── Review.js
├── controllers/           # Business logic (controller layer)
│   ├── authController.js
│   ├── adminController.js
│   ├── orderController.js
│   ├── reservationController.js
│   ├── restaurantController.js
│   ├── reviewController.js
│   └── userController.js
├── routes/                # Express route definitions (routing layer)
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   ├── orderRoutes.js
│   ├── reservationRoutes.js
│   ├── restaurantRoutes.js
│   ├── reviewRoutes.js
│   └── userRoutes.js
├── sockets/
│   └── orderSocket.js     # Socket.io event handlers for real-time orders
├── seed.js                # Database seeder script
├── seed-admin.js          # Admin account seeder
└── tests/                 # Jest + Supertest test suites
```

### 3.2 Server Initialization Flow

1. **`server.js`** creates an HTTP server wrapping the Express `app`.
2. A **Socket.io** instance is attached to the HTTP server with CORS enabled for all origins.
3. The `setupSocket(io)` function from `sockets/orderSocket.js` registers socket middleware and event handlers.
4. The `io` instance is stored on the Express app via `app.set('io', io)` so controllers can emit events.
5. The server listens on `PORT` (default `5000`).

### 3.3 Middleware Pipeline

Every incoming request passes through:

1. **CORS** — `cors()` allows cross-origin requests from the frontend.
2. **JSON Parser** — `express.json()` parses incoming JSON request bodies.
3. **Request Logger** — Logs `METHOD URL` for every request to the console.
4. **Route-specific middleware:**
   - `protect` — Extracts and verifies the JWT from the `Authorization: Bearer <token>` header, attaches the authenticated user to `req.user`.
   - `authorize(...roles)` — Checks that `req.user.role` is in the allowed roles array; returns `403` if not.

### 3.4 Authentication & Authorization

- **Registration:** Passwords are hashed using `bcryptjs` with a salt factor of 10. A JWT is signed with `{ id, role, email }` payload and a 30-day expiry.
- **Login:** Email/password validated against the database; on success, a new JWT is issued.
- **Token Verification:** The `protect` middleware decodes the JWT using `JWT_SECRET`, fetches the user from the database (excluding the password hash), and attaches it to `req.user`.
- **Role Authorization:** The `authorize` middleware is a higher-order function that accepts allowed roles and gates access.

### 3.5 Real-Time Communication (Socket.io)

- **Authentication:** Socket connections require a valid JWT in `socket.handshake.auth.token`. Only users with the `restaurant` role can connect.
- **Room-based architecture:** Each restaurant joins a room identified by its `restaurantId`. When a customer places an order, the server emits a `new_order` event to that restaurant's room.
- **Events:**
  - `new_order` — Emitted when a customer places a new order. Sent to the restaurant's room.
  - `order_status_update` — Emitted when a restaurant updates an order's status. Sent to the restaurant's room.

### 3.6 API Route Summary

| Base Path | Module | Auth Required | Role Guard |
|:---|:---|:---|:---|
| `/api/auth` | Authentication (register, login) | No | — |
| `/api/restaurants` | Restaurant browsing, menu CRUD | Partial (read: public; write: restaurant) | `restaurant` for menu ops |
| `/api/orders` | Order creation, history, status updates | Yes | `restaurant`/`admin` for status updates |
| `/api/reservations` | Reservation CRUD | Yes | `restaurant`/`admin` for status updates |
| `/api/admin` | Platform stats, restaurant management | Yes | `admin` only |
| `/api/reviews` | Review submission and listing | Partial (read: public; write: authenticated) | — |
| `/api/users` | Profile & address management | Yes | — |
| `/health` | Health check endpoint | No | — |

### 3.7 Environment Variables

| Variable | Description |
|:---|:---|
| `PORT` | Server port (default: `5000`) |
| `MONGO_URI` | MongoDB connection string (e.g., `mongodb://127.0.0.1:27017/dineflow`) |
| `JWT_SECRET` | Secret key for signing and verifying JWTs |

---

## 4. Database — MongoDB Collections

DineFlow uses **MongoDB** as its primary database, accessed via **Mongoose ODM**. The database contains **7 collections**, each defined by a Mongoose schema with validation rules, indexes, and automatic timestamps.

### 4.1 Users Collection

Stores all registered users — customers, restaurant owners, and admins.

| Field | Type | Constraints | Description |
|:---|:---|:---|:---|
| `name` | String | Required | Full name of the user |
| `email` | String | Required, Unique | Login email address |
| `phoneNumber` | String | Required | Contact number |
| `passwordHash` | String | Required | bcrypt-hashed password |
| `role` | String | Enum: `customer`, `restaurant`, `admin`. Default: `customer` | Determines access level |
| `addresses` | Array of Subdocuments | — | Saved delivery addresses |
| `addresses[].label` | String | Default: `Home` | Label (Home, Work, etc.) |
| `addresses[].street` | String | Required | Street address |
| `addresses[].city` | String | Required | City |
| `addresses[].state` | String | Required | State |
| `addresses[].zipCode` | String | Required | Postal code |
| `addresses[].isDefault` | Boolean | Default: `false` | Whether this is the default address |
| `createdAt` / `updatedAt` | Date | Auto-generated | Mongoose timestamps |

### 4.2 Restaurants Collection

Stores restaurant profiles. Each restaurant shares the same `_id` as its owner user for simplified lookups.

| Field | Type | Constraints | Description |
|:---|:---|:---|:---|
| `name` | String | Required, Trimmed, Indexed | Restaurant display name |
| `cuisine` | String | Required, Trimmed, Indexed | Cuisine type (e.g., Indian, Italian) |
| `address` | String | Required | Physical address |
| `phone` | String | Required | Contact phone |
| `image` | String | Default: placeholder URL | Restaurant image URL |
| `rating` | Number | Min: 0, Max: 5, Default: 0 | Aggregate rating from reviews |
| `numReviews` | Number | Default: 0 | Total review count |
| `capacity` | Number | Min: 1, Default: 10 | Max reservations per time slot |
| `isOpen` | Boolean | Default: `true` | Whether the restaurant is currently accepting orders |
| `isApproved` | Boolean | Default: `false` | Whether the admin has approved this restaurant |
| `seatingOptions` | Array of Strings | Default: `['Indoor', 'Outdoor', 'Window']` | Available seating types |

> **Key Design Decision:** `isApproved` defaults to `false`. New restaurants are invisible to customers until an admin explicitly approves them.

### 4.3 MenuItems Collection

Stores individual food items belonging to a restaurant.

| Field | Type | Constraints | Description |
|:---|:---|:---|:---|
| `restaurantId` | ObjectId (ref: Restaurant) | Required, Indexed | Parent restaurant |
| `name` | String | Required, Trimmed, Indexed | Dish name |
| `description` | String | Trimmed | Dish description |
| `price` | Number | Required, Min: 0 | Price in ₹ |
| `category` | String | Required, Trimmed | Category (e.g., Starters, Main Course) |
| `image` | String | Default: placeholder URL | Dish image |
| `isAvailable` | Boolean | Default: `true` | Availability toggle |
| `rating` | Number | Min: 0, Max: 5, Default: 0 | Aggregate dish rating |
| `numReviews` | Number | Default: 0 | Number of dish-level ratings |

### 4.4 Orders Collection

Stores customer orders with delivery details and status tracking.

| Field | Type | Constraints | Description |
|:---|:---|:---|:---|
| `userId` | ObjectId (ref: User) | Required, Indexed | Customer who placed the order |
| `restaurantId` | ObjectId (ref: Restaurant) | Required, Indexed | Target restaurant |
| `items` | Array of ObjectId (ref: OrderItem) | Required | References to order line items |
| `totalAmount` | Number | Required, Min: 0 | Calculated total price |
| `paymentMethod` | String | Enum: `COD`, `Pay at Restaurant`. Required | Chosen payment method |
| `status` | String | Enum: `Pending`, `Preparing`, `Ready`, `Completed`, `Cancelled`. Default: `Pending` | Current order status |
| `deliveryAddress` | Subdocument | Required | Snapshot of the delivery address at order time |

### 4.5 OrderItems Collection

Stores individual line items for an order. Captures the **price at the time of ordering** to prevent total cost changes if menu prices are updated later.

| Field | Type | Constraints | Description |
|:---|:---|:---|:---|
| `orderId` | ObjectId (ref: Order) | Required, Indexed | Parent order |
| `menuItemId` | ObjectId (ref: MenuItem) | Required | The menu item ordered |
| `quantity` | Number | Required, Min: 1 | Quantity ordered |
| `priceAtTimeOfOrder` | Number | Required, Min: 0 | Historical price snapshot |

### 4.6 Reservations Collection

Stores table reservation requests.

| Field | Type | Constraints | Description |
|:---|:---|:---|:---|
| `userId` | ObjectId (ref: User) | Required, Indexed | Customer making the reservation |
| `restaurantId` | ObjectId (ref: Restaurant) | Required, Indexed | Target restaurant |
| `date` | String (YYYY-MM-DD) | Required, Indexed | Reservation date |
| `time` | String (HH:mm) | Required, Indexed | Reservation time |
| `partySize` | Number | Required, Min: 1 | Number of guests |
| `seatingPreference` | String | Default: `Indoor` | Preferred seating area |
| `status` | String | Enum: `Pending`, `Confirmed`, `Cancelled`. Default: `Pending` | Reservation status |

> **Compound Index:** `{ restaurantId: 1, date: 1, time: 1 }` — Enables efficient conflict detection for overlapping reservations.

### 4.7 Reviews Collection

Stores ratings and feedback for completed orders.

| Field | Type | Constraints | Description |
|:---|:---|:---|:---|
| `userId` | ObjectId (ref: User) | Required | Reviewer |
| `restaurantId` | ObjectId (ref: Restaurant) | Required | Reviewed restaurant |
| `orderId` | ObjectId (ref: Order) | Required, **Unique** | One review per order enforced |
| `restaurantRating` | Number | Required, Min: 1, Max: 5 | Overall restaurant rating (1–5 stars) |
| `dishRatings` | Array of Subdocuments | — | Per-dish ratings |
| `dishRatings[].menuItemId` | ObjectId (ref: MenuItem) | — | The rated dish |
| `dishRatings[].rating` | Number | Min: 1, Max: 5 | Dish rating (1–5 stars) |
| `comment` | String | Trimmed | Optional text feedback |

---

## 5. Frontend Architecture

### 5.1 Build & Tooling

The frontend is built with **Vite** (v8) as the build tool and dev server, providing instant HMR (Hot Module Replacement). **Tailwind CSS v4** is integrated via the `@tailwindcss/vite` plugin. The project uses JSX with a TypeScript build pipeline.

### 5.2 Application Structure

```
client/src/
├── main.jsx               # React entry point — mounts App with providers
├── App.jsx                # Root component — navbar, routing, protected routes
├── style.css              # Global styles and CSS custom properties
├── context/
│   ├── AuthContext.jsx    # Authentication state (token, user, role)
│   └── CartContext.jsx    # Shopping cart state (items, restaurant, totals)
├── pages/
│   ├── Login.jsx          # Login form
│   ├── Register.jsx       # Registration form (customer or restaurant)
│   ├── Restaurants.jsx    # Restaurant listing / homepage
│   ├── RestaurantMenu.jsx # Individual restaurant menu with add-to-cart
│   ├── Cart.jsx           # Cart review page
│   ├── Checkout.jsx       # Address selection, payment, order placement
│   ├── OrderHistory.jsx   # Past orders with detail modal & review trigger
│   ├── Reservation.jsx    # Make a new reservation at a restaurant
│   ├── MyReservations.jsx # View customer's reservations
│   ├── Profile.jsx        # Profile editing & address management
│   ├── RestaurantDashboard.jsx  # Merchant dashboard (tabbed)
│   └── AdminDashboard.jsx       # Admin oversight panel
├── components/
│   ├── OrderKanban.jsx         # 4-column Kanban board for live orders
│   ├── MenuManager.jsx         # Full menu CRUD for restaurant owners
│   ├── ReservationList.jsx     # Upcoming reservations for restaurants
│   ├── RestaurantSettings.jsx  # Restaurant profile editor
│   └── ReviewModal.jsx         # Star-rating modal for completed orders
└── utils/
    └── api.js             # Axios instance with baseURL & token interceptor
```

### 5.3 Provider Hierarchy

The app is wrapped in a nested provider stack in `main.jsx`:

```
<React.StrictMode>
  <BrowserRouter>           ← React Router
    <AuthProvider>           ← Auth state (token, user, role, login, logout)
      <CartProvider>         ← Cart state (items, restaurantId, totals)
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
</React.StrictMode>
```

### 5.4 AuthContext

- Stores the JWT in `localStorage` under the key `token`.
- On mount (and token change), decodes the JWT payload via `atob()` to extract `{ id, role, email }`.
- Exposes: `token`, `user`, `isLoggedIn`, `role`, `login(token)`, `logout()`.
- Syncs across browser tabs via the `storage` event listener.

### 5.5 CartContext

- Stores cart items and the associated `restaurantId` in `localStorage` (`dineflow_cart`, `dineflow_restaurant_id`).
- **Single-restaurant constraint:** If a user adds an item from a different restaurant, the existing cart is cleared automatically.
- Exposes: `cartItems`, `restaurantId`, `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`, `cartTotal`.

### 5.6 Routing & Access Control

The app uses a `<ProtectedRoute>` wrapper component that:
1. Redirects unauthenticated users to `/login`.
2. Redirects users with unauthorized roles to their home page (`/dashboard` for restaurant, `/` for others).

| Route | Component | Allowed Roles |
|:---|:---|:---|
| `/` | Restaurants (or redirect) | Public / All |
| `/login` | Login | Public only |
| `/register` | Register | Public only |
| `/restaurant/:id` | RestaurantMenu | `customer`, `admin` |
| `/cart` | Cart | `customer`, `admin` |
| `/checkout` | Checkout | `customer`, `admin` |
| `/order-history` | OrderHistory | `customer`, `admin` |
| `/my-reservations` | MyReservations | `customer`, `admin` |
| `/reservation/:id` | Reservation | `customer`, `admin` |
| `/profile` | Profile | `customer`, `admin` |
| `/dashboard` | RestaurantDashboard | `restaurant` |
| `/admin-dashboard` | AdminDashboard | `admin` |

### 5.7 API Client

A centralized Axios instance (`utils/api.js`) is configured with:
- **Base URL:** `https://dirflow.onrender.com`
- **Request Interceptor:** Automatically attaches the JWT from localStorage as `Authorization: Bearer <token>` on every outgoing request.

---

## 6. Feature Details by Persona

---

### 6.1 Persona 1: Customer (The Hungry User)

The customer is the primary end-user of DineFlow — someone looking to discover restaurants, order food for delivery, reserve tables, and provide feedback.

#### 6.1.1 Restaurant Browsing & Search

- **Page:** `Restaurants.jsx` (route: `/`)
- **Functionality:** Customers can browse all **approved** restaurants on the platform. The listing page shows restaurant cards with name, cuisine type, image, and rating.
- **Search & Filter:** A search bar allows filtering restaurants by **name** or **cuisine type** using regex-based queries on the backend (`GET /api/restaurants?q=<query>&cuisine=<type>`).
- **Visibility Rule:** Only restaurants where `isApproved === true` are returned by the API. Unapproved restaurants are completely invisible to customers.

#### 6.1.2 Menu Viewing & Cart

- **Page:** `RestaurantMenu.jsx` (route: `/restaurant/:id`)
- **Functionality:** Clicking a restaurant card opens its menu page. The menu displays all **available** items (`isAvailable: true`) grouped by category, showing dish name, description, price, image, and rating.
- **Add to Cart:** Each menu item has an "Add to Cart" button. Items are added to the cart via `CartContext.addToCart()`.
- **Single-Restaurant Rule:** The cart is locked to one restaurant at a time. Adding an item from a different restaurant clears the existing cart and starts fresh.
- **Cart Page:** `Cart.jsx` (route: `/cart`) shows all items in the cart with quantity adjustment controls (+/−) and a running total.

#### 6.1.3 Checkout & Order Placement

- **Page:** `Checkout.jsx` (route: `/checkout`)
- **Delivery Address Selection:** At checkout, the customer sees their saved addresses (fetched from their profile). They can select one or add a new address inline via a modal form. The new address is saved to the user's profile for future use.
- **Payment Method:** Two options are available:
  - **Cash on Delivery (COD)** — Pay when food arrives.
  - **Pay at Restaurant** — Pick up and pay in person.
- **Order Summary:** Displays all cart items, subtotal, delivery fee (FREE), and total amount.
- **Placing the Order:** On clicking "Place Order", a `POST /api/orders` request is sent with `restaurantId`, `items` (array of `{ menuItemId, quantity }`), `paymentMethod`, and `deliveryAddress`. The backend validates each menu item's existence and availability, calculates the total using **current prices**, creates `OrderItem` documents (capturing `priceAtTimeOfOrder`), creates the `Order` document, and emits a `new_order` Socket.io event to the restaurant's room.
- **Post-Order:** The cart is cleared and the customer is redirected to the Order History page.

#### 6.1.4 Order History & Tracking

- **Page:** `OrderHistory.jsx` (route: `/order-history`)
- **Functionality:** Displays all of the customer's past orders in reverse chronological order. Each order card shows the restaurant name, order ID (last 8 characters), date, total amount, and current status with color-coded badges:
  - 🟢 **Completed** — Green badge
  - 🔴 **Cancelled** — Red badge
  - 🟣 **Pending/Preparing/Ready** — Indigo badge
- **Order Detail Modal:** Clicking an order card opens a modal with full details — itemized list with quantities and historical prices, payment method, and total.
- **Review Trigger:** If the order status is "Completed", a **"Rate Order"** button appears in the detail modal, opening the ReviewModal.

#### 6.1.5 Ratings & Reviews

- **Component:** `ReviewModal.jsx`
- **Functionality:** After a completed order, the customer can rate:
  - **Overall Restaurant Rating** — 1 to 5 stars using an interactive star widget.
  - **Individual Dish Ratings** — Each dish in the order gets its own 1–5 star rating.
  - **Comment** — Optional text feedback.
- **Backend Logic (`POST /api/reviews`):**
  1. Validates the order exists and belongs to the user.
  2. Checks that the order hasn't already been reviewed (one review per order, enforced by a unique index on `orderId`).
  3. Saves the review.
  4. **Recalculates the restaurant's aggregate rating** using a running average: `newRating = (oldRating × oldCount + newRating) / (oldCount + 1)`.
  5. **Recalculates each dish's aggregate rating** using the same running average formula.

#### 6.1.6 Table Reservations

- **Page:** `Reservation.jsx` (route: `/reservation/:id`)
- **Functionality:** Customers can reserve a table by filling out:
  - **Date** — Must be in the future (server-validated).
  - **Time** — Desired reservation time.
  - **Party Size** — Number of guests (minimum 1).
  - **Seating Preference** — Indoor, Outdoor, or Window (based on restaurant's `seatingOptions`).
- **Conflict Detection:** The server counts existing reservations for the same `restaurantId + date + time` combination. If the count reaches the restaurant's `capacity`, the request is rejected with "This time slot is already full."
- **My Reservations:** `MyReservations.jsx` (route: `/my-reservations`) lists all the customer's reservations sorted by date/time, with status badges (Pending, Confirmed, Cancelled).

#### 6.1.7 Profile & Address Management

- **Page:** `Profile.jsx` (route: `/profile`)
- **Profile Editing:** Update name, email, and phone number. Email uniqueness is validated server-side.
- **Address Management:**
  - **Add:** Create new addresses with label, street, city, state, zip code, and a "Set as Default" checkbox.
  - **Edit:** Modify existing addresses.
  - **Delete:** Remove addresses. If the deleted address was the default, the first remaining address automatically becomes the new default.
  - **Default Logic:** Setting an address as default automatically un-defaults all others.

---

### 6.2 Persona 2: Restaurant Owner (The Merchant)

The restaurant owner manages their establishment through a dedicated dashboard with four tabbed sections.

#### 6.2.1 Restaurant Dashboard Overview

- **Page:** `RestaurantDashboard.jsx` (route: `/dashboard`)
- **Layout:** A header section shows the restaurant's image, name, cuisine, address, and two status badges:
  - **Open/Closed** — Green "Accepting Orders" or Red "Store Closed".
  - **Verified/Pending** — Indigo "Verified Partner" or "Verification Pending".
- **Tab Navigation:** Four tabs organize the dashboard:
  - 🛍️ **Live Orders** — Real-time order queue
  - 📅 **Reservations** — Upcoming reservation list
  - 🍴 **Menu Manager** — Full menu CRUD
  - ⚙️ **Profile Settings** — Restaurant profile editor

#### 6.2.2 Live Order Queue (4-Step Pipeline)

- **Component:** `OrderKanban.jsx`
- **Layout:** A **4-column Kanban board** with columns: **Pending → Preparing → Ready → Completed**. Each column shows a count badge of active orders.
- **Real-Time Updates:** The component connects to the Socket.io server on mount. New orders appear instantly via the `new_order` event — no page refresh needed.
- **Browser Notifications:** When a new order arrives, a browser notification is triggered (if permission is granted).
- **Order Cards:** Each card displays:
  - Order ID (last 6 characters)
  - Total amount in ₹
  - Customer name and phone number
  - Order timestamp
  - Delivery address (label + street + city)
  - Itemized list (quantity × item name)
- **Status Transition Buttons:**
  - **Pending** → "Accept" button → moves to **Preparing**
  - **Preparing** → "Mark Ready" button → moves to **Ready**
  - **Ready** → "Complete" button → moves to **Completed**
- **Cancellation:** Orders can also be moved to "Cancelled" status.
- **Backend:** `PUT /api/orders/:id/status` with `{ status }` — validates the status enum, checks authorization (only the owning restaurant or admin), saves, and emits `order_status_update` via Socket.io.

#### 6.2.3 Reservation Management

- **Component:** `ReservationList.jsx`
- **Functionality:** Displays all **upcoming** reservations (today and future) for the restaurant, showing:
  - Customer name, email, and phone number
  - Date, time, party size
  - Seating preference
  - Status (Pending / Confirmed / Cancelled)
- **Actions:** Restaurant owners can **Confirm** or **Cancel** reservations via `PUT /api/reservations/:id/status`.

#### 6.2.4 Menu Management

- **Component:** `MenuManager.jsx`
- **Full CRUD Operations:**
  - **Add Item:** Form with fields for name, description, price, category, image URL, and availability toggle. Submits via `POST /api/restaurants/:id/menu`.
  - **Edit Item:** Inline edit for existing menu items. Submits via `PUT /api/restaurants/:id/menu/:itemId`.
  - **Delete Item:** Removes item via `DELETE /api/restaurants/:id/menu/:itemId`.
  - **Toggle Availability:** Quick toggle to mark items as available or unavailable without editing the full item.
- **Authorization:** All menu write operations require the `restaurant` role and are scoped to the authenticated restaurant's own items.

#### 6.2.5 Restaurant Profile Settings

- **Component:** `RestaurantSettings.jsx`
- **Editable Fields:** Restaurant name, cuisine type, address, phone number, image URL, and seating options.
- **Backend:** `PUT /api/restaurants/:id/profile` — updates the restaurant document.

---

### 6.3 Persona 3: Platform Administrator

The admin has platform-wide oversight and control, plus the ability to act as a regular customer.

#### 6.3.1 Admin Dashboard & KPIs

- **Page:** `AdminDashboard.jsx` (route: `/admin-dashboard`)
- **KPI Cards:** The dashboard displays four key metrics in a grid of stat cards, all fetched via `GET /api/admin/stats`:

| KPI | How It's Calculated |
|:---|:---|
| **Total Revenue** | MongoDB aggregation pipeline: Filters orders with `status: 'Completed'`, groups them (`$group` with `_id: null`), and sums the `totalAmount` field (`$sum: '$totalAmount'`). Only completed orders contribute to revenue. |
| **Total Users** | Simple `User.countDocuments()` — counts all registered users across all roles (customers + restaurants + admins). |
| **Active Orders** | `Order.countDocuments()` — total count of all orders in the system (all statuses). |
| **Top Restaurant** | MongoDB aggregation pipeline: Groups all orders by `restaurantId` (`$group` with `_id: '$restaurantId'`, `count: { $sum: 1 }`), sorts descending by count (`$sort: { count: -1 }`), takes the top result (`$limit: 1`), then looks up the restaurant's name from the Restaurant collection. The restaurant with the most total orders (regardless of status) is displayed. |

#### 6.3.2 Restaurant Onboarding & Approval

- **Onboarding Flow:**
  1. A new user registers with `role: 'restaurant'` via `POST /api/auth/register`.
  2. The backend automatically creates a Restaurant document with `isApproved: false` and a default name (`<user's name>'s Kitchen`).
  3. The restaurant is **not visible** to customers because the `getRestaurants` query filter includes `isApproved: true`.
  4. The restaurant appears in the admin's Restaurant Management table with an **"Pending"** orange badge.
  5. The admin clicks **"Approve"** to set `isApproved: true`, making the restaurant visible to all customers.

#### 6.3.3 Restaurant Access Control

- **Restaurant Management Table:** Lists all restaurants (approved and pending) with columns for Name, Cuisine, Status (Open/Closed), and Approval status.
- **Actions per restaurant:**
  - **Approve / Revoke:** Toggle `isApproved`. Revoking access hides the restaurant from customer-facing listings immediately.
  - **Open / Close:** Toggle `isOpen`. Closing a restaurant prevents new orders while keeping it visible.
- **Backend:** `PUT /api/admin/restaurants/:id` with `{ isApproved, isOpen }` — updates whichever fields are provided.

#### 6.3.4 Admin as Customer

- The admin role has **full customer capabilities**. The `ProtectedRoute` component grants admin access to all customer routes: restaurant browsing, menu viewing, cart, checkout, order placement, order history, reservations, profile, and address management.
- This allows the admin to place test orders, verify the customer experience, and use the platform as a regular user without switching accounts.

---

## 7. API Endpoint Reference

### 7.1 Authentication

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/auth/register` | Register a new user (customer or restaurant) |
| `POST` | `/api/auth/login` | Login and receive JWT |

### 7.2 Restaurants (Public + Restaurant)

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/api/restaurants` | No | List approved restaurants (with `?q=` and `?cuisine=` filters) |
| `GET` | `/api/restaurants/search` | No | Search food items by name across all restaurants |
| `GET` | `/api/restaurants/:id` | No | Get restaurant details by ID |
| `GET` | `/api/restaurants/:id/menu` | No | Get available menu items for a restaurant |
| `POST` | `/api/restaurants/:id/menu` | Restaurant | Add a new menu item |
| `PUT` | `/api/restaurants/:id/menu/:itemId` | Restaurant | Update a menu item |
| `DELETE` | `/api/restaurants/:id/menu/:itemId` | Restaurant | Delete a menu item |
| `PUT` | `/api/restaurants/:id/profile` | Restaurant | Update restaurant profile |

### 7.3 Orders

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/api/orders` | Yes | Place a new order |
| `GET` | `/api/orders` | Yes | Get logged-in user's order history |
| `GET` | `/api/orders/restaurant` | Restaurant | Get all orders for the restaurant |
| `GET` | `/api/orders/:id` | Yes | Get order details by ID |
| `PUT` | `/api/orders/:id/status` | Restaurant/Admin | Update order status |

### 7.4 Reservations

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/api/reservations` | Yes | Create a new reservation |
| `GET` | `/api/reservations` | Yes | Get logged-in user's reservations |
| `GET` | `/api/reservations/restaurant/:id` | Yes | Get upcoming reservations for a restaurant |
| `PUT` | `/api/reservations/:id/status` | Restaurant/Admin | Update reservation status |

### 7.5 Reviews

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/api/reviews` | Yes | Submit a review for a completed order |
| `GET` | `/api/reviews/restaurant/:restaurantId` | No | Get all reviews for a restaurant |

### 7.6 Users

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/api/users/profile` | Yes | Get authenticated user's profile |
| `PUT` | `/api/users/profile` | Yes | Update profile (name, email, phone) |
| `POST` | `/api/users/addresses` | Yes | Add a new delivery address |
| `PUT` | `/api/users/addresses/:addressId` | Yes | Update an existing address |
| `DELETE` | `/api/users/addresses/:addressId` | Yes | Delete an address |

### 7.7 Admin

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/api/admin/stats` | Admin | Get platform KPIs |
| `GET` | `/api/admin/restaurants` | Admin | List all restaurants (including unapproved) |
| `PUT` | `/api/admin/restaurants/:id` | Admin | Toggle isOpen / isApproved for a restaurant |

---

## 8. Setup & Installation

### 8.1 Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas connection string)

### 8.2 Backend Setup

```bash
cd server
cp .env.example .env    # Configure MONGO_URI and JWT_SECRET
npm install
npm run dev             # Starts with nodemon on port 5000
```

### 8.3 Frontend Setup

```bash
cd client
npm install
npm run dev             # Starts Vite dev server
```

### 8.4 Seed Data

```bash
cd server
node seed-admin.js      # Creates the admin user
node seed.js            # Seeds sample data
```

---

*End of Documentation*
