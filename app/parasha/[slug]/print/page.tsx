import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MixedText from "@/components/MixedText";
import PrintAutoTrigger from "@/components/PrintAutoTrigger";
import ScriptBlock from "@/components/ScriptBlock";
import { getAllEpisodes, getEpisodeBySlug } from "@/lib/episodes";
import { episodePath, seoTitle } from "@/lib/episode-format";
import { SITE_NAME } from "@/lib/site";

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
        <h1 className="text-4xl leading-[1.6]">{episode.parashaNameWithNikud}</h1>
        <p className="font-ui mt-1 text-lg">{episode.hebrewDate}</p>

        <div className="mt-8 space-y-4">
          {episode.script.map((line, i) => (
            <ScriptBlock key={i} type={line.type} text={line.text} />
          ))}
        </div>

        {episode.sources.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl leading-[1.6]">המקורות</h2>
            <ol className="m-0 mt-4 list-none space-y-5 p-0">
              {episode.sources.map((source, i) => (
                <li key={i}>
                  <p className="font-ui font-semibold">
                    <MixedText>{source.citation}</MixedText>
                  </p>
                  <p className="mt-1 leading-[2.1]">
                    <MixedText>{source.quote}</MixedText>
                  </p>
                  {source.note && (
                    <p className="font-ui mt-1 text-base">
                      <MixedText>{source.note}</MixedText>
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        <p className="font-ui mt-14 border-t border-black/20 pt-3 text-sm">
          <MixedText>{`${SITE_NAME} · youtube.com/@DakaLaParasha`}</MixedText>
        </p>
      </main>
    </div>
  );
}
