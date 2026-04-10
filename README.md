# Personal Portfolio Website

A modern editorial personal portfolio for Dawit A. Feleke, built with:

- HTML
- Tailwind CSS via CDN
- Vanilla JavaScript

## What Changed

- Light, premium editorial layout instead of a dark cyber style
- Large typography and spacious visual hierarchy
- More image-rich case studies across all categories
- Carlos Thornton documentary featured in a modal video viewer
- Headway Travel Firm represented with a custom HTF brand mark
- Smooth reveal animations, subtle parallax, and scroll progress
- Sticky glass navigation with a mobile menu
- Filterable project section
- Animated skill bars
- Modern contact form shell

## Folder Structure

```text
.
├── index.html
├── README.md
├── assets
│   ├── Dawit-A-Feleke-Portfolio.pdf
│   ├── images
│   │   ├── afar
│   │   ├── bana
│   │   ├── carlos
│   │   ├── community-outreach
│   │   └── headway
│   └── js
│       └── main.js
└── previews
```

## How To Run Locally

This is a static site, so you can open it in either of these ways:

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2: Use a local server

If you want a nicer local workflow:

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
  - Hero title and typing phrases
  - About section biography
  - Project descriptions and links
  - Experience timeline entries
  - Contact details and socials
  - LinkedIn URL placeholder block

- `assets/images`
  - Replace or add photos for any project case study
  - Add a different Headway brand visual if you want a new style

- `assets/js/main.js`
  - Adjust typing text
  - Change animation timing
  - Connect the contact form to email delivery if you change the provider
  - Update the Carlos documentary video URL if it changes

## Notes

- Tailwind is loaded through the CDN, so internet access is needed for the page styles to load in the browser.
- The contact form now uses Web3Forms. Replace `YOUR_ACCESS_KEY_HERE` in `index.html` with your real access key.
- The Carlos documentary opens in a modal using the Google Drive preview URL.
