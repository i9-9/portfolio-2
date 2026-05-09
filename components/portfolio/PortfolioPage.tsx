"use client";

import dynamic from "next/dynamic";
import type { V2ContentMode } from "./PortfolioPageInner";

const PortfolioPageInner = dynamic(
  () =>
    import("./PortfolioPageInner").then((mod) => ({
      default: mod.PortfolioPageInner,
    })),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-screen bg-background" aria-busy="true" />
    ),
  },
);

export type { V2ContentMode };

export function PortfolioPage({ v2Mode = "web" }: { v2Mode?: V2ContentMode }) {
  return <PortfolioPageInner v2Mode={v2Mode} />;
}
