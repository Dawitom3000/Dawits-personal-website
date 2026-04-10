/* ======================================================
   Magnetto-Style Portfolio — Main JS
   ====================================================== */

// DOM References
const loader = document.getElementById("loader");
const typingText = document.getElementById("typing-text");
const revealItems = document.querySelectorAll(".reveal");
const skillBars = document.querySelectorAll(".skill-fill");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
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
