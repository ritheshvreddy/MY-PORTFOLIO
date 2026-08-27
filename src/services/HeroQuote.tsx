import {
  useEffect,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import type {
  HeroQuote as HeroQuoteType,
} from "./heroQuotes.service";


/* =========================================================
   PROPS
========================================================= */

interface HeroQuoteProps {
  quotes: HeroQuoteType[];
}


/* =========================================================
   HERO QUOTE
========================================================= */

export default function HeroQuote({
  quotes,
}: HeroQuoteProps) {

  const [
    index,
    setIndex,
  ] = useState(0);


  /* =======================================================
     AUTO ROTATE
  ======================================================= */

  useEffect(() => {

    if (
      !quotes.length
    ) {
      return;
    }


    const timer =
      setInterval(() => {

        setIndex(
          (previous) =>
            (
              previous + 1
            ) %
            quotes.length
        );

      }, 4000);


    return () =>
      clearInterval(
        timer
      );

  }, [
    quotes,
  ]);


  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (
    !quotes.length
  ) {
    return null;
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="quote-card">

      <AnimatePresence
        mode="wait"
      >

        <motion.div
          key={
            quotes[index].id
          }

          initial={{
            opacity: 0,
            y: 12,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          exit={{
            opacity: 0,
            y: -12,
          }}

          transition={{
            duration: 0.45,
          }}
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