"use client";

import { useEffect, useState } from "react";

export function NumberScramble({
  value,
  inView,
}: {
  value: number;
  inView: boolean;
}) {
  const target = String(value).padStart(2, "0");
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!inView) return;
    let step = 0;
    const total = 10;
    const id = setInterval(() => {
      step++;
      if (step >= total) {
        setDisplay(target);
        clearInterval(id);
      } else {
        setDisplay(String(Math.floor(Math.random() * 99)).padStart(2, "0"));
      }
    }, 45);
    return () => clearInterval(id);
  }, [inView, target]);

  return <span className="tabular-nums">{display}</span>;
}
