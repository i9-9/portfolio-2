import type { ReactNode } from "react";
import { V2SmoothScroll } from "@/components/V2SmoothScroll";

export default function LandingLayout({ children }: { children: ReactNode }) {
  return <V2SmoothScroll>{children}</V2SmoothScroll>;
}
