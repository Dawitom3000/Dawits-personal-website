document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navigation = document.getElementById("site-nav");

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = new Date().getFullYear();
});

function closeNavigation() {
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
  navigation?.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

navToggle?.addEventListener("click", () => {
  const opening = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(opening));
  navToggle.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
  navigation?.classList.toggle("is-open", opening);
  document.body.classList.toggle("nav-open", opening);
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));

window.matchMedia("(min-width: 721px)").addEventListener("change", (event) => {
  if (event.matches) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (navToggle?.getAttribute("aria-expanded") !== "true") return;
  const navLinks = Array.from(navigation.querySelectorAll("a"));
  const lastLink = navLinks.at(-1);
  if (event.key === "Escape") navToggle.focus();
  if (event.key !== "Tab") return;
  if (event.shiftKey && document.activeElement === navToggle) {
    event.preventDefault();
    lastLink?.focus();
  } else if (!event.shiftKey && document.activeElement === lastLink) {
    event.preventDefault();
    navToggle.focus();
  }
});

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealItems = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-project]");
const emptyFilter = document.querySelector("[data-empty-filter]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visible = 0;

    filterButtons.forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });

    projectCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category.split(" ").includes(filter);
      card.hidden = !matches;
      if (matches) visible += 1;
    });

    if (emptyFilter) emptyFilter.hidden = visible !== 0;
  });
});

const notes = Array.from(document.querySelectorAll("[data-note]"));
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxLabel = document.querySelector("[data-lightbox-label]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
let noteIndex = 0;

function updateLightbox() {
  const note = notes[noteIndex];
  const image = note?.querySelector("img");
  const label = note?.querySelector("small");
  const title = note?.querySelector("strong");
  if (!note || !image || !lightboxImage) return;
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  if (lightboxLabel) lightboxLabel.textContent = label?.textContent || "";
  if (lightboxTitle) lightboxTitle.textContent = title?.textContent || "";
}

function openLightbox(index) {
  if (!lightbox) return;
  noteIndex = index;
  updateLightbox();
  document.body.classList.add("lightbox-open");
  lightbox.showModal();
}

function closeLightbox() {
  if (!lightbox?.open) return;
  lightbox.close();
  document.body.classList.remove("lightbox-open");
}

function moveLightbox(direction) {
  noteIndex = (noteIndex + direction + notes.length) % notes.length;
  updateLightbox();
}

notes.forEach((note, index) => note.addEventListener("click", () => openLightbox(index)));
document.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
document.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => moveLightbox(-1));
document.querySelector("[data-lightbox-next]")?.addEventListener("click", () => moveLightbox(1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox?.addEventListener("close", () => document.body.classList.remove("lightbox-open"));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
    closeLightbox();
  }
  if (!lightbox?.open) return;
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});
