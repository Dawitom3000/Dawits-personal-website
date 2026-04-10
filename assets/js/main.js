/* ======================================================
   Magnetto-Style Portfolio — Main JS
   ====================================================== */

// DOM References
const loader = document.getElementById("loader");
const typingText = document.getElementById("typing-text");
const revealItems = document.querySelectorAll(".reveal");
const skillBars = document.querySelectorAll(".skill-fill");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-showcase");
const skillsSection = document.getElementById("skills");
const dockLinks = document.querySelectorAll(".dock-link");
const dockMenuToggle = document.getElementById("dock-menu-toggle");
const dockLinksContainer = document.getElementById("dock-links");

// Typing animation titles
const rotatingTitles = [
  "project manager",
  "entrepreneur",
  "creative strategist",
  "systems builder",
  "problem solver"
];

let currentTitle = 0;
let currentChar = 0;
let deleting = false;

// ---------- Typing Animation ----------
function typeLoop() {
  if (!typingText) return;

  const phrase = rotatingTitles[currentTitle];

  if (!deleting) {
    currentChar += 1;
    typingText.textContent = phrase.slice(0, currentChar);

    if (currentChar === phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    currentChar -= 1;
    typingText.textContent = phrase.slice(0, currentChar);

    if (currentChar === 0) {
      deleting = false;
      currentTitle = (currentTitle + 1) % rotatingTitles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 45 : 85);
}

// ---------- Loader ----------
window.addEventListener("load", () => {
  setTimeout(() => {
    if (loader) loader.classList.add("hidden");
  }, 600);

  if (typingText) typeLoop();

  // Initialize sliders after page load
  initSliders();
});

// ---------- Reveal on Scroll ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.08,
    rootMargin: "0px 0px -20px 0px"
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 30, 250)}ms`;
  revealObserver.observe(item);
});

// ---------- Skill Bars Animation ----------
const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      skillBars.forEach((bar) => {
        bar.style.width = `${bar.dataset.width}%`;
      });

      skillsObserver.disconnect();
    });
  },
  { threshold: 0.3 }
);

skillBars.forEach((bar) => {
  bar.style.width = "0%";
  bar.style.transition = "width 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
});

if (skillsSection) {
  skillsObserver.observe(skillsSection);
}

// ---------- Project Filters ----------
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn === button);
    });

    projectCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.style.display = matches ? "" : "none";
    });
  });
});

// ---------- Bottom Dock: Active Link Tracking ----------
const sections = document.querySelectorAll("section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;
      dockLinks.forEach((link) => {
        const href = link.getAttribute("href").replace("#", "");
        link.classList.toggle("active", href === id);
      });
    });
  },
  {
    threshold: 0.3,
    rootMargin: "-10% 0px -40% 0px"
  }
);

sections.forEach((section) => sectionObserver.observe(section));

// ---------- Mobile Menu Toggle ----------
if (dockMenuToggle && dockLinksContainer) {
  dockMenuToggle.addEventListener("click", () => {
    const isOpen = dockLinksContainer.classList.contains("open");
    dockLinksContainer.classList.toggle("open");
    dockMenuToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  // Close menu on link click
  dockLinksContainer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      dockLinksContainer.classList.remove("open");
      dockMenuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Contact Form AJAX ----------
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formStatus.textContent = "";

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        formStatus.textContent = "Message sent successfully! I'll get back to you soon.";
        formStatus.style.color = "#34d399";
        contactForm.reset();
      } else {
        formStatus.textContent = result.message || "Something went wrong. Please try again.";
        formStatus.style.color = "#f87171";
      }
    } catch (error) {
      formStatus.textContent = "Network error. Please check your connection and try again.";
      formStatus.style.color = "#f87171";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message →";
    }
  });
}

// ---------- Smooth Scroll for Dock Links ----------
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ---------- Image Slider System ----------
function initSliders() {
  document.querySelectorAll(".project-slider").forEach((slider) => {
    const track = slider.querySelector(".slider-track");
    const slides = slider.querySelectorAll(".slider-slide");
    const prevBtn = slider.querySelector(".slider-prev");
    const nextBtn = slider.querySelector(".slider-next");
    const dotsContainer = slider.querySelector(".slider-dots");
    const counterCurrent = slider.querySelector(".slider-current");
    const counterTotal = slider.querySelector(".slider-total");
    const progressBar = slider.querySelector(".slider-progress-bar");

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let isHovered = false;
    let isVisible = false;
    let autoplayQueue = [];
    let wheelLock = false;

    // Set total count
    if (counterTotal) counterTotal.textContent = totalSlides;

    // Create dots
    if (dotsContainer) {
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("button");
        dot.classList.add("slider-dot");
        if (i === 0) dot.classList.add("active");
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.addEventListener("click", () => goToSlide(i, { restartAutoPlay: !isHovered, rebuildQueue: true }));
        dotsContainer.appendChild(dot);
      }
    }

    function shuffleArray(values) {
      const result = [...values];
      for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }

    function rebuildAutoplayQueue() {
      autoplayQueue = shuffleArray(
        Array.from({ length: totalSlides }, (_, i) => i).filter((index) => index !== currentSlide)
      );
    }

    function goToSlide(index, { restartAutoPlay = false, rebuildQueue = false } = {}) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;

      currentSlide = index;
      track.style.transform = `translateX(-${currentSlide * 100}%)`;

      // Update counter
      if (counterCurrent) counterCurrent.textContent = currentSlide + 1;

      // Update dots
      if (dotsContainer) {
        dotsContainer.querySelectorAll(".slider-dot").forEach((dot, i) => {
          dot.classList.toggle("active", i === currentSlide);
        });
      }

      // Update progress bar
      if (progressBar) {
        const progress = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
      }

      if (rebuildQueue) {
        rebuildAutoplayQueue();
      }

      if (restartAutoPlay) {
        resetAutoPlay();
      }
    }

    function nextSlide(options) {
      goToSlide(currentSlide + 1, options);
    }

    function prevSlide(options) {
      goToSlide(currentSlide - 1, options);
    }

    // Navigation buttons
    if (prevBtn) prevBtn.addEventListener("click", () => prevSlide({ restartAutoPlay: !isHovered, rebuildQueue: true }));
    if (nextBtn) nextBtn.addEventListener("click", () => nextSlide({ restartAutoPlay: !isHovered, rebuildQueue: true }));

    // Keyboard navigation
    slider.setAttribute("tabindex", "0");
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide({ restartAutoPlay: !isHovered, rebuildQueue: true });
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide({ restartAutoPlay: !isHovered, rebuildQueue: true });
      }
    });

    // Touch/swipe support
    const viewport = slider.querySelector(".slider-viewport") || slider;

    viewport.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isDragging = true;
      pauseAutoPlay();
    }, { passive: true });

    viewport.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      touchEndX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;

      const swipeDistance = touchStartX - touchEndX;
      const minSwipeDistance = 50;

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          nextSlide({ restartAutoPlay: !isHovered, rebuildQueue: true });
        } else {
          prevSlide({ restartAutoPlay: !isHovered, rebuildQueue: true });
        }
      }

      resetAutoPlay();
    });

    // Mouse drag support
    let mouseStartX = 0;
    let isMouseDragging = false;

    viewport.addEventListener("mousedown", (e) => {
      mouseStartX = e.clientX;
      isMouseDragging = true;
      viewport.style.cursor = "grabbing";
      pauseAutoPlay();
    });

    viewport.addEventListener("mousemove", (e) => {
      if (!isMouseDragging) return;
      e.preventDefault();
    });

    viewport.addEventListener("mouseup", (e) => {
      if (!isMouseDragging) return;
      isMouseDragging = false;
      viewport.style.cursor = "";

      const swipeDistance = mouseStartX - e.clientX;
      const minSwipeDistance = 50;

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          nextSlide({ restartAutoPlay: !isHovered, rebuildQueue: true });
        } else {
          prevSlide({ restartAutoPlay: !isHovered, rebuildQueue: true });
        }
      }

      resetAutoPlay();
    });

    viewport.addEventListener("mouseleave", () => {
      isMouseDragging = false;
      viewport.style.cursor = "";
    });

    viewport.addEventListener("wheel", (e) => {
      if (totalSlides <= 1) return;

      const dominantDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(dominantDelta) < 18 || wheelLock) return;

      e.preventDefault();
      pauseAutoPlay();
      wheelLock = true;

      if (dominantDelta > 0) {
        nextSlide({ rebuildQueue: true });
      } else {
        prevSlide({ rebuildQueue: true });
      }

      window.setTimeout(() => {
        wheelLock = false;
      }, 450);
    }, { passive: false });

    // Auto-play
    function startAutoPlay() {
      if (autoPlayTimer || totalSlides <= 1 || isHovered || !isVisible) return;
      if (!autoplayQueue.length) {
        rebuildAutoplayQueue();
      }

      autoPlayTimer = setInterval(() => {
        if (!autoplayQueue.length) {
          rebuildAutoplayQueue();
        }

        const nextIndex = autoplayQueue.shift();
        if (typeof nextIndex === "number") {
          goToSlide(nextIndex);
        }
      }, 5000);
    }

    function pauseAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function resetAutoPlay() {
      pauseAutoPlay();
      startAutoPlay();
    }

    goToSlide(0, { rebuildQueue: true });

    // Pause on hover
    slider.addEventListener("mouseenter", () => {
      isHovered = true;
      pauseAutoPlay();
    });
    slider.addEventListener("mouseleave", () => {
      isHovered = false;
      if (!isMouseDragging) startAutoPlay();
    });

    // Start auto-play with IntersectionObserver (only when visible)
    const sliderObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            startAutoPlay();
          } else {
            pauseAutoPlay();
          }
        });
      },
      { threshold: 0.3 }
    );

    sliderObserver.observe(slider);
  });
}
