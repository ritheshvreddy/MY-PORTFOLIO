/*
  Post-build SEO step (runs after `vite build`, see package.json).

  The site is a single-page app, so without this every URL would serve
  the same index.html: same <title>, same description, same share
  preview. Search engines and link previews (LinkedIn, WhatsApp, X,
  Slack...) mostly read the raw HTML without running JavaScript.

  This script writes one HTML file per page into dist/, each with its
  own title, description, canonical URL and Open Graph / Twitter tags:

    dist/about.html               -> served at /about
    dist/projects/<slug>.html     -> served at /projects/<slug>

  It also writes dist/sitemap.xml. Page titles and descriptions come
  from src/seo/site.json; project pages come from Supabase.
*/

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const DIST = "dist";
const site = JSON.parse(readFileSync("src/seo/site.json", "utf8"));
const template = readFileSync(join(DIST, "index.html"), "utf8");

/* ---------- helpers ---------- */

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeXml = escapeHtml;

const urlFor = (path) => site.siteUrl + (path === "/" ? "/" : path);

function clip(text, max = 160) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max - 1)).replace(/[,.;:]$/, "") + "…";
}

function replaceOnce(html, regex, replacement, label) {
  if (!regex.test(html)) {
    throw new Error(`seo-build: could not find ${label} in dist/index.html`);
  }
  return html.replace(regex, replacement);
}

function renderPage({ title, description, path }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const u = escapeHtml(urlFor(path));

  let html = template;
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`, "<title>");

  const metas = [
    ["name", "description", d],
    ["property", "og:title", t],
    ["property", "og:description", d],
    ["property", "og:url", u],
    ["name", "twitter:title", t],
    ["name", "twitter:description", d],
  ];

  for (const [attr, key, value] of metas) {
    html = replaceOnce(
      html,
      new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`),
      `<meta ${attr}="${key}" content="${value}" />`,
      `${key} meta tag`
    );
  }

  html = replaceOnce(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${u}" />`,
    "canonical link"
  );

  return html;
}

function write(path, html) {
  const file = path === "/" ? join(DIST, "index.html") : join(DIST, `${path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  return file;
}

/* ---------- project pages from Supabase ---------- */

async function loadProjects() {
  if (!process.env.VITE_SUPABASE_URL && existsSync(".env")) {
    try {
      process.loadEnvFile(".env");
    } catch {
      /* ignore: handled below */
    }
  }

  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.warn("seo-build: Supabase env vars not set, skipping project pages");
    return [];
  }

  try {
    const response = await fetch(
      `${url.replace(/\/+$/, "")}/rest/v1/projects?select=*&published=is.true&order=created_at.desc`,
      { headers: { apikey: key }, signal: AbortSignal.timeout(20000) }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return (await response.json()).filter((p) => p.slug);
  } catch (error) {
    console.warn(`seo-build: could not load projects (${error.message}), skipping project pages`);
    return [];
  }
}

/* ---------- build ---------- */

const today = new Date().toISOString().slice(0, 10);
const sitemap = [];

for (const [path, meta] of Object.entries(site.pages)) {
  write(path, renderPage({ ...meta, path }));
  sitemap.push({ loc: urlFor(path), lastmod: today, priority: path === "/" ? "1.0" : "0.8" });
}

const projects = await loadProjects();

for (const project of projects) {
  const path = `/projects/${project.slug}`;
  const description = clip(project.tagline || project.description || site.pages["/projects"].description);

  write(path, renderPage({ title: `${project.title}${site.projectTitleSuffix}`, description, path }));

  const updated = (project.updated_at || project.created_at || today).slice(0, 10);
  sitemap.push({ loc: urlFor(path), lastmod: updated, priority: "0.6" });
}

writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap
  .map(
    (e) => `  <url>
    <loc>${escapeXml(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`
);

console.log(
  `seo-build: ${Object.keys(site.pages).length} pages + ${projects.length} project pages, sitemap.xml with ${sitemap.length} URLs`
);
