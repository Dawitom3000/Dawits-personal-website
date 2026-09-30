import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../assets/data/content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pages = [
  "index.html",
  "work/index.html",
  ...projects.map((project) => `work/${project.slug}/index.html`),
  "about/index.html",
  "notes/index.html",
  "contact/index.html",
  "404.html"
];
const errors = [];

for (const page of pages) {
  const source = await readFile(join(root, page), "utf8");
  for (const required of ["<title>", 'name="description"', 'rel="canonical"', '<main id="main">', 'aria-label="Primary navigation"']) {
    if (!source.includes(required)) errors.push(`${page}: missing ${required}`);
  }

  const localLinks = [...source.matchAll(/(?:href|src)="(\/[^"]+)"/g)].map((match) => match[1]);
  for (const localLink of localLinks) {
    if (localLink.startsWith("//") || localLink.includes("#")) continue;
    const clean = localLink.split("?")[0];
    const target = clean.endsWith("/") ? join(root, clean, "index.html") : join(root, clean);
    try {
      await access(target);
    } catch {
      errors.push(`${page}: missing local target ${localLink}`);
    }
  }

  const ids = [...source.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) errors.push(`${page}: duplicate ids ${[...new Set(duplicates)].join(", ")}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} HTML pages: required metadata, landmarks, IDs, and local targets are valid.`);
}
