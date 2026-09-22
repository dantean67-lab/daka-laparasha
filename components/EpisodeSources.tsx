import MixedText from "@/components/MixedText";
import type { Source } from "@/lib/episodes";

// headingLevel: "h2" on the episode page (a direct child of its h1), "h3" on the homepage,
// where the current episode's own name already takes the h2 slot.
export default function EpisodeSources({
  sources,
  headingLevel: Heading = "h2",
}: {
  sources: Source[];
  headingLevel?: "h2" | "h3";
}) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sources-heading" className="mt-14">
      <Heading id="sources-heading" className="text-3xl leading-[1.6]">המקורות</Heading>
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
