import type { ReactNode } from "react";
import Ltr from "@/components/Ltr";

// Numbers and Latin letters (with the . : / - that join them, like 21.9.2026) inside Hebrew
// text are wrapped so the browser does not reorder them. Text that has none is returned as is.
const TOKEN = /[A-Za-z0-9]+(?:[.:/-][A-Za-z0-9]+)*/g;
const HAS_LETTER = /[A-Za-z]/;

export default function MixedText({ children }: { children: string }) {
  // Find every run, then join neighbours that are separated by a single space AND both contain
  // Latin letters, so an English phrase keeps its own word order ("TODO title", not "title TODO").
  const runs: { start: number; end: number }[] = [];
  for (const match of children.matchAll(TOKEN)) {
    const start = match.index;
    const end = start + match[0].length;
    const previous = runs.at(-1);
    if (
      previous &&
      start === previous.end + 1 &&
      children[previous.end] === " " &&
      HAS_LETTER.test(children.slice(previous.start, previous.end)) &&
      HAS_LETTER.test(match[0])
    ) {
      previous.end = end;
    } else {
      runs.push({ start, end });
    }
  }
  if (runs.length === 0) return <>{children}</>;

  const parts: ReactNode[] = [];
  let last = 0;
  for (const run of runs) {
    if (run.start > last) parts.push(children.slice(last, run.start));
    parts.push(<Ltr key={run.start}>{children.slice(run.start, run.end)}</Ltr>);
    last = run.end;
  }
  if (last < children.length) parts.push(children.slice(last));
  return <>{parts}</>;
}
