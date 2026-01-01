/* MENU SLIDER */

const track = document.querySelector(".menu-track");
const btnLeft = document.querySelector(".slider-btn--left");
const btnRight = document.querySelector(".slider-btn--right");
const scrollAmount = 284;

if (track && btnLeft && btnRight) {
  btnLeft.addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });

  btnRight.addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
}

/* CART (DOM + DATA) */

const cartEl = document.getElementById("cart");
const cartButton = document.querySelector(".cart-button");
const cartClose = document.querySelector(".cart-close");
const cartCount = document.querySelector(".cart-count");
const cartItemsList = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");

const bottomBar = document.getElementById("bottom-bar");
const bottomCount = document.getElementById("bottom-count");
const bottomTotal = document.getElementById("bottom-total");

let cartItems = [];

/* ADD TO CART */

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".drink-card");
    if (!card) return;

    const title = card.querySelector(".drink-title").textContent;
    const price = parseInt(card.querySelector(".drink-price").textContent, 10);

    const existing = cartItems.find((item) => item.title === title);

    if (existing) {
      existing.qty += 1;
    } else {
      cartItems.push({ title, price, qty: 1 });
    }

    updateCart();

    card.classList.add("added");
    setTimeout(() => card.classList.remove("added"), 400);

    cartButton.classList.add("bump");
    setTimeout(() => cartButton.classList.remove("bump"), 300);
  });
});

/* OPEN / CLOSE CART*/

if (cartButton) {
  cartButton.addEventListener("click", () => {
    cartEl.classList.toggle("show");
  });
}

if (cartClose) {
  cartClose.addEventListener("click", () => {
    cartEl.classList.remove("show");
  });
}

/* UPDATE CART UI */

function updateCart() {
  cartItemsList.innerHTML = "";

  let total = 0;
  let count = 0;

  cartItems.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.title} x${item.qty} — ${item.price * item.qty} ₽
      <button class="remove-item" data-index="${index}">×</button>
    `;
    cartItemsList.appendChild(li);
  });

  cartTotal.textContent = `Итого: ${total} ₽`;
  cartCount.textContent = count;

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.target.dataset.index);
      cartItems.splice(idx, 1);
      updateCart();
    });
  });

  if (cartItems.length > 0) {
    bottomBar?.classList.add("show");
    bottomCount.textContent = count;
    bottomTotal.textContent = total + " ₽";
  } else {
    bottomBar?.classList.remove("show");
  }
}

/* MOBILE CART SWIPE */

let startY = 0;

if (cartEl) {
  cartEl.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
  });

  cartEl.addEventListener("touchend", (e) => {
    const endY = e.changedTouches[0].clientY;
    if (endY - startY > 80) {
      cartEl.classList.remove("show");
    }
  });
}

/* BOTTOM BAR BUTTON */

document.querySelector(".bottom-bar__btn")?.addEventListener("click", () => {
  cartEl.classList.add("show");
});

/* ACCORDION (FOOTER) */

document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;

    document.querySelectorAll(".accordion-content").forEach((item) => {
      if (item !== content) {
        item.style.maxHeight = null;
        item.previousElementSibling.classList.remove("active");
      }
    });

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      header.classList.remove("active");
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      header.classList.add("active");
    }
  });
});

/*  BURGER MENU (MOBILE NAV) */

const burger = document.getElementById("burger");
const nav = document.querySelector(".main-nav");

if (burger && nav) {
  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

/* SNOW CANVAS */

const canvas = document.getElementById("snow-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const SNOW_COUNT = 120;
  const snowflakes = [];

  class Snowflake {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height;
      this.radius = 1 + Math.random() * 2.5;
      this.speedY = 0.4 + Math.random() * 1.5;
      this.speedX = Math.random() * 0.4;
      this.angle = Math.random() * Math.PI * 2;
      this.swing = 0.4 + Math.random();
    }

    update() {
      this.angle += 0.01;
      this.y += this.speedY;
      this.x += Math.sin(this.angle) * this.swing + this.speedX;

      if (this.y > canvas.height) {
        this.reset();
        this.y = -this.radius;
      }

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fill();
    }
  }

  for (let i = 0; i < SNOW_COUNT; i++) {
    snowflakes.push(new Snowflake());
  }

  function animateSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const snowflake of snowflakes) {
      snowflake.update();
      snowflake.draw();
    }

    requestAnimationFrame(animateSnow);
  }

  animateSnow();
}

function fillMascotPattern(el) {
  const word = el.dataset.word;
  el.innerHTML = "";

  const rect = el.getBoundingClientRect();

  if (!rect.width || !rect.height) return;

  const wordWidth = 110;
  const wordHeight = 34;

  const cols = Math.ceil(rect.width / wordWidth);
  const rows = Math.ceil(rect.height / wordHeight);

  const total = cols * rows;

  for (let i = 0; i < total; i++) {
    const span = document.createElement("span");
    span.textContent = word;
    el.appendChild(span);
  }
}

const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    fillMascotPattern(entry.target);
  });
});

document.querySelectorAll(".mascot-pattern").forEach((el) => {
  observer.observe(el);
});
