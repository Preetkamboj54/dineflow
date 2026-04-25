# DineFlow — Complete UI Design Specification

> **App Type:** Online Food Ordering & Restaurant Management Platform (Web — Desktop-first, responsive)
> **Target:** Stitch design system import
> **Roles:** Customer, Restaurant Owner, Admin

---

## Design System Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#6366f1` (Indigo) | Buttons, links, active states, price text |
| Primary Hover | `#4f46e5` | Button hover states |
| Secondary | `#10b981` (Emerald) | "Open" badges, success states |
| Accent | `#f59e0b` (Amber) | Star ratings, warnings |
| Danger | `#ef4444` (Red) | "Closed" badges, delete buttons, errors |
| Background | `#f8fafc` (Slate-50) | Page background |
| Card BG | `#ffffff` | All card surfaces |
| Text Main | `#0f172a` (Slate-900) | Headings, body text |
| Text Muted | `#64748b` (Slate-500) | Subtitles, labels, helper text |
| Border | `#e2e8f0` (Slate-200) | Card borders, dividers |
| Glass | `rgba(255,255,255,0.7)` | Header backdrop, glassmorphism cards |
| Corner Radius | `12px` base, `24px` cards, `9999px` pills | Rounded modern aesthetic |
| Font Headings | **Outfit** 700–900 | All headings |
| Font Body | **Inter** 400–600 | Body text, labels, inputs |

---

## Global Header (All Screens)

**Visible to:** All roles — content changes per role & auth state

### Layout
Sticky top bar, full-width, glassmorphic (`bg-white/70 backdrop-blur-md`), bottom border, `z-50`.
Inner container: `max-width: 1200px`, centered, horizontal flex between logo and nav.

### UI Elements

| Element | Type | Description |
|---------|------|-------------|
| **DineFlow Logo** | Link (text) | Left-aligned. Outfit font, 2xl bold, primary color. Links to `/` (customer/admin) or `/dashboard` (restaurant). |
| **Orders** | Nav Link | Customer/Admin only. Muted text, hover → primary. Links to `/order-history`. |
| **Reservations** | Nav Link | Customer/Admin only. Links to `/my-reservations`. |
| **Profile** | Nav Link | Customer/Admin only. Links to `/profile`. |
| **Merchant Dashboard** | Nav Link | Restaurant role only. Links to `/dashboard`. |
| **Admin Panel** | Nav Link | Admin role only. Links to `/admin-dashboard`. |
| **Logout** | Button (secondary) | Logged-in users. Outlined style. Clears session, redirects to login. |
| **Login** | Nav Link | Unauthenticated only. Muted text style. |
| **Register** | Button (primary) | Unauthenticated only. Solid indigo, white text. |

---

## Screen 1 — Login Page

**Role:** Unauthenticated users

### Layout
Centered card (`max-width: 460px`), vertical padding `4rem`, white background, `border-radius: 24px`, large shadow, border.

### UI Elements

| Element | Type | Details |
|---------|------|---------|
| **"Welcome Back"** | Heading (h2) | 3xl, bold, centered |
| **"Sign in to continue to DineFlow"** | Subtitle | Muted text, centered |
| **Error Banner** | Alert box | Red-50 background, red border, danger text. Conditionally shown. |
| **Email Address** | Label + Input | `type="email"`, placeholder: `chef@dineflow.com`, full-width, rounded-xl, required |
| **Password** | Label + Input | `type="password"`, placeholder: `••••••••`, full-width, rounded-xl, required |
| **Sign In** | Button (primary) | Full-width, large padding (`0.75rem`), solid indigo |
| **"Don't have an account?"** | Footer text | Muted, small, centered, above border-top divider |
| **Create account** | Inline link | Primary color, semibold, links to `/register` |

---

## Screen 2 — Register Page

**Role:** Unauthenticated users

### Layout
Same centered auth card as Login, slightly wider (`max-width: 550px`).

### UI Elements

| Element | Type | Details |
|---------|------|---------|
| **"Create Account"** | Heading (h2) | 3xl, bold, centered |
| **"Join the DineFlow community today"** | Subtitle | Muted, centered |
| **Error Banner** | Alert box | Same red style as login |
| **Full Name** | Label + Input | `type="text"`, placeholder: `John Doe`, in 2-col grid (left), required |
| **Email Address** | Label + Input | `type="email"`, placeholder: `john@example.com`, 2-col grid (right), required |
| **Password** | Label + Input | `type="password"`, placeholder: `••••••••`, 2-col grid (left), required |
| **Phone Number** | Label + Input | `type="text"`, placeholder: `+1 (555) 000-0000`, 2-col grid (right), required |
| **"I am a..."** | Label + Select dropdown | Full-width. Options: "Hungry Customer" (`customer`), "Restaurant Owner" (`restaurant`). White background. |
| **Create Account** | Button (primary) | Full-width, large padding, solid indigo |
| **"Already have an account?"** | Footer text | Muted, small, with border-top divider |
| **Sign in** | Inline link | Primary color, semibold, links to `/login` |

---

## Screen 3 — Restaurant Listing (Landing Page)

**Role:** Customer, Admin (also visible unauthenticated)

### Layout
`max-width: 1200px` centered container. Hero section on top, grid of restaurant cards below.

### Hero Section

| Element | Type | Details |
|---------|------|---------|
| **"Discover Local Flavors"** | Heading (h1) | 5xl, extrabold, centered |
| **"Order from the best restaurants in town"** | Subtitle | xl, muted, centered, `mb-8` |
| **Search Input** | Input (text) | Placeholder: `Cuisine, dish, or restaurant...`, flex-grow, shadow-sm |
| **Search** | Button (primary) | Inline next to input in a flex row |

### Restaurant Cards (Grid)

Each card is clickable (navigates to `/restaurant/:id`):

| Element | Type | Details |
|---------|------|---------|
| **Restaurant Image** | Image | Full card width, rounded top, `object-cover`, `mb-4` |
| **Restaurant Name** | Heading (h3) | xl, bold |
| **Cuisine** | Text | Muted, small, below name |
| **Rating** | Text + Star icon | Amber-500, bold number + `★`. Shows "New" if no rating. |
| **Review Count** | Badge text | 10px, muted, uppercase, e.g. `12 reviews` |
| **Open/Closed Status** | Badge text | Green (secondary) for "● Open", red (danger) for "● Closed", xs font, bold |

---

## Screen 4 — Restaurant Menu Page

**Role:** Customer, Admin

### Layout
`max-width: 960px` centered. Hero card at top, then category-sectioned menu grid below.

### Hero Section (Card with image)

| Element | Type | Details |
|---------|------|---------|
| **Restaurant Hero Image** | Image | Full-width, `h-64` (md: `h-80`), `object-cover`, inside rounded-3xl card with shadow-2xl |
| **Restaurant Name** | Heading (h1) | 4xl–5xl, black weight, tight tracking |
| **Cuisine • Address** | Subtitle | Cuisine in primary color, address in muted, separated by `•` |
| **Book a Table** | Button (secondary) | `px-6`, links to `/reservation/:id` |
| **View Cart** | Button (primary) | `px-6`, shadow with primary glow, links to `/cart` |

### Menu Items (per category)

| Element | Type | Details |
|---------|------|---------|
| **Category Name** | Heading (h2) | 2xl, bold, primary color, uppercase, wide tracking. Horizontal gradient line extends right. |
| **Dish Image** | Image | `96px`–`128px` square, rounded-2xl, shadow, hover scale effect |
| **Dish Name** | Heading (h4) | lg, bold, truncated |
| **Star Rating** | Stars + count | Amber stars, bold rating number, muted review count in parens. Only if rated. |
| **Price** | Text | Primary color, black weight, right-aligned, e.g. `₹450.00` |
| **Description** | Text | sm, muted, 2-line clamp |
| **+ Add to Cart** | Button | Full-width, rounded-xl, gray-100 bg → hover becomes primary+white. Bold, sm text. |
| **Sold Out** | Button (disabled) | Gray-50 bg, gray-400 text, `cursor-not-allowed`. Replaces "Add to Cart" when unavailable. |

---

## Screen 5 — Cart Page

**Role:** Customer, Admin

### Empty State
Centered container. "Your Cart is Empty" heading, muted subtitle, "Browse Restaurants" primary button linking to `/`.

### Cart Items Layout
`max-width: 768px` centered. White card with dividers between items.

| Element | Type | Details |
|---------|------|---------|
| **"Your Shopping Cart"** | Heading (h2) | 3xl, bold |
| **Item Name** | Text (h3) | Bold, truncated |
| **Unit Price** | Text | Muted, sm, e.g. `₹250 each` |
| **"−" Button** | Button (sm) | 8×8 circle, decrement quantity |
| **Quantity** | Text | Bold, centered, between ± buttons |
| **"+" Button** | Button (sm) | 8×8 circle, increment quantity |
| **Remove** | Button (sm, danger) | Red-styled small button |
| **Line Total** | Text | Bold, right-aligned, e.g. `₹500.00` |
| **Cart Total** | Text (h3) | xl, bold, in a footer card row |
| **Proceed to Checkout** | Button (primary) | Right-aligned in footer card, links to `/checkout` |

---

## Screen 6 — Checkout Page

**Role:** Customer, Admin

### Layout
`max-width: 1280px`. 3-column grid: left 2 cols = Delivery + Payment, right 1 col = Order Summary (sticky).

### Delivery Address Section (Glass card)

| Element | Type | Details |
|---------|------|---------|
| **"Delivery Address"** | Heading (h2) | 2xl, black weight |
| **+ Add New Address** | Text button | Primary color, bold, sm, hover underline. Opens modal. |
| **Address Cards** | Selectable cards | 2-col grid. Each: rounded-2xl, border-2, cursor-pointer. Selected: primary border, subtle glow, scale 1.02, checkmark. |
| **Address Label** | Text (span) | Bold, e.g. "Home". Primary color when selected. |
| **"Selected" Badge** | Pill | Primary bg, white text, 9px, uppercase. |
| **Checkmark Icon** | Circle + SVG | Primary bg circle with white check SVG. |
| **Street, City, State, Zip** | Text | sm, relaxed leading |
| **Empty State** | Dashed border box | Gray-50 bg, muted text: "No saved addresses." |

### Add Address Modal (overlay)

| Element | Type | Details |
|---------|------|---------|
| **Backdrop** | Overlay | `bg-black/40 backdrop-blur-sm`, z-50 |
| **"Add Delivery Address"** | Heading (h2) | 2xl, black weight |
| **Label** | Label + Input | Placeholder: `Home, Office` |
| **Street Address** | Label + Input | Full-width |
| **City / State** | Label + Input × 2 | 2-column grid |
| **Zip Code** | Label + Input | Full-width |
| **Save & Select** | Button (primary) | flex-1, py-3 |
| **Cancel** | Button (secondary) | flex-1, py-3 |

### Payment Method Section (Glass card)

| Element | Type | Details |
|---------|------|---------|
| **"Payment Method"** | Heading (h2) | 2xl, black weight |
| **Cash on Delivery** | Radio + Label card | Radio input (5×5, primary). Bold title + muted subtitle. Border-2 highlight when selected. |
| **Pay at Restaurant** | Radio + Label card | Same radio card pattern |

### Order Summary (Glass card — sticky)

| Element | Type | Details |
|---------|------|---------|
| **"Order Summary"** | Heading (h2) | 2xl, black weight |
| **Item Lines** | Text rows | Muted name + bold quantity × price |
| **Subtotal** | Row | Muted label, medium value |
| **Delivery Fee** | Row | Muted label, green-600 bold "FREE" |
| **Total** | Row | xl, black weight, primary color value |
| **Place Order** | Button (primary) | Full-width, py-4, lg text. Disabled when no address. |
| **Address Warning** | Text | 10px, centered, danger color, uppercase. |

---

## Screen 7 — Order History Page

**Role:** Customer, Admin

### Order List

| Element | Type | Details |
|---------|------|---------|
| **"Order History"** | Heading (h2) | 4xl, extrabold |
| **Subtitle** | Text | Muted: "Track and reorder your favorite meals" |
| **Order Card** | Clickable card | Restaurant name (primary) + order ID/date (muted mono) + total + status badge. |
| **Status Badge** | Pill | Green = Completed, Red = Cancelled, Indigo = In-progress |

### Order Detail Modal

| Element | Type | Details |
|---------|------|---------|
| **Close ×** | Button | Absolute top-right, 2xl |
| **Restaurant Name** | Heading (h3) | 2xl, bold |
| **Item Lines** | Rows | Primary quantity + name + price |
| **Payment / Total** | Summary rows | Muted label + bold value |
| **Close** | Button (secondary) | flex-1 |
| **Rate Order** | Button (primary) | flex-1, only for Completed orders |

### Review Modal (z-60)

| Element | Type | Details |
|---------|------|---------|
| **"Rate Your Experience"** | Heading | 3xl, black, centered |
| **Overall Rating** | 5 interactive stars | Amber-400 filled, gray-200 empty. Inside amber-50 container. |
| **Dish Rating Rows** | Per-dish stars | Gray-50 rows, dish name + star widget |
| **Comment** | Textarea | Optional, rounded-xl, min-h 100px |
| **Cancel / Submit Review** | Button pair | Secondary + Primary with glow |

---

## Screen 8 — Admin Panel

**Role:** Admin only

### Stats Cards (4-column grid)

| Card | Content |
|------|---------|
| **Total Revenue** | `₹` value, 2xl bold |
| **Total Users** | Count, 2xl bold |
| **Active Orders** | Count, 2xl bold |
| **Top Restaurant** | Name, xl bold |

### Restaurant Management Table

| Element | Type | Details |
|---------|------|---------|
| **Table** | Full-width | Columns: Name, Cuisine, Status, Approval, Actions |
| **Status Badge** | Pill | Green = Open, Red = Closed |
| **Approval Badge** | Pill | Blue = Approved, Orange = Pending |
| **Approve/Revoke** | Button (sm) | Primary or Danger toggle |
| **Open/Close** | Button (sm, secondary) | Toggle button |

---

## Screen 9 — Restaurant Dashboard

**Role:** Restaurant Owner only

### Header

| Element | Type | Details |
|---------|------|---------|
| **Restaurant Image** | Image | 96×96, rounded-3xl, shadow-xl, with online/offline dot |
| **Name + Cuisine/Address** | Heading + subtitle | 4xl black + lg muted |
| **Status Badges** | Pills | Green/Red for orders, Indigo for verification |

### Tab Bar (4 tabs)

| Tab | Icon | Label |
|-----|------|-------|
| orders | 🛍️ | Live Orders |
| reservations | 📅 | Reservations |
| menu | 🍴 | Menu Manager |
| profile | ⚙️ | Profile Settings |

### Live Orders Tab (Kanban)
4 columns: Pending → Preparing → Ready → Completed. Order cards with customer info, delivery address, item list, and action buttons (Accept/Mark Ready/Complete).

### Reservations Tab
Cards with date block (primary bg), time, guest count, seating preference, status badge. Confirm/Decline buttons for pending reservations.

### Menu Manager Tab
Toolbar with item count + "New Item" button. Add form with dish fields. Item list with image, name, category badge, price, edit/delete actions. Sold-out overlay on unavailable items.

### Profile Settings Tab
Form with Restaurant Name, Cuisine, Phone, Address (2-col grid), Image URL with preview, Seating Options. Save button with success/error feedback.

---

## Shared Patterns

| Pattern | Description |
|---------|-------------|
| **btn-primary** | Indigo bg, white text, rounded-xl, bold, hover darker |
| **btn-secondary** | White bg, primary text/border, rounded-xl, hover primary/5 |
| **btn-sm** | Smaller padding, xs-sm text |
| **btn-danger** | Red bg, white text |
| **Card** | White, rounded-2xl, padding 1.5rem, border, shadow-sm |
| **Glass Card** | Card + backdrop-blur + 70% white bg |
| **Form Group** | Label (sm semibold) + input (rounded-xl, border, focus ring) |
| **Modal** | Fixed overlay, z-50+, backdrop-blur, centered white card |

## Animations
- Page transitions: fade-in + slide-from-bottom
- Card hovers: shadow lift + scale
- Menu images: scale 1.05 on hover
- Modals: fade-in + zoom-in
- Tabs: smooth color/bg transition 300ms
