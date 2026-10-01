import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { capabilities, companies, experience, notes, projects, site } from "../assets/data/content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://dawitfeleke.com";

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

async function output(path, content) {
  const destination = join(root, path);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, content.trimStart().replace(/[ \t]+$/gm, ""), "utf8");
}

function icon(name) {
  const icons = {
    arrow: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 5l5 5-5 5"/></svg>',
    external: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M7 4h9v9M16 4 5 15"/></svg>',
    menu: '<span></span><span></span>',
    close: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15"/></svg>'
  };
  return icons[name] || "";
}

function head({ title, description, path = "/", image = "/assets/images/dawit-formal-portrait.jpg", type = "website" }) {
  const url = `${origin}${path}`;
  const absoluteImage = image.startsWith("http") ? image : `${origin}${image}`;
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: origin,
    image: `${origin}/assets/images/dawit-formal-portrait.jpg`,
    jobTitle: "Product Marketing Specialist and Technical Project Manager",
    address: { "@type": "PostalAddress", addressLocality: "Addis Ababa", addressCountry: "Ethiopia" },
    sameAs: [site.linkedin, site.github, site.instagram]
  };

  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#f3f4f1">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${absoluteImage}">
  <meta property="og:site_name" content="Dawit Feleke">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${absoluteImage}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css?v=20261001-compact-strip">
  <script type="application/ld+json">${JSON.stringify(person)}</script>`;
}

function header(active = "") {
  const nav = [
    ["Work", "/work/", "work"],
    ["About", "/about/", "about"],
    ["Notes", "/notes/", "notes"],
    ["Contact", "/contact/", "contact"]
  ];

  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <div class="shell header-inner">
      <a class="brand" href="/" aria-label="Dawit Feleke, home">
        <span><strong>Dawit Feleke</strong><small>Product × Technology × Stories</small></span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open navigation">${icon("menu")}</button>
      <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
        ${nav.map(([label, href, key]) => `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
        <a class="nav-cv" href="${site.cv}" target="_blank" rel="noopener">CV ${icon("external")}</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="site-footer">
    <div class="shell footer-grid">
      <div>
        <p class="footer-name">Dawit Feleke</p>
        <p class="footer-note">Building digital products, systems and stories from Addis Ababa.</p>
      </div>
      <div class="footer-links" aria-label="Contact and professional links">
        <a href="mailto:${site.email}">Email</a>
        <a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${site.github}" target="_blank" rel="noopener">GitHub</a>
        <a href="${site.cv}" target="_blank" rel="noopener">CV</a>
      </div>
      <p class="footer-meta">${site.location}<br>© <span data-year></span> Dawit Feleke</p>
    </div>
  </footer>`;
}

function layout({ title, description, path, active, content, image, type, bodyClass = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>${head({ title, description, path, image, type })}
</head>
<body class="${bodyClass}">
${header(active)}
<main id="main">${content}</main>
${footer()}
<script type="module" src="/assets/js/main.js?v=20261001-compact-strip"></script>
</body>
</html>`;
}

function sectionHead(kicker, title, intro = "", link = null) {
  return `<div class="section-head reveal">
    <div><p class="kicker">${escapeHtml(kicker)}</p><h2>${title}</h2></div>
    ${intro ? `<p>${escapeHtml(intro)}</p>` : ""}
    ${link ? `<a class="text-link" href="${link.href}">${escapeHtml(link.label)} ${icon("arrow")}</a>` : ""}
  </div>`;
}

function projectCard(project, variant = "standard") {
  const image = project.cover
    ? `<img src="${project.cover}" alt="${escapeHtml(project.coverAlt)}" loading="lazy" decoding="async">`
    : `<div class="type-cover"><span>Marketing</span><strong>Next<br>Level</strong></div>`;

  return `<article class="project-card project-card-${variant} reveal" data-project data-category="${project.tags.map((tag) => tag.toLowerCase()).join(" ")}">
    <a href="/work/${project.slug}/" aria-label="View ${escapeHtml(project.title)} case study">
      <div class="project-media">${image}<span class="project-index">${String(projects.indexOf(project) + 1).padStart(2, "0")}</span></div>
      <div class="project-card-copy">
        <p>${escapeHtml(project.eyebrow)} <span>${escapeHtml(project.year)}</span></p>
        <h3>${escapeHtml(project.title)}</h3>
        <p class="project-summary">${escapeHtml(project.summary)}</p>
        <span class="project-outcome">${escapeHtml(project.outcome)}</span>
        <span class="card-action">View case study ${icon("arrow")}</span>
      </div>
    </a>
  </article>`;
}

function contactCta() {
  return `<section class="contact-cta">
    <div class="shell contact-cta-inner reveal">
      <p class="kicker"><span class="status-dot" aria-hidden="true"></span> Open to the next good idea</p>
      <h2>Let's make<br>something happen.</h2>
      <a class="button button-dark" href="mailto:${site.email}">Get in touch ${icon("external")}</a>
    </div>
  </section>`;
}

function companyStrip() {
  return `<section class="company-strip" aria-labelledby="company-heading" data-company-strip>
    <div class="shell">
      <div class="company-heading">
        <h2 id="company-heading">Companies & organizations I've worked with</h2>
      </div>
      <div class="company-viewport" id="company-logos" tabindex="0" role="region" aria-label="Companies and organizations; scroll horizontally to explore">
        <div class="company-track">
          <ul class="company-list">${companies.map((company) => `<li class="company-item${company.logo ? "" : " company-item-text"}" aria-label="${escapeHtml(company.name)}">
            ${company.logo
              ? `<img class="company-logo${company.wide ? " company-logo-wide" : ""}" src="${company.logo}" width="140" height="48" alt="" decoding="async"><span>${escapeHtml(company.display || company.name)}${company.detail ? `<small>${escapeHtml(company.detail)}</small>` : ""}</span>`
              : `<strong>${escapeHtml(company.display)}</strong><span>${escapeHtml(company.detail)}</span>`}
          </li>`).join("")}</ul>
        </div>
      </div>
    </div>
  </section>`;
}

function homePage() {
  const featured = projects.filter((project) => project.featured).sort((a, b) => a.featureRank - b.featureRank);
  const selectedExperience = experience.slice(0, 3);

  const content = `
  <section class="home-hero">
    <div class="shell hero-stage">
      <p class="hero-location"><span class="status-dot" aria-hidden="true"></span> Based in Addis Ababa</p>
      <figure class="hero-portrait reveal">
        <picture>
          <source media="(max-width: 720px)" srcset="/assets/images/dawit-portrait-560.jpg">
          <img src="/assets/images/dawit-portrait-960.jpg" width="960" height="1199" alt="Formal portrait of Dawit Feleke" fetchpriority="high">
        </picture>
      </figure>
      <div class="hero-copy reveal"><p class="kicker">Hello, I'm</p><h1>Dawit Feleke.</h1></div>
      <a class="hero-contact" href="/contact/">Let's talk ${icon("external")}</a>
    </div>
    <div class="shell hero-bottom">
      <a class="hero-intro" href="#selected-work"><span class="scroll-cue" aria-hidden="true">↓</span><span>I build and deliver digital products, systems and stories.<small>Explore selected work</small></span></a>
      <div class="metrics-row" aria-label="Selected career outcomes">
        <div><strong>2,000+</strong><span>students reached</span></div>
        <div><strong>30+</strong><span>countries</span></div>
        <div><strong>4+ yrs</strong><span>across disciplines</span></div>
      </div>
    </div>
  </section>

  ${companyStrip()}

  <section class="section selected-work" id="selected-work">
    <div class="shell">
      ${sectionHead("/ selected work", "Ideas brought to life.", "A few projects across technology, marketing and media.", { label: "All 10 projects", href: "/work/" })}
      <div class="featured-grid">
        ${featured.map((project, index) => projectCard(project, index === 0 ? "feature" : index === 1 || index === 2 ? "wide" : "standard")).join("")}
      </div>
    </div>
  </section>

  <section class="section home-about">
    <div class="shell split-intro reveal">
      <p class="kicker">/ about</p>
      <div>
        <h2>I connect the idea,<br>the people and the delivery.</h2>
        <p>From building education platforms to leading marketing teams and filming documentaries, I help turn a shared idea into something people can use, understand or experience.</p>
        <a class="text-link" href="/about/">More about me ${icon("arrow")}</a>
      </div>
    </div>
  </section>

  <section class="section capabilities-preview">
    <div class="shell">
      ${sectionHead("/ what I bring", "Different skills. Shared purpose.")}
      <div class="dial-grid">
        ${capabilities.map((item) => `<details class="capability-dial"><summary><span class="dial-disc" aria-hidden="true"><span>${item.number}</span></span><span class="dial-title">${item.title}</span><span class="dial-cue">Explore <span aria-hidden="true">+</span></span></summary><div class="dial-content"><p>${item.copy}</p><ul>${item.items.slice(0, 3).map((entry) => `<li>${entry}</li>`).join("")}</ul></div></details>`).join("")}
      </div>
    </div>
  </section>

  <section class="section experience-preview">
    <div class="shell">
      ${sectionHead("/ experience", "Where I've been.", "", { label: "Full experience", href: "/about/#experience" })}
      <div class="experience-list">
        ${selectedExperience.map((item) => `<article class="experience-row reveal"><time>${item.period}</time><div><h3>${item.company}</h3><p>${item.role}</p></div></article>`).join("")}
      </div>
    </div>
  </section>

  <section class="section notes-preview">
    <div class="shell">
      ${sectionHead("/ field notes", "Away from the desk.", "People, places and moments from the work.", { label: "View all photos", href: "/notes/" })}
      <div class="notes-strip">
        ${notes.slice(0, 4).map((note, index) => `<a class="note-preview-link" href="/notes/" aria-label="See ${escapeHtml(note.title)} in field notes"><figure class="note-tile reveal note-tile-${index + 1}"><img src="${note.src}" alt="${escapeHtml(note.alt)}" loading="lazy" decoding="async"><figcaption><span>${note.label}</span><strong>${note.title}</strong></figcaption></figure></a>`).join("")}
      </div>
    </div>
  </section>
  ${contactCta()}`;

  return layout({
    title: "Dawit Feleke | Product, Technology & Delivery",
    description: "Dawit Feleke builds and delivers digital products, systems and stories across product marketing, technical project management and web development.",
    path: "/",
    content,
    bodyClass: "home-page"
  });
}

function workPage() {
  const filters = ["All", "Technology", "Product", "Marketing", "Media"];
  const content = `
  <section class="page-hero page-hero-work">
    <div class="shell page-hero-grid reveal">
      <p class="kicker light">Work archive</p>
      <h1>The work.</h1>
      <p>Products, systems, campaigns and stories. Pick an area to explore, or browse the full collection.</p>
    </div>
  </section>
  <section class="section work-archive">
    <div class="shell">
      <div class="filter-bar reveal" role="toolbar" aria-label="Filter projects">
        ${filters.map((filter, index) => `<button type="button" data-filter="${filter.toLowerCase()}"${index === 0 ? ' class="is-active" aria-pressed="true"' : ' aria-pressed="false"'}>${filter}</button>`).join("")}
      </div>
      <div class="archive-grid" aria-live="polite">
        ${projects.map((project, index) => projectCard(project, index % 5 === 0 ? "wide" : "standard")).join("")}
      </div>
      <p class="empty-filter" data-empty-filter hidden>No projects match this filter.</p>
    </div>
  </section>
  ${contactCta()}`;
  return layout({
    title: "Work | Dawit Feleke",
    description: "Explore Dawit Feleke's work across technology, product delivery, marketing, web development and media production.",
    path: "/work/",
    active: "work",
    content,
    image: "/assets/images/project-screenshots/future-quest-homepage.jpg"
  });
}

function projectPage(project, index) {
  const next = projects[(index + 1) % projects.length];
  const cover = project.cover
    ? `<img src="${project.cover}" alt="${escapeHtml(project.coverAlt)}" width="1600" height="1000" fetchpriority="high">`
    : `<div class="case-type-cover"><span>Marketing leadership</span><strong>Next Level</strong><small>Communication · web presence · stakeholder alignment</small></div>`;
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    creator: { "@type": "Person", name: site.name, url: origin },
    dateCreated: project.year,
    url: `${origin}/work/${project.slug}/`
  };

  const content = `
  <article class="case-study">
    <header class="case-header">
      <div class="shell case-header-grid reveal">
        <div>
          <a class="back-link" href="/work/">Work archive /</a>
          <p class="kicker light">${escapeHtml(project.eyebrow)}</p>
          <h1>${escapeHtml(project.title)}</h1>
          <p class="case-lead">${escapeHtml(project.summary)}</p>
        </div>
        <dl class="project-meta">
          <div><dt>Role</dt><dd>${escapeHtml(project.role)}</dd></div>
          <div><dt>Period</dt><dd>${escapeHtml(project.period)}</dd></div>
          <div><dt>Organization</dt><dd>${escapeHtml(project.organization)}</dd></div>
          <div><dt>Areas</dt><dd>${project.tags.map(escapeHtml).join(" · ")}</dd></div>
        </dl>
      </div>
    </header>
    <div class="shell case-hero reveal">${cover}</div>

    <section class="case-section">
      <div class="shell case-copy-grid reveal">
        <p class="kicker">01 · Challenge</p>
        <div class="long-copy">${project.challenge.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div>
      </div>
    </section>

    <section class="case-section case-section-tint">
      <div class="shell case-copy-grid reveal">
        <p class="kicker">02 · My role</p>
        <div>
          <p class="role-statement">${escapeHtml(project.roleCopy)}</p>
          <ul class="responsibility-list">${project.responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </div>
      </div>
    </section>

    <section class="case-section">
      <div class="shell">
        ${sectionHead("03 · Process", "Make the work <em>visible.</em>")}
        <div class="process-grid">
          ${project.process.map((step, stepIndex) => `<article class="process-step reveal"><span>0${stepIndex + 1}</span><h3>${escapeHtml(step.label)}</h3><p>${escapeHtml(step.text)}</p></article>`).join("")}
        </div>
      </div>
    </section>

    <section class="case-section solution-section">
      <div class="shell case-copy-grid reveal">
        <p class="kicker light">04 · Execution</p>
        <p class="solution-copy">${escapeHtml(project.solution)}</p>
      </div>
    </section>

    <section class="case-section results-section">
      <div class="shell">
        ${sectionHead("05 · Results", "The outcome.")}
        <div class="results-grid">
          ${project.results.map((result) => `<div class="result reveal"><strong>${escapeHtml(result.value)}</strong><span>${escapeHtml(result.label)}</span></div>`).join("")}
        </div>
      </div>
    </section>

    ${project.gallery.length ? `<section class="case-gallery shell" aria-label="Project gallery">${project.gallery.map((image, imageIndex) => `<figure class="reveal gallery-${(imageIndex % 3) + 1}"><img src="${image.src}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async"></figure>`).join("")}</section>` : ""}

    <section class="case-section case-details">
      <div class="shell details-grid reveal">
        <div><p class="kicker">Tools & methods</p><ul class="tool-list">${project.tools.map((tool) => `<li>${escapeHtml(tool)}</li>`).join("")}</ul></div>
        ${project.links.length ? `<div><p class="kicker">Related links</p><div class="related-links">${project.links.map((link) => `<a href="${link.url}" target="_blank" rel="noopener">${escapeHtml(link.label)} ${icon("external")}</a>`).join("")}</div></div>` : ""}
      </div>
    </section>

    <a class="next-project" href="/work/${next.slug}/">
      <span class="shell"><small>Next project</small><strong>${escapeHtml(next.title)}</strong>${icon("arrow")}</span>
    </a>
  </article>
  <script type="application/ld+json">${JSON.stringify(projectSchema)}</script>`;

  return layout({
    title: `${project.title} | Work by Dawit Feleke`,
    description: project.summary,
    path: `/work/${project.slug}/`,
    active: "work",
    content,
    image: project.cover || "/assets/images/dawit-formal-portrait.jpg",
    type: "article",
    bodyClass: "case-page"
  });
}

function aboutPage() {
  const content = `
  <section class="page-hero about-hero">
    <div class="shell about-hero-grid reveal">
      <div>
        <p class="kicker light">About Dawit</p>
        <h1>Built through <em>ownership.</em></h1>
        <p class="page-lead">I work across technology, product marketing, and delivery—turning ideas into digital products, systems, campaigns, and stories.</p>
      </div>
      <figure><img src="/assets/images/dawit-formal-portrait.jpg" alt="Formal portrait of Dawit Feleke" width="1122" height="1402" fetchpriority="high"></figure>
    </div>
  </section>

  <section class="section biography-section">
    <div class="shell case-copy-grid reveal">
      <p class="kicker">Profile</p>
      <div class="long-copy">
        <p>My work sits between technology, operations, communication, and creative production. I have led AI data operations, helped build and deploy business systems, launched digital products, built an education company, managed marketing teams, and produced original documentary work.</p>
        <p>The disciplines change, but the operating pattern stays consistent: understand the real problem, give the work structure, align the people involved, and own the last mile. That range helps me translate between technical and non-technical teams while keeping the outcome clear.</p>
        <p>I hold a Bachelor's degree in Marketing from Wyzsza Szkola Gospodarki in Bydgoszcz, Poland. I work in Amharic and English and am based in Addis Ababa.</p>
        <div class="inline-actions"><a class="button button-dark" href="${site.cv}" target="_blank" rel="noopener">View CV ${icon("external")}</a><a class="text-link" href="${site.portfolio}" target="_blank" rel="noopener">Portfolio PDF ${icon("external")}</a></div>
      </div>
    </div>
  </section>

  <section class="section philosophy-section">
    <div class="shell">
      ${sectionHead("How I work", "Clarity, visibility, <em>follow-through.</em>")}
      <div class="principle-grid">
        ${[
          ["01", "Start with clarity", "Translate an ambiguous brief into scope, owners, milestones, and a shared definition of done."],
          ["02", "Make work visible", "Use simple systems that surface progress, risk, decisions, and blockers early."],
          ["03", "Align the room", "Keep teams, clients, partners, and decision makers moving toward the same outcome."],
          ["04", "Own the last mile", "Stay with the work through execution, handoff, launch, and close."],
          ["05", "Adapt with control", "Respond to reality without losing the purpose or the delivery standard."]
        ].map(([number, title, copy]) => `<article class="principle reveal"><span>${number}</span><h3>${title}</h3><p>${copy}</p></article>`).join("")}
      </div>
    </div>
  </section>

  <section class="section full-experience" id="experience">
    <div class="shell">
      ${sectionHead("Experience", "A career across <em>disciplines.</em>", "Nine chapters connected by ownership, systems thinking, communication, and delivery.")}
      <div class="timeline">
        ${experience.map((item, index) => `<article class="timeline-row reveal"><span class="timeline-number">${String(index + 1).padStart(2, "0")}</span><time>${item.period}</time><div><h3>${item.role}</h3><p class="timeline-company">${item.company}</p><p>${item.summary}</p></div></article>`).join("")}
      </div>
    </div>
  </section>

  <section class="section about-capabilities">
    <div class="shell">
      ${sectionHead("Capabilities", "What I bring to the work.")}
      <div class="capability-grid detailed">
        ${capabilities.map((item) => `<article class="capability-card reveal"><span>${item.number}</span><h3>${item.title}</h3><p>${item.copy}</p><ul>${item.items.map((entry) => `<li>${entry}</li>`).join("")}</ul></article>`).join("")}
      </div>
      <div class="tool-stack reveal">
        <p class="kicker">Selected tools</p>
        <div><strong>Delivery</strong><span>Notion · Trello · Slack · Google Workspace</span></div>
        <div><strong>Development</strong><span>Next.js · React · TypeScript · Supabase</span></div>
        <div><strong>Marketing</strong><span>HubSpot · Content analytics · Campaign planning</span></div>
        <div><strong>Media</strong><span>Sony FX3 · DaVinci Resolve · Adobe tools</span></div>
      </div>
    </div>
  </section>
  ${contactCta()}`;

  return layout({
    title: "About | Dawit Feleke",
    description: "Dawit Feleke is a product marketing specialist, technical project manager and web developer working across technology, operations and media.",
    path: "/about/",
    active: "about",
    content,
    image: "/assets/images/dawit-formal-portrait.jpg"
  });
}

function notesPage() {
  const content = `
  <section class="page-hero notes-hero">
    <div class="shell page-hero-grid reveal">
      <p class="kicker light">Field notes</p>
      <h1>Observe first.<br><em>Then make the story.</em></h1>
      <p>Photography, production stills, travel, sport, and cultural moments collected across the work.</p>
    </div>
  </section>
  <section class="section notes-page-section">
    <div class="shell notes-grid">
      ${notes.map((note, index) => `<button class="note-card note-card-${(index % 5) + 1} reveal" type="button" data-note data-index="${index}"><img src="${note.src}" alt="${escapeHtml(note.alt)}" loading="lazy" decoding="async"><span><small>${note.label}</small><strong>${note.title}</strong></span></button>`).join("")}
    </div>
  </section>
  <dialog class="lightbox" data-lightbox aria-label="Expanded field note">
    <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close image">${icon("close")}</button>
    <button type="button" class="lightbox-nav lightbox-prev" data-lightbox-prev aria-label="Previous image">←</button>
    <figure><img src="${notes[0].src}" alt="${escapeHtml(notes[0].alt)}" loading="lazy" data-lightbox-image><figcaption><small data-lightbox-label></small><strong data-lightbox-title></strong></figcaption></figure>
    <button type="button" class="lightbox-nav lightbox-next" data-lightbox-next aria-label="Next image">→</button>
  </dialog>
  ${contactCta()}`;

  return layout({
    title: "Field Notes | Dawit Feleke",
    description: "Photography and production notes from Dawit Feleke's documentary, media, sport and international work.",
    path: "/notes/",
    active: "notes",
    content,
    image: "/assets/images/afar/afar-salt-1.jpg"
  });
}

function contactPage() {
  const content = `
  <section class="contact-page">
    <div class="shell contact-page-grid reveal">
      <div>
        <p class="kicker light">Contact</p>
        <h1>Let's talk.</h1>
        <p class="page-lead">I'm open to product marketing, technical project management, technology operations, web development, and selected media production work.</p>
      </div>
      <div class="contact-panel">
        <p>The fastest way to reach me is email. For professional context, you can also find my work history on LinkedIn or review the CV.</p>
        <a class="contact-primary" href="mailto:${site.email}"><span>Email</span><strong>${site.email}</strong>${icon("external")}</a>
        <a href="tel:${site.phoneHref}"><span>Phone</span><strong>${site.phoneDisplay}</strong></a>
        <a href="${site.linkedin}" target="_blank" rel="noopener"><span>LinkedIn</span><strong>Professional profile</strong>${icon("external")}</a>
        <a href="${site.github}" target="_blank" rel="noopener"><span>GitHub</span><strong>Dawitom3000</strong>${icon("external")}</a>
        <a href="${site.cv}" target="_blank" rel="noopener"><span>CV</span><strong>View PDF</strong>${icon("external")}</a>
        <p class="availability"><span aria-hidden="true"></span> Based in Addis Ababa · available for relevant conversations</p>
      </div>
    </div>
  </section>`;

  return layout({
    title: "Contact | Dawit Feleke",
    description: "Contact Dawit Feleke about product marketing, technical project management, technology delivery, web development or media production.",
    path: "/contact/",
    active: "contact",
    content,
    bodyClass: "contact-page-body"
  });
}

function notFoundPage() {
  return layout({
    title: "Page not found | Dawit Feleke",
    description: "The requested page could not be found.",
    path: "/404.html",
    content: `<section class="not-found"><div class="shell reveal"><p class="kicker light">404</p><h1>This page moved<br><em>somewhere else.</em></h1><p>Return to the work archive or start again from the homepage.</p><div class="hero-actions"><a class="button button-accent" href="/work/">View work ${icon("arrow")}</a><a class="button button-quiet" href="/">Go home</a></div></div></section>`,
    bodyClass: "contact-page-body"
  });
}

await output("index.html", homePage());
await output("work/index.html", workPage());
await Promise.all(projects.map((project, index) => output(`work/${project.slug}/index.html`, projectPage(project, index))));
await output("about/index.html", aboutPage());
await output("notes/index.html", notesPage());
await output("contact/index.html", contactPage());
await output("404.html", notFoundPage());

const routes = ["/", "/work/", ...projects.map((project) => `/work/${project.slug}/`), "/about/", "/notes/", "/contact/"];
await output("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${origin}${route}</loc></url>`).join("\n")}
</urlset>`);
await output("robots.txt", `User-agent: *
Allow: /
Sitemap: ${origin}/sitemap.xml`);

console.log(`Built ${routes.length} public routes plus 404.html.`);
