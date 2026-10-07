$(document).ready(function () {
  "use strict";

  const productData = {
    id: "prod-aq-750",
    name: "Premium Wireless Headphones",
    brand: "AcoustiQ Pro",
    sku: "AQ-HP-750X",
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    rating: 4.5,
    reviewsCount: 128,
    stock: 15,
    colors: [
      {
        id: "black",
        name: "Midnight Black",
        hex: "#1e293b",
        image: "assets/images/product-black-1.jpg",
      },
      {
        id: "white",
        name: "Pearl White",
        hex: "#f1f5f9",
        image: "assets/images/product-white-1.jpg",
      },
      {
        id: "blue",
        name: "Deep Blue",
        hex: "#1e3a8a",
        image: "assets/images/product-blue-1.jpg",
      },
    ],
    variants: [
      { id: "small", name: "Small", desc: "On-Ear Compact Fit" },
      { id: "medium", name: "Medium", desc: "Standard Over-Ear Fit" },
      { id: "large", name: "Large", desc: "Pro Over-Ear Cushioned" },
    ],
    images: [
      {
        src: "assets/images/product-black-1.jpg",
        alt: "Headphones Front View",
      },
      {
        src: "assets/images/product-black-2.jpg",
        alt: "Headphones Angled Detail",
      },
      {
        src: "assets/images/product-white-1.jpg",
        alt: "Headphones White Edition",
      },
      {
        src: "assets/images/product-blue-1.jpg",
        alt: "Headphones Navy Edition",
      },
    ],
    description:
      "Experience studio-grade acoustic clarity with active hybrid noise cancellation, ultra-plush ergonomic memory-foam cushions, 40mm titanium drivers, and an astonishing 60-hour playtime on a single charge.",
    specifications: {
      Brand: "AcoustiQ",
      Model: "Elite Wireless 750 ANC",
      Weight: "245 grams (Ultra-lightweight)",
      Battery: "60 Hours (800 mAh Li-Po, Fast Charge)",
      Connectivity: "Bluetooth 5.3 LE, 3.5mm Aux, USB-C Audio",
      Warranty: "1 Year Manufacturer Replacement Warranty",
      Material: "Aerospace Aluminium Frame & Memory Foam",
    },
    reviews: [
      {
        id: "rev-1",
        name: "Vikram Malhotra",
        rating: 5,
        date: "2 days ago",
        verified: true,
        comment:
          "The noise cancellation blew my expectations out of the water! I use it daily on the metro and the rumble disappears completely. Soundstage is wide with punchy, controlled bass.",
        helpful: 24,
      },
      {
        id: "rev-2",
        name: "Ananya Iyer",
        rating: 5,
        date: "1 week ago",
        verified: true,
        comment:
          "Super comfortable for long Zoom calls and gaming sessions. The memory foam doesn't pinch my ears even after 6 hours straight. Battery lasts almost two weeks on single charge!",
        helpful: 19,
      },
      {
        id: "rev-3",
        name: "Rohan Deshmukh",
        rating: 4,
        date: "2 weeks ago",
        verified: true,
        comment:
          "Excellent value at ₹2,999. Treble is crisp and Bluetooth 5.3 multi-device pairing works like magic between my MacBook and Android phone.",
        helpful: 11,
      },
    ],
  };

  const relatedProducts = [
    {
      id: "rel-1",
      name: "Smart Audio Glasses Pro",
      brand: "AcoustiQ",
      price: 4499,
      originalPrice: 6999,
      discount: "35% OFF",
      rating: 4.7,
      reviews: 94,
      image: "assets/images/related-1.jpg",
    },
    {
      id: "rel-2",
      name: "Hi-Fi True Wireless Earbuds",
      brand: "AcoustiQ",
      price: 1999,
      originalPrice: 3499,
      discount: "43% OFF",
      rating: 4.6,
      reviews: 215,
      image: "assets/images/related-2.jpg",
    },
    {
      id: "rel-3",
      name: "Deep Bass Portable Bluetooth Speaker",
      brand: "AcoustiQ",
      price: 3299,
      originalPrice: 5499,
      discount: "40% OFF",
      rating: 4.8,
      reviews: 142,
      image: "assets/images/related-3.jpg",
    },
    {
      id: "rel-4",
      name: "Studio Broadcast Condenser Mic",
      brand: "AcoustiQ",
      price: 5999,
      originalPrice: 8999,
      discount: "33% OFF",
      rating: 4.9,
      reviews: 88,
      image: "assets/images/related-4.jpg",
    },
  ];
  const state = {
    selectedColor: "Midnight Black",
    selectedColorHex: "#1e293b",
    selectedSize: "Medium",
    quantity: 1,
    isWishlisted: false,
    wishlistCount: 0,
    cart: {
      count: 0,
      total: 0,
      items: [],
    },
  };
  function initPage() {
    renderProductDetails();
    renderReviewsList();
    renderRelatedProducts(relatedProducts);
    updateSubtotal();
    setupImageZoom();
  }

  // Populate product info dynamically from data object
  function renderProductDetails() {
    $("#product-brand").text(productData.brand);
    $("#product-sku-code").text(productData.sku);
    $("#product-name").text(productData.name);
    $("#modal-product-name").text(productData.name);
    $("#breadcrumb-current-product").text(productData.name);

    // Pricing & Discount
    $("#product-current-price").text(formatCurrency(productData.price));
    $("#product-original-price").text(
      formatCurrency(productData.originalPrice),
    );
    $("#product-discount-badge").text(`${productData.discount}% OFF`);
    $("#floating-discount-badge").text(`${productData.discount}% OFF`);

    const savings = productData.originalPrice - productData.price;
    $("#price-savings-amount").text(formatCurrency(savings));

    // Stock
    $("#product-stock-status").text("✓ In Stock");
    $("#product-stock-units").text(`(${productData.stock} units available)`);
    $("#quantity-input").attr("max", productData.stock);

    // Reviews count
    updateReviewCountsUI();

    // Technical specifications
    $("#spec-brand").text(productData.specifications["Brand"]);
    $("#spec-model").text(productData.specifications["Model"]);
    $("#spec-weight").text(productData.specifications["Weight"]);
    $("#spec-battery").text(productData.specifications["Battery"]);
    $("#spec-connectivity").text(productData.specifications["Connectivity"]);
    $("#spec-warranty").text(productData.specifications["Warranty"]);
    $("#spec-material").text(productData.specifications["Material"]);
  }

  // Handle Thumbnail click with jQuery fade animation
  $(document).on("click", ".thumb-btn", function () {
    const $thumb = $(this);
    const newSrc = $thumb.data("src");

    // Don't animate if already active
    if ($thumb.hasClass("active")) return;

    // Class manipulation
    $(".thumb-btn").removeClass("active");
    $thumb.addClass("active");

    // Smooth image transition with jQuery fade effects
    const $mainImg = $("#main-product-img");
    $mainImg.fadeOut(180, function () {
      $mainImg.attr("src", newSrc);
      $mainImg.attr("data-zoom-src", newSrc);
      $mainImg.fadeIn(220);
    });
  });

  // Simple and interactive image zoom magnifier effect
  function setupImageZoom() {
    const $viewport = $("#main-image-viewport");
    const $img = $("#main-product-img");
    const $lens = $("#zoom-lens");
    const $result = $("#zoom-result");

    $viewport.on("mouseenter", function () {
      if ($(window).width() <= 768) return; // Disable zoom on mobile devices
      const zoomSrc = $img.attr("src");
      $result
        .css({
          "background-image": `url('${zoomSrc}')`,
          "background-size": `${$img.width() * 2}px ${$img.height() * 2}px`,
        })
        .fadeIn(150);
      $lens.fadeIn(150);
    });

    $viewport.on("mouseleave", function () {
      $result.fadeOut(150);
      $lens.fadeOut(150);
    });

    $viewport.on("mousemove", function (e) {
      if ($(window).width() <= 768) return;

      const offset = $viewport.offset();
      const viewportWidth = $viewport.innerWidth();
      const viewportHeight = $viewport.innerHeight();

      const lensWidth = 140;
      const lensHeight = 140;
      $lens.css({ width: lensWidth, height: lensHeight });

      // Calculate cursor position relative to viewport
      let x = e.pageX - offset.left - lensWidth / 2;
      let y = e.pageY - offset.top - lensHeight / 2;

      // Prevent lens from going outside the image boundaries
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > viewportWidth - lensWidth) x = viewportWidth - lensWidth;
      if (y > viewportHeight - lensHeight) y = viewportHeight - lensHeight;

      // Position lens
      $lens.css({ left: x + "px", top: y + "px" });

      // Move background of zoom preview flyout
      const ratioX = (x / (viewportWidth - lensWidth)) * 100;
      const ratioY = (y / (viewportHeight - lensHeight)) * 100;
      $result.css({
        "background-position": `${ratioX}% ${ratioY}%`,
      });
    });
  }

  // Floating Wishlist Button Toggle (Section 2)
  $("#product-wishlist-btn").on("click", function () {
    const $btn = $(this);
    state.isWishlisted = !state.isWishlisted;

    // Toggle active class
    $btn.toggleClass("active", state.isWishlisted);

    if (state.isWishlisted) {
      state.wishlistCount++;
      showToast(
        "Added to Wishlist",
        `${productData.name} has been added to your saved wishlist!`,
        "success",
      );
    } else {
      state.wishlistCount = Math.max(0, state.wishlistCount - 1);
      showToast(
        "Removed from Wishlist",
        `${productData.name} removed from your saved items.`,
        "info",
      );
    }

    // Update wishlist count in header with bounce effect
    const $wishlistBadge = $("#header-wishlist-count");
    $wishlistBadge.text(state.wishlistCount);
    triggerBounce($wishlistBadge);
  });

  // Header wishlist click handler
  $("#header-wishlist-btn").on("click", function () {
    if (state.wishlistCount === 0) {
      showToast(
        "Wishlist Empty",
        "You haven't saved any items yet. Click the heart icon to save products!",
        "info",
      );
    } else {
      showToast(
        "Wishlist",
        `You have ${state.wishlistCount} saved item in your wishlist.`,
        "success",
      );
    }
  });

  // Color Swatch Selection with dynamic UI update
  $(document).on("click", ".color-swatch-btn", function () {
    const $btn = $(this);
    const colorName = $btn.data("color");
    const colorImg = $btn.data("img");

    // Remove active state from other color buttons
    $(".color-swatch-btn").removeClass("active").attr("aria-checked", "false");
    $btn.addClass("active").attr("aria-checked", "true");

    // Update application state
    state.selectedColor = colorName;

    // Update label dynamically using jQuery
    $("#selected-color-name").text(colorName);
    $("#color-validation-msg").fadeOut(200);

    // Switch image to match selected color if image available
    if (colorImg) {
      const $mainImg = $("#main-product-img");
      $mainImg.fadeOut(150, function () {
        $mainImg.attr("src", colorImg);
        $mainImg.attr("data-zoom-src", colorImg);
        $mainImg.fadeIn(200);
      });

      // Synchronize active thumbnail
      $(`.thumb-btn[data-src='${colorImg}']`)
        .addClass("active")
        .siblings()
        .removeClass("active");
    }
  });

  // Size / Variant Pill Selection with dynamic UI update
  $(document).on("click", ".size-pill-btn", function () {
    const $btn = $(this);
    const sizeName = $btn.data("size");
    const sizeDesc = $btn.data("desc");

    // Remove active state
    $(".size-pill-btn").removeClass("active").attr("aria-checked", "false");
    $btn.addClass("active").attr("aria-checked", "true");

    // Update state
    state.selectedSize = sizeName;

    // Update label dynamically
    $("#selected-size-name").text(`${sizeName} (${sizeDesc})`);
    $("#size-validation-msg").fadeOut(200);
  });

  // Increase Quantity [+]
  $("#qty-plus").on("click", function () {
    if (state.quantity < productData.stock) {
      state.quantity++;
      updateQuantityUI();
    } else {
      showToast(
        "Stock Limit Reached",
        `Only ${productData.stock} units available in stock right now.`,
        "warning",
      );
    }
  });

  // Decrease Quantity [-]
  $("#qty-minus").on("click", function () {
    if (state.quantity > 1) {
      state.quantity--;
      updateQuantityUI();
    }
  });

  // Update Quantity Input & Subtotal in the DOM
  function updateQuantityUI() {
    $("#quantity-input").val(state.quantity);

    // Handle button disabled states
    $("#qty-minus").prop("disabled", state.quantity <= 1);
    $("#qty-plus").prop("disabled", state.quantity >= productData.stock);

    updateSubtotal();
  }

  // Dynamic Subtotal calculation
  function updateSubtotal() {
    const subtotal = productData.price * state.quantity;
    $("#product-subtotal").text(formatCurrency(subtotal));
  }

  function validateProductOptions() {
    let isValid = true;

    // Check color selection
    if (!state.selectedColor) {
      $("#color-validation-msg").fadeIn(200);
      $("#color-options-list").addClass("shake-element");
      setTimeout(
        () => $("#color-options-list").removeClass("shake-element"),
        500,
      );
      isValid = false;
    } else {
      $("#color-validation-msg").fadeOut(200);
    }

    // Check size selection
    if (!state.selectedSize) {
      $("#size-validation-msg").fadeIn(200);
      $("#size-options-list").addClass("shake-element");
      setTimeout(
        () => $("#size-options-list").removeClass("shake-element"),
        500,
      );
      isValid = false;
    } else {
      $("#size-validation-msg").fadeOut(200);
    }

    if (!isValid) {
      showToast(
        "Selection Required",
        "Please choose both a color and a size variant before proceeding.",
        "warning",
      );
    }

    return isValid;
  }

  $("#btn-add-to-cart").on("click", function () {
    // 1. Validate required options
    if (!validateProductOptions()) {
      return;
    }

    const $btn = $(this);

    // Temporary button loading / feedback animation
    $btn.prop("disabled", true).find("span").text("Adding to Cart...");

    setTimeout(function () {
      // 2. Add product to cart state
      addToCart({
        id: `${productData.id}-${state.selectedColor}-${state.selectedSize}`,
        name: productData.name,
        color: state.selectedColor,
        size: state.selectedSize,
        price: productData.price,
        quantity: state.quantity,
        image: $("#main-product-img").attr("src"),
      });

      // 3. Show jQuery notification/toast
      showToast(
        "✓ Product added to cart",
        `${state.quantity}x ${productData.name} (${state.selectedColor}, ${state.selectedSize}) added successfully!`,
        "success",
      );

      // Reset button
      $btn.prop("disabled", false).find("span").text("Add to Cart");
    }, 300);
  });

  // Reusable addToCart function
  function addToCart(item) {
    const existingIndex = state.cart.items.findIndex((i) => i.id === item.id);
    if (existingIndex > -1) {
      state.cart.items[existingIndex].quantity += item.quantity;
    } else {
      state.cart.items.push(item);
    }

    // Recalculate totals
    state.cart.count = state.cart.items.reduce(
      (total, i) => total + i.quantity,
      0,
    );
    state.cart.total = state.cart.items.reduce(
      (total, i) => total + i.price * i.quantity,
      0,
    );

    // Update Navbar Badge
    const $cartBadge = $("#header-cart-count");
    $cartBadge.text(state.cart.count);
    triggerBounce($cartBadge);

    // Animate navbar cart icon
    const $cartBtn = $("#header-cart-btn");
    $cartBtn.addClass("cart-shake");
    setTimeout(() => $cartBtn.removeClass("cart-shake"), 600);

    // Update Cart Drawer DOM
    updateCartDrawer();
  }

  // Update Cart Slide-out Drawer
  function updateCartDrawer() {
    const $itemsContainer = $("#cart-drawer-items");
    const $footer = $("#cart-drawer-footer");
    $("#cart-drawer-count").text(state.cart.count);

    if (state.cart.items.length === 0) {
      $itemsContainer.html(`
        <div class="empty-cart-state" id="empty-cart-state">
          <i class="fa-solid fa-cart-arrow-down empty-cart-icon"></i>
          <p>Your shopping bag is currently empty.</p>
          <button class="btn btn-sm btn-primary-outline" id="btn-browse-products">Explore Products</button>
        </div>
      `);
      $footer.hide();
      return;
    }

    $footer.show();
    $("#cart-drawer-total").text(formatCurrency(state.cart.total));

    let html = "";
    state.cart.items.forEach((item, index) => {
      html += `
        <div class="cart-item-row" data-index="${index}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-meta">
            <h5 class="cart-item-title">${item.name}</h5>
            <div class="cart-item-variant">${item.color || "Standard"} • ${item.size || "Regular"}</div>
            <div class="cart-item-price-qty">${item.quantity} × ${formatCurrency(item.price)}</div>
          </div>
          <button type="button" class="btn-remove-cart-item" data-index="${index}" title="Remove item">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      `;
    });
    $itemsContainer.html(html);
  }

  // Remove Item from Cart Drawer
  $(document).on("click", ".btn-remove-cart-item", function () {
    const index = $(this).data("index");
    const removedItem = state.cart.items.splice(index, 1)[0];

    // Recalculate totals
    state.cart.count = state.cart.items.reduce(
      (total, i) => total + i.quantity,
      0,
    );
    state.cart.total = state.cart.items.reduce(
      (total, i) => total + i.price * i.quantity,
      0,
    );

    $("#header-cart-count").text(state.cart.count);
    updateCartDrawer();

    showToast(
      "Item Removed",
      `${removedItem.name} removed from your cart.`,
      "info",
    );
  });

  // Clear Entire Cart
  $(document).on("click", "#btn-clear-cart", function () {
    state.cart.items = [];
    state.cart.count = 0;
    state.cart.total = 0;
    $("#header-cart-count").text(0);
    updateCartDrawer();
    showToast(
      "Cart Cleared",
      "All items have been removed from your cart.",
      "info",
    );
  });

  // Toggle Cart Drawer
  $("#header-cart-btn").on("click", function () {
    openCartDrawer();
  });

  $("#cart-drawer-close, #cart-drawer-backdrop").on("click", function () {
    closeCartDrawer();
  });

  function openCartDrawer() {
    $("#cart-drawer-backdrop").fadeIn(200);
    $("#cart-drawer").addClass("open");
  }

  function closeCartDrawer() {
    $("#cart-drawer").removeClass("open");
    $("#cart-drawer-backdrop").fadeOut(200);
  }

  // Checkout button in cart drawer
  $(document).on("click", "#btn-cart-checkout", function () {
    closeCartDrawer();
    openBuyNowModal();
  });

  $(document).on("click", "#btn-browse-products", function () {
    closeCartDrawer();
    $("html, body").animate(
      {
        scrollTop: $("#related-products").offset().top - 80,
      },
      500,
    );
  });

  // Buy Now click
  $("#btn-buy-now").on("click", function () {
    if (!validateProductOptions()) {
      return;
    }
    openBuyNowModal();
  });

  function openBuyNowModal() {
    // Populate Modal Details dynamically using jQuery
    $("#modal-product-img").attr("src", $("#main-product-img").attr("src"));
    $("#modal-product-name").text(productData.name);
    $("#modal-selected-color").text(state.selectedColor);
    $("#modal-selected-size").text(state.selectedSize);
    $("#modal-unit-price").text(formatCurrency(productData.price));
    $("#modal-quantity").text(state.quantity);

    const total = productData.price * state.quantity;
    $("#modal-subtotal").text(formatCurrency(total));
    $("#modal-grand-total").text(formatCurrency(total));

    // Show modal with jQuery fadeIn
    $("#checkout-modal-backdrop").fadeIn(250);
    $("body").css("overflow", "hidden"); // Prevent background scrolling
  }

  function closeBuyNowModal() {
    $("#checkout-modal-backdrop").fadeOut(200, function () {
      $("body").css("overflow", "");
    });
  }

  // Modal Cancel & Close buttons
  $("#modal-cancel-btn, #modal-close-btn").on("click", function () {
    closeBuyNowModal();
  });

  // Close modal when clicking on the dark backdrop
  $("#checkout-modal-backdrop").on("click", function (e) {
    if ($(e.target).is("#checkout-modal-backdrop")) {
      closeBuyNowModal();
    }
  });

  // Close modal on Escape key press
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      closeBuyNowModal();
      closeCartDrawer();
      $("#user-dropdown").fadeOut(150);
    }
  });

  // Modal Proceed to Checkout Button
  $("#modal-proceed-btn").on("click", function () {
    const $btn = $(this);
    $btn
      .prop("disabled", true)
      .html('<i class="fa-solid fa-spinner fa-spin"></i> Processing Order...');

    setTimeout(function () {
      closeBuyNowModal();
      $btn
        .prop("disabled", false)
        .html('<i class="fa-solid fa-lock"></i> Proceed to Checkout');

      showToast(
        "🎉 Order Confirmed!",
        `Thank you for your order! Your confirmation #ORD-${Math.floor(100000 + Math.random() * 900000)} has been sent.`,
        "success",
      );
    }, 1200);
  });

  $(".tab-link").on("click", function () {
    const $btn = $(this);
    const targetTabId = $btn.data("tab");

    // Don't switch if already active
    if ($btn.hasClass("active")) return;

    // Switch tab active classes
    $(".tab-link").removeClass("active").attr("aria-selected", "false");
    $btn.addClass("active").attr("aria-selected", "true");

    // Switch tab content pane using jQuery fade effects
    $(".tab-pane").hide();
    $(`#${targetTabId}`).fadeIn(250);
  });

  // Jump directly to reviews tab when clicking rating box in header
  $("#scroll-to-reviews-btn").on("click", function (e) {
    e.preventDefault();
    $("#tab-reviews-btn").trigger("click");
    $("html, body").animate(
      {
        scrollTop: $("#tabs-section").offset().top - 80,
      },
      500,
    );
  });

  // Render initial reviews
  function renderReviewsList() {
    const $reviewsList = $("#reviews-list");
    $reviewsList.empty();

    productData.reviews.forEach((review) => {
      const reviewHtml = createReviewCardHtml(review);
      $reviewsList.append(reviewHtml);
    });

    updateReviewCountsUI();
  }

  // Generate Review Card HTML element
  function createReviewCardHtml(review) {
    const initials = review.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2);

    let starIcons = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= review.rating) {
        starIcons += '<i class="fa-solid fa-star"></i>';
      } else {
        starIcons += '<i class="fa-regular fa-star"></i>';
      }
    }

    return `
      <div class="review-item-card" data-review-id="${review.id}">
        <div class="review-card-header">
          <div class="reviewer-meta">
            <div class="reviewer-avatar">${initials}</div>
            <div>
              <div class="reviewer-name">${escapeHtml(review.name)}</div>
              ${review.verified ? '<span class="verified-buyer-tag"><i class="fa-solid fa-circle-check"></i> Verified Buyer</span>' : ""}
            </div>
          </div>
          <span class="review-date">${review.date}</span>
        </div>
        <div class="review-card-rating">
          <div class="stars-group">${starIcons}</div>
        </div>
        <p class="review-card-comment">${escapeHtml(review.comment)}</p>
        <div class="review-helpful-action">
          <i class="fa-regular fa-thumbs-up"></i>
          <span>Helpful (<strong class="helpful-count">${review.helpful || 0}</strong>)</span>
        </div>
      </div>
    `;
  }

  // Interactive Review Form Star Picker
  let selectedRating = 0;
  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Outstanding"];

  $(".star-btn").on("mouseenter", function () {
    const hoverVal = parseInt($(this).data("rating"), 10);
    highlightStars(hoverVal);
    $("#rating-text-feedback").text(ratingLabels[hoverVal - 1]);
  });

  $("#star-picker").on("mouseleave", function () {
    highlightStars(selectedRating);
    if (selectedRating > 0) {
      $("#rating-text-feedback").text(ratingLabels[selectedRating - 1]);
    } else {
      $("#rating-text-feedback").text("Select stars");
    }
  });

  $(".star-btn").on("click", function () {
    selectedRating = parseInt($(this).data("rating"), 10);
    $("#review-rating-value").val(selectedRating);
    highlightStars(selectedRating);
    $("#rating-text-feedback").text(ratingLabels[selectedRating - 1]);
    $("#error-rating").fadeOut(200);
  });

  function highlightStars(rating) {
    $(".star-btn").each(function () {
      const starRating = parseInt($(this).data("rating"), 10);
      const $icon = $(this).find("i");
      if (starRating <= rating) {
        $(this).addClass("selected");
        $icon.removeClass("fa-regular").addClass("fa-solid");
      } else {
        $(this).removeClass("selected");
        $icon.removeClass("fa-solid").addClass("fa-regular");
      }
    });
  }

  // Real-time input validation on keystrokes
  $("#review-name").on("input", function () {
    if ($(this).val().trim() !== "") {
      $(this).removeClass("input-error");
      $("#error-name").fadeOut(150);
    }
  });

  $("#review-comment").on("input", function () {
    if ($(this).val().trim() !== "") {
      $(this).removeClass("input-error");
      $("#error-comment").fadeOut(150);
    }
  });

  // Review Form Submit Handler (Section 9)
  $("#product-review-form").on("submit", function (e) {
    e.preventDefault();

    const nameVal = $("#review-name").val().trim();
    const ratingVal = parseInt($("#review-rating-value").val(), 10);
    const commentVal = $("#review-comment").val().trim();

    let hasErrors = false;

    // 1. Name validation: cannot be empty
    if (!nameVal) {
      $("#review-name").addClass("input-error");
      $("#error-name").fadeIn(200);
      hasErrors = true;
    } else {
      $("#review-name").removeClass("input-error");
      $("#error-name").fadeOut(150);
    }

    // 2. Rating validation: must be selected
    if (!ratingVal || ratingVal < 1) {
      $("#error-rating").fadeIn(200);
      hasErrors = true;
    } else {
      $("#error-rating").fadeOut(150);
    }

    // 3. Comment validation: cannot be empty
    if (!commentVal) {
      $("#review-comment").addClass("input-error");
      $("#error-comment").fadeIn(200);
      hasErrors = true;
    } else {
      $("#review-comment").removeClass("input-error");
      $("#error-comment").fadeOut(150);
    }

    if (hasErrors) {
      showToast(
        "Form Incomplete",
        "Please fill in all required fields to submit your review.",
        "danger",
      );
      return;
    }

    // Create review object
    const newReview = {
      id: `rev-${Date.now()}`,
      name: nameVal,
      rating: ratingVal,
      date: "Just now",
      verified: true,
      comment: commentVal,
      helpful: 0,
    };

    // Prepend new review card to reviews list with slideDown animation
    const $newReviewCard = $(createReviewCardHtml(newReview))
      .addClass("just-added")
      .hide();
    $("#reviews-list").prepend($newReviewCard);
    $newReviewCard.slideDown(400);

    // Update product reviews count and UI counters dynamically
    productData.reviewsCount++;
    productData.reviews.unshift(newReview);
    updateReviewCountsUI();

    // Reset Form fields and stars
    $("#product-review-form")[0].reset();
    selectedRating = 0;
    $("#review-rating-value").val(0);
    highlightStars(0);
    $("#rating-text-feedback").text("Select stars");

    // Success notification
    showToast(
      "✓ Review Submitted",
      `Thank you, ${nameVal}! Your verified review has been posted.`,
      "success",
    );
  });

  // Helpful reaction button on review card
  $(document).on("click", ".review-helpful-action", function () {
    const $count = $(this).find(".helpful-count");
    let current = parseInt($count.text(), 10) || 0;
    $count.text(current + 1);
    $(this).css({ color: "var(--primary)", "pointer-events": "none" });
    showToast(
      "Feedback Recorded",
      "Thank you for letting us know this review was helpful!",
      "info",
    );
  });

  // Update Review Counters across all page locations
  function updateReviewCountsUI() {
    const total = productData.reviewsCount;
    $("#review-count-header").text(total);
    $("#reviews-tab-count").text(total);
    $("#summary-reviews-count").text(total);
    $("#feed-review-count").text(total);
  }

  // Render related products dynamically
  function renderRelatedProducts(productsList) {
    const $grid = $("#related-products-grid");
    $grid.empty();

    productsList.forEach((prod) => {
      const cardHtml = `
        <div class="product-card" data-id="${prod.id}" data-name="${prod.name.toLowerCase()}">
          <div class="card-image-box">
            <span class="card-discount-tag">${prod.discount}</span>
            <img src="${prod.image}" alt="${prod.name}" loading="lazy">
          </div>
          <div class="card-body">
            <h4 class="card-title">${prod.name}</h4>
            <div class="card-rating-row">
              <div class="stars-group">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
              </div>
              <span>${prod.rating} (${prod.reviews})</span>
            </div>
            <div class="card-price-row">
              <span class="card-current-price">${formatCurrency(prod.price)}</span>
              <span class="card-original-price">${formatCurrency(prod.originalPrice)}</span>
            </div>
            <button type="button" class="btn-card-add-cart" data-id="${prod.id}">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      `;
      $grid.append(cardHtml);
    });
  }

  // Handle Related Product "Add to Cart" click
  $(document).on("click", ".btn-card-add-cart", function () {
    const prodId = $(this).data("id");
    const product = relatedProducts.find((p) => p.id === prodId);

    if (product) {
      const $btn = $(this);
      const originalText = $btn.html();

      // Button feedback
      $btn.html('<i class="fa-solid fa-check"></i> Added!');
      setTimeout(() => $btn.html(originalText), 1500);

      // Add to global cart
      addToCart({
        id: product.id,
        name: product.name,
        color: "Standard Edition",
        size: "Regular",
        price: product.price,
        quantity: 1,
        image: product.image,
      });

      // Show toast
      showToast(
        "✓ Added to cart",
        `${product.name} has been added to your shopping cart!`,
        "success",
      );
    }
  });

  // Real-time filtering of related products via navbar search
  $("#nav-search-input").on("keyup input", function () {
    const query = $(this).val().toLowerCase().trim();
    filterProducts(query);

    // Show/hide clear search button
    if (query.length > 0) {
      $("#search-clear-btn").show();
      renderSearchSuggestions(query);
    } else {
      $("#search-clear-btn").hide();
      $("#search-results-dropdown").hide();
    }
  });

  // Clear search input
  $("#search-clear-btn, #btn-clear-search-empty, #reset-filter-btn").on(
    "click",
    function () {
      $("#nav-search-input").val("");
      $("#search-clear-btn").hide();
      $("#search-results-dropdown").hide();
      filterProducts("");
    },
  );

  // Filter Related Products with jQuery animations
  function filterProducts(query) {
    const $cards = $(".product-card");
    const $noResults = $("#no-products-found");
    const $filterStatus = $("#related-filter-status");

    if (!query) {
      $cards.fadeIn(200);
      $noResults.hide();
      $filterStatus.hide();
      return;
    }

    let matchCount = 0;

    $cards.each(function () {
      const cardName = $(this).data("name") || "";
      if (cardName.indexOf(query) !== -1) {
        $(this).fadeIn(200);
        matchCount++;
      } else {
        $(this).fadeOut(200);
      }
    });

    $filterStatus.show();
    $("#active-search-term").text(query);

    if (matchCount === 0) {
      $("#empty-query-text").text(query);
      $noResults.fadeIn(250);
    } else {
      $noResults.hide();
    }
  }

  // Render quick search suggestion dropdown
  function renderSearchSuggestions(query) {
    const matches = relatedProducts.filter((p) =>
      p.name.toLowerCase().includes(query),
    );
    // Also include main product if it matches
    const mainMatches = productData.name.toLowerCase().includes(query);

    const $dropdown = $("#search-results-dropdown");
    const $list = $("#search-results-list");
    $list.empty();

    let count = 0;

    if (mainMatches) {
      $list.append(`
        <div class="search-item" data-action="scroll-main">
          <img src="${productData.images[0].src}" alt="${productData.name}">
          <div class="search-item-info">
            <div class="search-item-title">${productData.name} (Featured)</div>
            <div class="search-item-price">${formatCurrency(productData.price)}</div>
          </div>
        </div>
      `);
      count++;
    }

    matches.forEach((m) => {
      $list.append(`
        <div class="search-item" data-id="${m.id}" data-action="filter-related">
          <img src="${m.image}" alt="${m.name}">
          <div class="search-item-info">
            <div class="search-item-title">${m.name}</div>
            <div class="search-item-price">${formatCurrency(m.price)}</div>
          </div>
        </div>
      `);
      count++;
    });

    if (count > 0) {
      $dropdown.fadeIn(150);
    } else {
      $dropdown.hide();
    }
  }

  // Click on search dropdown item
  $(document).on("click", ".search-item", function () {
    const action = $(this).data("action");
    $("#search-results-dropdown").hide();

    if (action === "scroll-main") {
      $("html, body").animate(
        {
          scrollTop: $("#product-main").offset().top - 80,
        },
        500,
      );
    } else {
      $("html, body").animate(
        {
          scrollTop: $("#related-products").offset().top - 80,
        },
        500,
      );
    }
  });

  // Hide dropdown on outside click
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".header-search").length) {
      $("#search-results-dropdown").hide();
    }
  });

  // Toggle User dropdown
  $("#header-user-btn").on("click", function (e) {
    e.stopPropagation();
    $("#user-dropdown").fadeToggle(150);
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".user-account-wrapper").length) {
      $("#user-dropdown").fadeOut(150);
    }
  });

  // Mobile Hamburger Menu Drawer
  $("#mobile-menu-btn").on("click", function () {
    $("#nav-menu").addClass("open");
    $("#mobile-overlay").addClass("active");
    $("body").css("overflow", "hidden");
  });

  $("#close-menu-btn, #mobile-overlay, .nav-menu .nav-link").on(
    "click",
    function () {
      $("#nav-menu").removeClass("open");
      $("#mobile-overlay").removeClass("active");
      $("body").css("overflow", "");
    },
  );

  function showToast(title, message, type = "success") {
    const icons = {
      success: '<i class="fa-solid fa-circle-check"></i>',
      danger: '<i class="fa-solid fa-circle-xmark"></i>',
      warning: '<i class="fa-solid fa-triangle-exclamation"></i>',
      info: '<i class="fa-solid fa-circle-info"></i>',
    };

    const toastHtml = `
      <div class="custom-toast toast-${type}" role="alert">
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-body">
          <h5 class="toast-title">${title}</h5>
          <p class="toast-message">${message}</p>
        </div>
        <button type="button" class="toast-close" aria-label="Close notification">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `;

    const $toast = $(toastHtml).hide();
    $("#toast-container").append($toast);

    // Slide down or fade in
    $toast.fadeIn(250);

    // Auto dismiss after 4 seconds
    const dismissTimer = setTimeout(function () {
      dismissToast($toast);
    }, 4000);

    // Manual close button
    $toast.find(".toast-close").on("click", function () {
      clearTimeout(dismissTimer);
      dismissToast($toast);
    });
  }

  function dismissToast($toast) {
    $toast.fadeOut(250, function () {
      $(this).remove();
    });
  }

  // Currency Formatter (e.g. ₹2,999)
  function formatCurrency(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
  }

  // Trigger bounce animation on badges
  function triggerBounce($el) {
    $el.addClass("badge-bounce");
    setTimeout(() => $el.removeClass("badge-bounce"), 400);
  }

  // Prevent XSS in user submitted reviews
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  }

  initPage();
});
