import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import CopyLinkButton from "@/components/CopyLinkButton";
import EpisodeNav from "@/components/EpisodeNav";
import EpisodeSources from "@/components/EpisodeSources";
import MixedText from "@/components/MixedText";
import ScriptBlock from "@/components/ScriptBlock";
import VideoFacade from "@/components/VideoFacade";
import { getAllEpisodes, getEpisodeBySlug, getNeighbors } from "@/lib/episodes";
import { breadcrumbParent, episodePath, episodeUrl, hasRealVideo, seoTitle } from "@/lib/episode-format";

// Every episode (drafts too, so they can be previewed) is built ahead of time.
// Any other address under /parasha/ is a 404.
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
    description: episode.teaser,
    alternates: { canonical: episodePath(episode.slug) },
    // Drafts can be opened by address but must never appear in Google.
    ...(episode.published ? {} : { robots: "noindex" }),
  };
}

export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) notFound();

  const url = episodeUrl(episode.slug);
  const { previous, next } = getNeighbors(episode);
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${episode.title}\n${url}`)}`;

  return (
    <main className="mx-auto max-w-[680px] px-5 py-8">
      {!episode.published && (
        <div role="note" className="font-ui mb-6 rounded-[14px] border border-gold bg-card px-4 py-3 text-base">
          <strong className="text-lg">טיוטה</strong> · העמוד הזה אינו מופיע בדף הבית, בארכיון ובגוגל.
        </div>
      )}

      <Breadcrumb parent={breadcrumbParent(episode)} current={episode.parashaName} />

      <article className="mt-6">
        <header>
          <h1 className="text-5xl leading-[1.5]">{episode.parashaNameWithNikud}</h1>
          <p className="mt-1 text-[1.5rem] font-medium leading-[1.8]">
            <MixedText>{episode.title}</MixedText>
          </p>
          <p className="font-ui mt-2 flex flex-wrap items-center gap-y-2 text-base text-muted">
            {episode.specialShabbat && (
              <>
                <span className="rounded-full border border-gold px-3 py-0.5 text-text">{episode.specialShabbat}</span>
                {" · "}
              </>
            )}
            <time dateTime={episode.gregorianDate}>{episode.hebrewDate}</time>
          </p>
        </header>

        {hasRealVideo(episode) && (
          <div className="mt-8">
            <VideoFacade videoId={episode.youtubeId} title={episode.title} />
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <a href={`${episodePath(episode.slug)}/print?auto=1`} target="_blank" rel="noopener noreferrer" className="btn btn-primary col-span-2 sm:col-span-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="7" />
            </svg>
            להדפסה לשבת
          </a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5z" />
            </svg>
            שיתוף בוואטסאפ
          </a>
          <CopyLinkButton url={url} />
        </div>

        <div className="mt-10 space-y-5">
          {episode.script.map((line, i) => (
            <ScriptBlock key={i} type={line.type} text={line.text} />
          ))}
        </div>

        <EpisodeSources sources={episode.sources} />

        {episode.calendarNotes.length > 0 && (
          <section aria-labelledby="calendar-heading" className="mt-14">
            <h2 id="calendar-heading" className="text-3xl leading-[1.6]">מתוך הלוח</h2>
            <ul className="mt-3 list-disc space-y-1 ps-7 marker:text-gold">
              {episode.calendarNotes.map((note, i) => (
                <li key={i}>
                  <MixedText>{note}</MixedText>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <EpisodeNav previous={previous} next={next} />
    </main>
  );
}
