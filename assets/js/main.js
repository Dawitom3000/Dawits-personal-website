document.documentElement.classList.add("js");

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");
const progressBar = document.getElementById("page-progress-bar");
const year = document.getElementById("year");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

function closeNavigation() {
  if (!navToggle || !navLinks) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  navLinks.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(willOpen));
    navToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
    navLinks.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("nav-open", willOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
  }
});

const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8%" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const countItems = document.querySelectorAll("[data-count]");

function setCounterFinalValue(item) {
  const prefix = item.dataset.prefix || "";
  const suffix = item.dataset.suffix || "";
  item.textContent = `${prefix}${item.dataset.count}${suffix}`;
}

function animateCounter(item) {
  const target = Number(item.dataset.count);
  const prefix = item.dataset.prefix || "";
  const suffix = item.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    item.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

if (reducedMotion || !("IntersectionObserver" in window)) {
  countItems.forEach(setCounterFinalValue);
} else {
  countItems.forEach((item) => {
    const prefix = item.dataset.prefix || "";
    const suffix = item.dataset.suffix || "";
    item.textContent = `${prefix}0${suffix}`;
  });

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  countItems.forEach((item) => counterObserver.observe(item));
}

const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const observedSections = Array.from(sectionLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleEntry) return;

      sectionLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${visibleEntry.target.id}`
        );
      });
    },
    { threshold: [0.15, 0.35, 0.6], rootMargin: "-20% 0px -55%" }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

const experienceChapters = document.querySelectorAll("[data-role-chapter]");
const experienceLinks = document.querySelectorAll("[data-role-link]");

function activateExperience(id) {
  experienceChapters.forEach((chapter) => {
    chapter.classList.toggle("is-active", chapter.id === id);
  });

  experienceLinks.forEach((link) => {
    const active = link.dataset.roleLink === id;
    link.classList.toggle("is-active", active);
    if (active) {
      link.setAttribute("aria-current", "true");
      const rail = link.closest(".experience-rail");
      if (rail && rail.scrollWidth > rail.clientWidth) {
        const targetLeft = link.offsetLeft - (rail.clientWidth - link.offsetWidth) / 2;
        rail.scrollTo({ left: targetLeft, behavior: reducedMotion ? "auto" : "smooth" });
      }
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if (experienceChapters.length) {
  activateExperience(experienceChapters[0].id);
}

if ("IntersectionObserver" in window && experienceChapters.length) {
  const experienceObserver = new IntersectionObserver(
    (entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (activeEntry) {
        activateExperience(activeEntry.target.id);
      }
    },
    { threshold: [0.12, 0.25, 0.45], rootMargin: "-25% 0px -45%" }
  );

  experienceChapters.forEach((chapter) => experienceObserver.observe(chapter));
}

experienceLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const id = link.dataset.roleLink;
    if (id) activateExperience(id);
  });
});

const parallaxImages = document.querySelectorAll("[data-parallax]");
let scrollFrameRequested = false;

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? scrollTop / scrollable : 0;

  if (progressBar) {
    progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  }

  if (siteHeader) {
    siteHeader.classList.toggle("is-scrolled", scrollTop > 180);
  }

  if (!reducedMotion) {
    parallaxImages.forEach((image) => {
      const rect = image.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift = Math.max(-28, Math.min(28, centerOffset * -0.045));
      image.style.setProperty("--parallax-y", `${shift}px`);
    });
  }

  scrollFrameRequested = false;
}

function requestScrollUpdate() {
  if (scrollFrameRequested) return;
  scrollFrameRequested = true;
  requestAnimationFrame(updateScrollEffects);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
updateScrollEffects();

const galleryTrack = document.getElementById("gallery-track");
const galleryPrevious = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
const galleryItems = Array.from(document.querySelectorAll("[data-gallery-item]"));

function galleryStep() {
  if (!galleryTrack) return 360;
  return Math.min(galleryTrack.clientWidth * 0.72, 620);
}

galleryPrevious?.addEventListener("click", () => {
  galleryTrack?.scrollBy({ left: -galleryStep(), behavior: reducedMotion ? "auto" : "smooth" });
});

galleryNext?.addEventListener("click", () => {
  galleryTrack?.scrollBy({ left: galleryStep(), behavior: reducedMotion ? "auto" : "smooth" });
});

if (galleryTrack) {
  let dragging = false;
  let moved = false;
  let dragStartX = 0;
  let dragStartScroll = 0;

  galleryTrack.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    dragging = true;
    moved = false;
    dragStartX = event.clientX;
    dragStartScroll = galleryTrack.scrollLeft;
    galleryTrack.classList.add("is-dragging");
    galleryTrack.setPointerCapture(event.pointerId);
  });

  galleryTrack.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const delta = event.clientX - dragStartX;
    if (Math.abs(delta) > 5) moved = true;
    galleryTrack.scrollLeft = dragStartScroll - delta;
  });

  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    galleryTrack.classList.remove("is-dragging");
    if (galleryTrack.hasPointerCapture(event.pointerId)) {
      galleryTrack.releasePointerCapture(event.pointerId);
    }
    window.setTimeout(() => {
      moved = false;
    }, 0);
  }

  galleryTrack.addEventListener("pointerup", endDrag);
  galleryTrack.addEventListener("pointercancel", endDrag);

  galleryTrack.addEventListener("click", (event) => {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

const lightbox = document.getElementById("gallery-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrevious = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
let lightboxIndex = 0;

function updateLightbox() {
  const item = galleryItems[lightboxIndex];
  if (!item || !lightboxImage || !lightboxTitle || !lightboxCaption) return;

  const sourceImage = item.querySelector("img");
  lightboxImage.src = item.dataset.full || sourceImage?.src || "";
  lightboxImage.alt = sourceImage?.alt || item.dataset.title || "";
  lightboxTitle.textContent = item.dataset.title || "";
  lightboxCaption.textContent = item.dataset.caption || "";
}

function openLightbox(index) {
  if (!lightbox || !galleryItems[index]) return;
  lightboxIndex = index;
  updateLightbox();
  document.body.classList.add("lightbox-open");

  if (typeof lightbox.showModal === "function") {
    lightbox.showModal();
  } else {
    lightbox.setAttribute("open", "");
  }
}

function closeLightbox() {
  if (!lightbox) return;
  document.body.classList.remove("lightbox-open");

  if (typeof lightbox.close === "function" && lightbox.open) {
    lightbox.close();
  } else {
    lightbox.removeAttribute("open");
  }
}

function moveLightbox(direction) {
  if (!galleryItems.length) return;
  lightboxIndex = (lightboxIndex + direction + galleryItems.length) % galleryItems.length;
  updateLightbox();
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrevious?.addEventListener("click", () => moveLightbox(-1));
lightboxNext?.addEventListener("click", () => moveLightbox(1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox?.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.open) return;
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});
