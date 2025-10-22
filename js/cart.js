document.addEventListener("DOMContentLoaded", () => {
  const cartItemsDiv = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartItemsDiv.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
      totalPriceEl.textContent = "Total: ₦0";
      return;
    }

    cart.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>₦${item.price.toLocaleString()} × ${item.quantity}</p>
        </div>
        <button class="remove">🗑</button>
      `;
      div.querySelector(".remove").addEventListener("click", () => removeItem(item.id));
      cartItemsDiv.appendChild(div);
      total += item.price * item.quantity;
    });

    totalPriceEl.textContent = `Total: ₦${total.toLocaleString()}`;
  }

  function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
  }

  function updateCartCount() {
    document.getElementById("cart-count").textContent =
      cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    let message = "Hello Aaliyah Blinq 👋%0AI’d like to order:%0A";
    let total = 0;
    cart.forEach(item => {
      message += `- ${item.name} × ${item.quantity} — ₦${item.price.toLocaleString()}%0A`;
      total += item.price * item.quantity;
    });
    message += `%0ATotal: ₦${total.toLocaleString()}`;
    window.open(`https://wa.me/2349043495526?text=${message}`, "_blank");
  });

  renderCart();
  updateCartCount();
});