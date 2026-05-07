import { PortfolioPage } from "@/components/portfolio/PortfolioPage";

type PageProps = {
  searchParams?: Promise<{ mode?: string }>;
};

/** Landing portfolio (v2 shell + content). `mode` from server avoids client hydration drift. */
export default async function V2Page({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const v2Mode =
    typeof sp.mode === "string" && sp.mode.toLowerCase() === "graphic"
      ? ("graphic" as const)
      : ("web" as const);
  return <PortfolioPage v2Mode={v2Mode} />;
}
