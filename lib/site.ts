/**
 * The one place that knows the public address of the site.
 * Everything that needs an absolute URL (canonical links, sitemap, robots,
 * Open Graph, JSON-LD, share and copy links) must build it from SITE_URL.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL          manual override (e.g. a future custom domain)
 *   2. VERCEL_PROJECT_PRODUCTION_URL set automatically by Vercel; always the
 *                                    production domain, so preview builds
 *                                    still point canonicals at production
 *   3. http://localhost:3000         only when NOT running on Vercel
 */

function resolveSiteUrl(): string {
  const override = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  let raw: string;
  if (override) {
    raw = override;
  } else if (vercelProduction) {
    raw = `https://${vercelProduction}`;
  } else if (process.env.VERCEL) {
    throw new Error(
      "SITE_URL could not be determined. This build is running on Vercel, but neither " +
        "NEXT_PUBLIC_SITE_URL nor VERCEL_PROJECT_PRODUCTION_URL is set. " +
        "Fix: in Vercel open Settings > Environment Variables and add NEXT_PUBLIC_SITE_URL " +
        "(for example https://your-project.vercel.app), or make sure " +
        '"Automatically expose System Environment Variables" is ticked in Settings > Environment Variables.',
    );
  } else {
    raw = "http://localhost:3000";
  }

  const withoutSlash = raw.replace(/\/+$/, "");
  try {
    new URL(withoutSlash);
  } catch {
    throw new Error(
      `SITE_URL is not a valid address: "${withoutSlash}". ` +
        "It must start with https:// (for example https://your-project.vercel.app).",
    );
  }
  return withoutSlash;
}

export const SITE_URL = resolveSiteUrl();

/** Builds an absolute URL on this site from a path such as "/archive". */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const SITE_NAME = "דקה לפרשה";
export const SITE_DESCRIPTION =
  "דקה אחת של תורה בכל שבוע: דבר תורה קצר על פרשת השבוע, ממקורות מדויקים: רש\"י, גמרא, מדרש ומפרשי התורה.";
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@DakaLaParasha";
