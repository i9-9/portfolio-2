import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ mode?: string }>;
};

/** Legacy `/v2` URLs redirect to `/` (query preserved). */
export default async function V2RedirectPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const suffix =
    typeof sp.mode === "string" && sp.mode.toLowerCase() === "graphic"
      ? "?mode=graphic"
      : "";
  redirect(`/${suffix}`);
}
