document.addEventListener("DOMContentLoaded", () => {
  // Update cart count
  const cartCount = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Hamburger menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  // Close menu when clicking a link (mobile)
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("open");
      navMenu.classList.remove("open");
    });
  });
});