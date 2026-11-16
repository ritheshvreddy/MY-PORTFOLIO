import { useEffect, useState } from "react";
import type { HeroQuote as HeroQuoteType } from "../../services/heroQuotes.service";

interface HeroQuoteProps {
  quotes: HeroQuoteType[];
}

/*
  Rotating quote. Uses a plain CSS fade (see .quote-slide in
  Hero.css) rather than an animation library, which keeps the
  landing page's JavaScript much smaller.
*/
export default function HeroQuote({
  quotes,
}: HeroQuoteProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (quotes.length < 2) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [quotes]);

  if (!quotes.length) return null;

  const quote = quotes[index % quotes.length];

  return (
    <div className="quote-card" aria-live="polite">
      <div key={quote.id} className="quote-slide">
        <p className="quote-text">
          "{quote.quote}"
        </p>

        <span className="quote-author">
          — {quote.author}
        </span>
      </div>
    </div>
  );
}
