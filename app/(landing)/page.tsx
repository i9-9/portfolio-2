import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ mode?: string }>;
};

/** Canonical portfolio lives at `/v2`; `/` forwards query (e.g. `?mode=graphic`). */
export default async function HomePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const suffix =
    typeof sp.mode === "string" && sp.mode.toLowerCase() === "graphic"
      ? "?mode=graphic"
      : "";
  redirect(`/v2${suffix}`);
}
