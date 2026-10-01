# Dawit Feleke — Personal Portfolio

The source for [dawitfeleke.com](https://dawitfeleke.com), an editorial portfolio spanning product marketing, technical project delivery, web development, and media production.

## Architecture

- `/` — focused introduction, proof points, selected work, and recent experience
- `/work/` — filterable archive of all projects
- `/work/[slug]/` — individual case studies with challenge, role, process, execution, and results
- `/about/` — biography, working principles, capabilities, and complete experience
- `/notes/` — visual field notes with an accessible lightbox
- `/contact/` — direct contact and professional links

The site is intentionally framework-free. Structured content lives in `assets/data/content.mjs`; `scripts/build.mjs` renders the static HTML files. Styling and browser behavior live in `style.css` and `assets/js/main.js`.

The visual system uses a light neutral palette, DM Sans typography, a rounded portrait, large project images, and compact navigation. Homepage capabilities expand through native HTML details controls. All case studies, the full experience, photographs, and downloadable documents remain available through the dedicated pages.

## Develop locally

Node.js 20 or newer is recommended.

```bash
node scripts/build.mjs
node scripts/check.mjs
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publishing

GitHub Pages serves the `gh-pages` branch through the custom domain in `CNAME`. Rebuild and run the checks before publishing generated pages.

## Quality checks

`scripts/check.mjs` validates every generated page for required metadata and landmarks, duplicate IDs, and broken local links or assets. The interface also includes visible keyboard focus, reduced-motion support, responsive layouts, semantic landmarks, descriptive image text, canonical URLs, Open Graph metadata, structured data, a sitemap, and robots instructions.
