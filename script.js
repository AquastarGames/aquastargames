// AQUASTAR GAMES — interactions: nav, burger, reveal, FAQ, form
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
    const open = nav.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }));
}

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// FAQ accordion
document.querySelectorAll(".faq-item").forEach(item => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  if (!q || !a) return;
  q.addEventListener("click", () => {
    const open = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach(other => {
      if (other !== item) {
        other.classList.remove("open");
        other.querySelector(".faq-a").style.maxHeight = null;
      }
    });
    item.classList.toggle("open", !open);
    a.style.maxHeight = open ? null : a.scrollHeight + "px";
  });
});

// contact form
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = document.getElementById("formOk");
    if (ok) ok.classList.add("show");
    form.querySelectorAll("input,textarea").forEach(f => f.value = "");
    setTimeout(() => { if (ok) ok.classList.remove("show"); }, 6000);
  });
}
