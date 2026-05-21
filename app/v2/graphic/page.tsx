import { redirect } from "next/navigation";

/** Bookmarks to /v2/graphic keep working. */
export default function V2GraphicRedirectPage() {
  redirect("/?mode=graphic");
}
