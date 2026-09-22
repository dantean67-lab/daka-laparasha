import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Ltr from "@/components/Ltr";
import MixedText from "@/components/MixedText";
import PrintAutoTrigger from "@/components/PrintAutoTrigger";
import ScriptBlock from "@/components/ScriptBlock";
import { getAllEpisodes, getEpisodeBySlug } from "@/lib/episodes";
import { episodePath, seoTitle } from "@/lib/episode-format";
import { SITE_NAME } from "@/lib/site";

// Nikud/cantillation marks live in U+0591-U+05C7. A source quote that has none of them is
// unvocalized classical text (copied as-is), which prints fine at a tighter line-height;
// a quote that does carry nikud needs the >=1.9 minimum so the marks never collide.
const HAS_NIKUD = /[֑-ׇ]/;

// Every episode (drafts too, so a draft can be previewed and printed for review) is built
// ahead of time, same as the episode page itself.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEpisodes().map((episode) => ({ slug: episode.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) return {};
  return {
    title: seoTitle(episode),
    // A print page is never a search result in its own right - the episode page is.
    robots: "noindex",
    alternates: { canonical: episodePath(episode.slug) },
  };
}

export default async function PrintPage({ params }: Props) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) notFound();

  return (
    <div className="print-page min-h-screen">
      <PrintAutoTrigger />

      <main className="mx-auto max-w-[680px] px-5 py-8 sm:px-8 sm:py-10 print:max-w-none print:p-0">
        <h1 className="text-4xl leading-[1.6] print:text-[20pt] print:leading-[1.3]">
          {episode.parashaNameWithNikud}
        </h1>
        <p className="font-ui mt-1 text-lg print:mt-0.5 print:text-[11pt]">{episode.hebrewDate}</p>

        <div className="mt-8 space-y-4 print:mt-4 print:space-y-2">
          {episode.script.map((line, i) => (
            <ScriptBlock key={i} type={line.type} text={line.text} />
          ))}
        </div>

        {episode.sources.length > 0 && (
          <section className="mt-10 print:mt-5">
            <h2 className="break-after-avoid text-2xl leading-[1.6] print:text-[14pt] print:leading-[1.3]">
              המקורות
            </h2>
            <ol className="m-0 mt-4 list-none space-y-5 p-0 print:mt-2 print:space-y-3">
              {episode.sources.map((source, i) => (
                <li key={i} className="break-inside-avoid">
                  <p className="font-ui font-semibold print:text-[10.5pt]">
                    <MixedText>{source.citation}</MixedText>
                  </p>
                  <p
                    className={`mt-1 leading-[2.1] print:mt-0.5 print:text-[11.5pt] ${
                      HAS_NIKUD.test(source.quote) ? "print:leading-[1.9]" : "print:leading-[1.6]"
                    }`}
                  >
                    <MixedText>{source.quote}</MixedText>
                  </p>
                  {source.note && (
                    <p className="font-ui mt-1 text-base print:mt-0.5 print:text-[9.5pt] print:leading-[1.3]">
                      <MixedText>{source.note}</MixedText>
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        <p className="font-ui mt-14 border-t border-black/20 pt-3 text-sm print:mt-6 print:pt-2 print:text-[9pt]">
          <MixedText>{SITE_NAME}</MixedText> · <Ltr>youtube.com/@DakaLaParasha</Ltr>
        </p>
      </main>
    </div>
  );
}
