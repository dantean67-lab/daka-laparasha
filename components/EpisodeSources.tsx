import MixedText from "@/components/MixedText";
import type { Source } from "@/lib/episodes";

export default function EpisodeSources({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sources-heading" className="mt-14">
      <h2 id="sources-heading" className="text-3xl leading-[1.6]">המקורות</h2>
      <ul className="m-0 mt-4 list-none space-y-4 p-0">
        {sources.map((source, i) => (
          <li key={i} className="rounded-[14px] border border-line bg-card p-5">
            <h3 className="text-xl leading-[1.7]">
              <MixedText>{source.citation}</MixedText>
            </h3>
            <blockquote className="m-0 mt-1 text-[1.25rem] leading-[2.1]">
              <MixedText>{source.quote}</MixedText>
            </blockquote>
            {source.note && (
              <p className="mt-3 text-[1.125rem] leading-[2] text-muted">
                <MixedText>{source.note}</MixedText>
              </p>
            )}
            {source.link && (
              <p className="font-ui mt-2 text-base">
                <a href={source.link} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                  לעיון במקור
                </a>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
