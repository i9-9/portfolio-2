import { NextResponse } from "next/server";

/** Spanish-speaking markets — geo fallback when browser language is ambiguous. */
const ES_COUNTRIES = new Set([
  "AR",
  "BO",
  "CL",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "ES",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "SV",
  "UY",
  "VE",
]);

function languageFromCountry(country: string | null): "en" | "es" {
  if (country && ES_COUNTRIES.has(country.toUpperCase())) return "es";
  return "en";
}

export async function GET(request: Request) {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    null;

  // Ignore CDN "unknown" / XX placeholders
  const normalized =
    country && /^[A-Z]{2}$/i.test(country) && country.toUpperCase() !== "XX"
      ? country.toUpperCase()
      : null;

  return NextResponse.json({
    country: normalized,
    language: languageFromCountry(normalized),
  });
}
