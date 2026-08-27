import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { HeroQuote as HeroQuoteType } from "../../services/heroQuotes.service";

interface HeroQuoteProps {
  quotes: HeroQuoteType[];
}

export default function HeroQuote({
  quotes,
}: HeroQuoteProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!quotes.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [quotes]);

  if (!quotes.length) return null;

  return (
    <div className="quote-card">
      <AnimatePresence mode="wait">
        <motion.div
          key={quotes[index].id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45 }}
        >
          <p className="quote-text">
            "{quotes[index].quote}"
          </p>

          <span className="quote-author">
            — {quotes[index].author}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}