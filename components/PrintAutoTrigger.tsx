"use client";

import { useEffect } from "react";

// The one screen-only control on the print page (hidden in @media print via print:hidden).
// With ?auto=1 in the address (only ever put there by the "להדפסה לשבת" button), this also
// waits for the real font to be ready and opens the print dialog once by itself, then removes
// ?auto=1 from the address bar so reloading or sharing the link never triggers it again.
export default function PrintAutoTrigger() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("auto") !== "1") return;

    let cancelled = false;
    // document.fonts.ready ensures Frank Ruhl Libre is the font actually on the page before
    // printing, not a fallback serif while it is still loading.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      window.print();
      url.searchParams.delete("auto");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="print:hidden mx-auto max-w-[680px] px-5 pt-5 text-end sm:px-8">
      <button type="button" onClick={() => window.print()} className="btn btn-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="7" />
        </svg>
        הדפסה
      </button>
    </div>
  );
}
