"use client";

// Switches between light and dark and remembers the choice on this device.
// Which icon/label is visible is decided purely by CSS (.when-light / .when-dark),
// so the server-rendered HTML is always correct and nothing flickers.

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export default function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  function toggle() {
    const root = document.documentElement;
    const forced = root.getAttribute("data-theme");
    const current =
      forced === "light" || forced === "dark"
        ? forced
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);

    // Keep the browser toolbar colour (theme-color) in step with the switch, matching the
    // values in app/layout.tsx.
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", next === "dark" ? "#1c1a17" : "#faf8f4");

    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked (private mode); the theme still switches for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="החלפה בין מצב בהיר למצב כהה"
      className="font-ui inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-line bg-card px-3 text-base text-text transition-colors hover:border-gold"
    >
      {/* Shown while the site is light: offers dark */}
      <span className="when-light">
        <MoonIcon />
        {showLabel && <span>מצב כהה</span>}
      </span>
      {/* Shown while the site is dark: offers light */}
      <span className="when-dark">
        <SunIcon />
        {showLabel && <span>מצב בהיר</span>}
      </span>
    </button>
  );
}
