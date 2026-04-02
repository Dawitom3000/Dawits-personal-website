const loader = document.getElementById("loader");
const typingText = document.getElementById("typing-text");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll(".parallax");
const skillBars = document.querySelectorAll(".skill-bar");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

const rotatingTitles = [
  "project manager",
  "entrepreneur",
  "strategic operator",
  "systems builder",
  "problem solver"
];

let currentTitle = 0;
let currentChar = 0;
let deleting = false;

function typeLoop() {
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

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("opacity-0", "pointer-events-none");
  }, 450);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px"
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 50, 300)}ms`;
  revealObserver.observe(item);
});

const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      skillBars.forEach((bar) => {
        bar.style.width = `${bar.dataset.width}%`;
      });

      skillsObserver.disconnect();
    });
  },
  { threshold: 0.25 }
);

skillBars.forEach((bar) => {
  bar.style.width = "0%";
  bar.style.transition = "width 1200ms cubic-bezier(0.22, 1, 0.36, 1)";
});

const skillsSection = document.getElementById("skills");
if (skillsSection) {
  skillsObserver.observe(skillsSection);
}

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0.08);
    item.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => {
      btn.className =
        "filter-btn rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70";
    });

    button.className =
      "filter-btn rounded-full border border-cyan/40 bg-cyan/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan";

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const matches = filter === "all" || filter === category;

      card.style.display = matches ? "block" : "none";
    });
  });
});

document.querySelector("form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  alert("This contact form is currently a front-end placeholder. I can connect it to email delivery if you want.");
});

typeLoop();
