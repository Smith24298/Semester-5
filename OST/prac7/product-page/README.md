# ShopEase — Interactive E-Commerce Product Detail Page

A modern, responsive e-commerce product detail page built completely **from scratch** using **HTML5, CSS3, JavaScript, and jQuery**. 

No frontend UI frameworks (React, Vue, Angular, Tailwind CSS, or pre-built themes) were used. The design utilizes modern CSS Grid, Flexbox, custom design tokens (`:root` variables), and responsive media queries, complemented by jQuery for dynamic DOM manipulation, events, animations, form handling, validation, and real-time UI updates.

---

## 📁 Project Structure

```text
product-page/
│
├── index.html          # Semantic HTML5 page layout, components, and modals
├── css/
│   └── style.css       # Custom CSS3 styling, design system, animations & media queries
├── js/
│   ├── script.js       # Core application logic, jQuery handlers, validation & state
│   └── jquery.min.js   # Local fallback copy of jQuery 3.7.1
└── assets/
    └── images/         # High-resolution product and related item photography
        ├── product-black-1.jpg
        ├── product-black-2.jpg
        ├── product-white-1.jpg
        ├── product-blue-1.jpg
        ├── product-detail-3.jpg
        ├── product-detail-4.jpg
        ├── related-1.jpg
        ├── related-2.jpg
        ├── related-3.jpg
        └── related-4.jpg
```

---

## 🚀 How to Run the Project

1. Simply double-click or open `index.html` (or `product-page/index.html`) in any modern web browser (Google Chrome, Firefox, Safari, Edge).
2. No Node.js build step or package installer is required.
3. The page loads **jQuery 3.7.1** and **Font Awesome 6** via CDN, with an automatic offline fallback to local `js/jquery.min.js`.

---

## 🌟 Features Implemented

### 1. Header & Navigation
- **E-Commerce Navbar**: Logo badge (`ShopEase`), responsive menu links (`Home`, `Products`, `Categories`, `Offers`).
- **Interactive Search Bar**: Real-time product search with dropdown recommendations and dynamic card filtering.
- **Wishlist & Cart Counter Badges**: Synchronized counters with bounce animations on update.
- **User Account Flyout**: Dropdown menu for account management and orders.
- **Mobile Responsive Drawer**: Off-canvas sliding navigation menu on tablet and mobile viewports.

### 2. Product Gallery & Zoom
- **Main Product Showcase**: High-resolution view with floating discount tag and wishlist button.
- **4 Clickable Thumbnails**: Smooth jQuery fade transitions (`.fadeOut()` / `.fadeIn()`) when switching images.
- **Magnifier Zoom Lens**: Interactive zoom lens and flyout preview that magnifies details on hover.
- **Wishlist Toggle**: Floating heart button toggles between outline and filled states with heartbeat animation, updating the navbar counter and displaying a notification.

### 3. Product Information & Pricing
- Dynamic rendering of brand (`AcoustiQ Pro`), product title, rating (★★★★☆ 4.5), and review count.
- Strikethrough original price (₹4,999), discounted price (₹2,999), 40% OFF badge, and savings calculation.
- Live stock indicator with pulsing green dot ("✓ In Stock — 15 units available").

### 4. Interactive Variations (Color & Size)
- **Color Swatches**: Midnight Black, Pearl White, and Deep Blue. Selecting a swatch highlights the button, updates the color name label, and switches the main product photo to match the finish.
- **Size / Variant Selector**: Small (Compact), Medium (Standard), and Large (Pro Comfort) with active ring feedback and real-time label updates.

### 5. Quantity & Subtotal Selector
- `[-]` and `[+]` quantity adjustment buttons.
- Minimum bound (1) and maximum bound (stock limit of 15) enforcement.
- Real-time subtotal calculation: `Subtotal = Quantity × Unit Price`.

### 6. Add to Cart & Cart Drawer
- Validates that required options (color and size) are selected.
- Increments navbar cart count with pop/bounce animation.
- Shakes the navbar cart icon.
- Displays a custom slide-in toast notification: `✓ Product added to cart`.
- Updates the slide-out shopping bag drawer with line-item breakdown, quantities, and price totals.
- No page reload.

### 7. Buy Now & Order Summary Modal
- Opens a checkout modal with background blur.
- Displays selected product thumbnail, name, chosen color, chosen size, quantity, unit price, and grand total.
- Includes "Cancel" and "Proceed to Checkout" action buttons.
- Closes on ESC key, cancel button, close '×', or backdrop click.

### 8. Product Tabs & Specifications
- Tabs for **Description**, **Specifications**, and **Reviews**.
- Seamless jQuery tab switching without page reload (`.fadeIn()` transitions).
- Structured specifications table detailing Brand, Model, Weight, Battery, Connectivity, Warranty, and Material.

### 9. Review System with jQuery Validation
- Comprehensive client-side validation:
  - **Full Name**: Cannot be empty.
  - **Rating**: Interactive 5-star picker; must select at least 1 star.
  - **Comment**: Cannot be empty.
- Highlights invalid fields with error states and warning messages.
- On valid submission:
  - Dynamically prepends the new review card to the customer reviews feed with a `.slideDown()` animation.
  - Increments the total review count across the header, tab label, and review summary.
  - Clears the form inputs and resets the star picker.
  - Displays a success toast notification.

### 10. "You May Also Like" Related Products
- 4 product recommendation cards with image, title, rating, pricing, and discount badge.
- Dedicated "Add to Cart" button on each card that updates the global cart state and navbar badge.
- Real-time search filtering hides non-matching cards and shows an empty state if no matches exist.

---

## 🛠️ jQuery Implementation Details

### A. DOM Manipulation
- **Text & HTML Updates**:
  ```javascript
  $("#product-name").text(productData.name);
  $("#product-current-price").text(formatCurrency(productData.price));
  $("#header-cart-count").text(state.cart.count);
  $("#product-subtotal").text(formatCurrency(subtotal));
  ```
- **Attribute Manipulation**:
  ```javascript
  $mainImg.attr("src", newSrc);
  $mainImg.attr("data-zoom-src", newSrc);
  $("#quantity-input").attr("max", productData.stock);
  ```
- **Dynamic Element Insertion**:
  ```javascript
  const $newReviewCard = $(createReviewCardHtml(newReview)).hide();
  $("#reviews-list").prepend($newReviewCard);
  $newReviewCard.slideDown(400);
  ```

### B. Event Handling
- `.click()`: Thumbnail selection, wishlist toggling, quantity buttons, modal buttons, tabs.
- `.on("click")`: Delegated event handlers for dynamically created related cards, cart drawer items, and review helpful buttons.
- `.on("keyup input")`: Real-time search query filtering and form input error clearing.
- `.on("mouseenter")` / `.on("mouseleave")` / `.on("mousemove")`: Image magnifier zoom lens tracking and 5-star rating hover states.
- `.on("submit")`: Review form interception and validation without page reload.
- `$(document).on("keydown")`: Modal dismissal on `Escape` key.

### C. Class Manipulation
- `.addClass()` / `.removeClass()`:
  ```javascript
  $(".color-swatch-btn").removeClass("active");
  $btn.addClass("active");
  ```
- `.toggleClass()`:
  ```javascript
  $btn.toggleClass("active", state.isWishlisted);
  ```
- `.hasClass()`:
  ```javascript
  if ($thumb.hasClass("active")) return;
  ```

### D. Effects & Animations
- `.fadeIn()` and `.fadeOut()`:
  ```javascript
  $mainImg.fadeOut(180, function() {
    $mainImg.attr("src", newSrc).fadeIn(220);
  });
  $("#checkout-modal-backdrop").fadeIn(250);
  ```
- `.slideDown()` and `.slideUp()`:
  ```javascript
  $newReviewCard.slideDown(400);
  ```
- `.animate()`:
  ```javascript
  $("html, body").animate({ scrollTop: $("#tabs-section").offset().top - 80 }, 500);
  ```

### E. Form Validation Logic
- Ensures required attributes (`name`, `rating`, `comment`) are non-empty and valid.
- Applies `.input-error` CSS classes to invalid fields.
- Reveals `.form-error-msg` elements using `.fadeIn()`.
- Automatically clears error states on subsequent user keystrokes (`input` event).

### F. Dynamic Cart Functionality
- Centralized `state.cart` maintains items array, total item count, and monetary sum.
- Adding an item checks for existing IDs to update quantities or append new items.
- Updates header count badge with a CSS `@keyframes badgePop` bounce.
- Shakes the navbar cart icon with `@keyframes cartShakeAnim`.
- Syncs the interactive off-canvas cart drawer with line-item deletion and total checkout.
