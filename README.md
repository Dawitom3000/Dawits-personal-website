# Personal Portfolio Website

A premium, futuristic, single-page personal portfolio built with:

- HTML
- Tailwind CSS via CDN
- Vanilla JavaScript

## Features

- Fully responsive layout
- Dark premium visual style with gradients and glassmorphism
- Animated hero with typing effect
- Sticky blurred navigation
- Project cards with category filters
- Scroll reveal animations
- Animated skill bars
- Timeline section
- Testimonial cards
- Modern contact form UI
- Loading screen
- Smooth scrolling and light parallax behavior

## Folder Structure

```text
.
├── index.html
├── README.md
├── assets
│   ├── Dawit-A-Feleke-Portfolio.pdf
│   ├── images
│   │   ├── *.jpg / *.jpeg / *.png
│   └── js
│       └── main.js
└── previews
```

## How To Run Locally

This project is static, so you can run it in any of these simple ways:

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Use a local server

If you want a cleaner local development workflow:

```bash
cd "/Users/Apple/Desktop/web development"
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Easy Content Replacements

Update these areas first:

- `index.html`
  - Hero title
  - About Me bio
  - Project descriptions and links
  - Experience timeline entries
  - Testimonials
  - Contact details and social links

- `assets/images`
  - Replace images with your final portfolio photos

- `assets/js/main.js`
  - Edit typing effect text
  - Adjust filters and animation behavior if needed

## Notes

- Tailwind is loaded through the CDN, so internet access is needed for the stylesheet/script to load in the browser.
- The contact form is currently a front-end placeholder and does not submit anywhere yet.
- Project links are placeholder `#` links and should be replaced with real URLs or case study pages.
