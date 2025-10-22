document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const totalDisplay = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Your cart is empty 🛍</p>";
      totalDisplay.textContent = "₦0";
      return;
    }

    let total = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-img">
        <div>
          <h4>${item.name}</h4>
          <p>₦${item.price.toLocaleString()} × ${item.quantity}</p>
        </div>
        <button class="remove" data-id="${item.id}">Remove</button>
      `;

      cartItemsContainer.appendChild(div);
    });

    totalDisplay.textContent = `₦${total.toLocaleString()}`;

    document.querySelectorAll(".remove").forEach(btn =>
      btn.addEventListener("click", e => removeFromCart(e.target.dataset.id))
    );
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id != id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const phone = "2349043495526"; // Aaliyah Blinq WhatsApp number
    let message = "🛍 *Aaliyah Blinq Order*%0A%0A";

    cart.forEach(item => {
      // Full image URL for WhatsApp link preview
      const imageURL = `${window.location.origin}/${item.image}`;
      message += `✨ *${item.name}*%0A₦${item.price.toLocaleString()} × ${item.quantity}%0A📸 ${imageURL}%0A%0A`;
    });

    message += `🧾 *Total:* ₦${cart
      .reduce((sum, i) => sum + i.price * i.quantity, 0)
      .toLocaleString()}%0A%0APlease confirm my order ❤️`;

    const whatsappURL = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappURL, "_blank");
  });

  renderCart();
});