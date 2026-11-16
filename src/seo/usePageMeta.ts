import { useEffect } from "react";

import site from "./site.json";

/*
  Keeps <title>, description, canonical URL and the Open Graph /
  Twitter tags in sync while navigating inside the app.

  Crawlers and link previews that don't run JavaScript get the same
  values from the pre-built HTML (scripts/seo-build.mjs).
*/

type StaticPath = keyof typeof site.pages;

interface PageMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

export function metaFor(path: StaticPath): PageMeta {
  return { ...site.pages[path], path };
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);

  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  el.content = content;
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }

  el.href = href;
}

export function usePageMeta(meta: PageMeta | null) {
  const title = meta?.title;
  const description = meta?.description;
  const path = meta?.path;
  const noindex = meta?.noindex ?? false;

  useEffect(() => {
    if (!title || !description || path === undefined) {
      return;
    }

    const url = site.siteUrl + (path === "/" ? "/" : path);

    document.title = title;

    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setCanonical(url);

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
  }, [title, description, path, noindex]);
}
