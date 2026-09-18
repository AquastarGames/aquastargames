// AQUASTAR minimal — nav, burger, reveal, form
const page = document.body.dataset.page || "home";

// active nav
document.querySelectorAll("[data-nav]").forEach(a => {
  if (a.dataset.nav === page) a.classList.add("active");
});

// burger
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
if (burger && nav) {
  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
    burger.classList.toggle("open");
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    burger.classList.remove("open");
  }));
}

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll(".game, .detail, .mini-card, .cta, .card").forEach(el => {
  el.classList.add("reveal");
  io.observe(el);
});

// form
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("formOk").classList.add("show");
    form.querySelectorAll("input,textarea").forEach(f => f.value = "");
    setTimeout(() => document.getElementById("formOk").classList.remove("show"), 5000);
  });
}
