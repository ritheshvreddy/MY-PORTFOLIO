import Terminal from "../components/terminal/Terminal";
import { metaFor, usePageMeta } from "../seo/usePageMeta";

export default function TerminalPage() {
  usePageMeta(metaFor("/terminal"));

  return (
    <>
      {/* The terminal has no visible heading; this gives the page its
          one main heading for search engines and screen readers. */}
      <h1 className="sr-only">Interactive Terminal</h1>

      <Terminal />
    </>
  );
}
