import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import Header from "@/components/Header";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// Self-hosted at build time by Next.js: no requests to Google when visitors load the site.
// "latin" is included next to "hebrew" so digits and punctuation use the same font.
const frank = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-frank",
  display: "swap",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

// Site-wide defaults. Pages that need something more specific (the homepage's title, an
// episode's per-video Open Graph image, the archive page's description) override these.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

// Matches --bg in globals.css. Kept as plain strings (not CSS vars) because both the
// server-rendered default below and the inline script need a value before any stylesheet runs.
const THEME_COLOR_LIGHT = "#faf8f4";
const THEME_COLOR_DARK = "#1c1a17";

// A single, non-media-scoped tag: its content is kept in sync with the ACTIVE theme (system
// preference, or the visitor's manual override) by the inline script below and by the toggle
// button, so the browser's own toolbar colour always matches what is on screen right now.
export const viewport: Viewport = {
  themeColor: THEME_COLOR_LIGHT,
};

// Runs before the page is painted, so a visitor who chose a theme never sees a flash of the
// other one - this sets both <html data-theme> and the theme-color meta tag together.
const themeScript = `try{
  var t=localStorage.getItem("theme");
  var forced=(t==="light"||t==="dark")?t:null;
  if(forced)document.documentElement.setAttribute("data-theme",forced);
  var dark=forced?forced==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
  var meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.setAttribute("content",dark?"${THEME_COLOR_DARK}":"${THEME_COLOR_LIGHT}");
}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${frank.variable} ${heebo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
