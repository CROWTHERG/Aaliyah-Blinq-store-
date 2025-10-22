// shop.js — Load products, enable search, and handle cart
document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("productGrid");
  const searchInput = document.getElementById("searchInput");
  const cartCount = document.getElementById("cart-count");

  // Create preview dropdown dynamically
  const previewBox = document.createElement("div");
  previewBox.className = "search-preview";
  searchInput.parentNode.appendChild(previewBox);

  let allProducts = [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Fetch products
  fetch("data/products.json")
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      displayProducts(allProducts);
    })
    .catch(err => console.error("Error loading products:", err));

  // Display all products
  function displayProducts(products) {
    productGrid.innerHTML = "";

    if (products.length === 0) {
      productGrid.innerHTML = `<p class="no-results">No products found.</p>`;
      return;
    }

    products.forEach(p => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">₦${p.price.toLocaleString()}</p>
        <button class="add-to-cart">Add to Cart</button>
      `;
      card.querySelector(".add-to-cart").addEventListener("click", () => addToCart(p));
      productGrid.appendChild(card);
    });
  }

  // Add to cart
  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} added to cart`);
  }

  // Toast popup
  function showToast(text) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  }

  // Update cart count
  function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
  }

  updateCartCount();

  // 💎 Search with live preview
  searchInput.addEventListener("input", e => {
    const term = e.target.value.toLowerCase().trim();
    if (term === "") {
      previewBox.innerHTML = "";
      previewBox.style.display = "none";
      displayProducts(allProducts);
      return;
    }

    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
    displayProducts(filtered);

    // Show preview dropdown
    if (filtered.length > 0) {
      previewBox.style.display = "block";
      previewBox.innerHTML = filtered
        .slice(0, 5) // show only first 5 suggestions
        .map(
          p => `
        <div class="preview-item" data-id="${p.id}">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <h4>${p.name}</h4>
            <p>₦${p.price.toLocaleString()}</p>
          </div>
        </div>`
        )
        .join("");
    } else {
      previewBox.style.display = "block";
      previewBox.innerHTML = `<p class="no-match">No matches found</p>`;
    }
  });

  // Handle clicking a preview item
  previewBox.addEventListener("click", e => {
    const item = e.target.closest(".preview-item");
    if (!item) return;

    const product = allProducts.find(p => p.id == item.dataset.id);
    if (product) {
      productGrid.scrollIntoView({ behavior: "smooth" });
      displayProducts([product]);
      searchInput.value = product.name;
      previewBox.style.display = "none";
    }
  });

  // Hide preview when clicking outside
  document.addEventListener("click", e => {
    if (!searchInput.contains(e.target) && !previewBox.contains(e.target)) {
      previewBox.style.display = "none";
    }
  });
});