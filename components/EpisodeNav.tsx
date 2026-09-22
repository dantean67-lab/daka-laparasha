import Link from "next/link";
import type { Episode } from "@/lib/episodes";
import { episodePath } from "@/lib/episode-format";

function Chevron({ direction }: { direction: "right" | "left" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === "right" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} />
    </svg>
  );
}

// Chronological by date. In right-to-left reading, "previous" sits on the right, "next" on the left.
export default function EpisodeNav({ previous, next }: { previous: Episode | null; next: Episode | null }) {
  if (!previous && !next) return null;
  return (
    <nav aria-label="ניווט בין פרקים" className="mt-14 grid grid-cols-2 gap-3">
      {previous ? (
        <Link href={episodePath(previous.slug)} className="nav-card">
          <span className="font-ui flex items-center gap-1 text-sm text-muted">
            <Chevron direction="right" />
            הפרק הקודם
          </span>
          <span className="text-xl font-bold leading-[1.7]">{previous.parashaNameWithNikud}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={episodePath(next.slug)} className="nav-card text-end">
          <span className="font-ui flex items-center justify-end gap-1 text-sm text-muted">
            הפרק הבא
            <Chevron direction="left" />
          </span>
          <span className="text-xl font-bold leading-[1.7]">{next.parashaNameWithNikud}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
