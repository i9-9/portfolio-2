"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Two identical rails, each ≥ viewport width → seamless -50% loop with no gaps. */
export function ContactFooterMarquee({ text }: { text: string }) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [copiesPerRail, setCopiesPerRail] = useState(6);

  useLayoutEffect(() => {
    const update = () => {
      const itemW = measureRef.current?.getBoundingClientRect().width;
      if (!itemW) return;
      setCopiesPerRail(Math.max(4, Math.ceil(window.innerWidth / itemW) + 2));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [text]);

  const itemClass =
    "inline-flex shrink-0 items-center whitespace-nowrap pr-14 sm:pr-20";

  const rail = (keyPrefix: number, measureFirst = false) => (
    <div className="contact-cta-marquee-rail flex shrink-0" aria-hidden={keyPrefix > 0}>
      {Array.from({ length: copiesPerRail }, (_, i) => (
        <span
          key={`${keyPrefix}-${i}`}
          ref={measureFirst && i === 0 ? measureRef : undefined}
          className={itemClass}
        >
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <div className="contact-cta-marquee-viewport py-2" aria-hidden>
      <div className="contact-cta-marquee-track font-helveticaNowTextRegular text-type-micro normal-case leading-none tracking-[-0.02em]">
        {rail(0, true)}
        {rail(1)}
      </div>
    </div>
  );
}
