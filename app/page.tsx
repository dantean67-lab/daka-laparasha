import Link from "next/link";
import CopyLinkButton from "@/components/CopyLinkButton";
import EpisodeSources from "@/components/EpisodeSources";
import MixedText from "@/components/MixedText";
import ScriptBlock from "@/components/ScriptBlock";
import VideoFacade from "@/components/VideoFacade";
import { getCurrentEpisode, getPreviousEpisodes } from "@/lib/episodes";
import { episodePath, episodeUrl, hasRealVideo } from "@/lib/episode-format";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// Rebuilt at most once an hour, so the current episode (the one with the earliest
// gregorianDate that is still today or later, Asia/Jerusalem) changes without a new deploy.
export const revalidate = 3600;

export default function HomePage() {
  const current = getCurrentEpisode();
  const previous = current ? getPreviousEpisodes(current) : [];
  const currentUrl = current ? episodeUrl(current.slug) : "";
  const whatsappHref = current
    ? `https://wa.me/?text=${encodeURIComponent(`${current.title}\n${currentUrl}`)}`
    : "";

  return (
    <main className="mx-auto max-w-[680px] px-5 py-8">
      <h1 className="text-4xl">{SITE_NAME}</h1>
      <p className="font-ui mt-2 text-lg text-muted">{SITE_DESCRIPTION}</p>

      {current && (
        <article className="mt-8">
          <header>
            <h2 className="text-4xl leading-[1.5]">
              <Link href={episodePath(current.slug)} className="text-text no-underline hover:text-accent">
                {current.parashaNameWithNikud}
              </Link>
            </h2>
            <p className="mt-1 text-[1.375rem] font-medium leading-[1.8]">
              <MixedText>{current.title}</MixedText>
            </p>
            <p className="mt-2 text-lg leading-[1.9] text-muted">
              <MixedText>{current.teaser}</MixedText>
            </p>
            <p className="font-ui mt-2 flex flex-wrap items-center gap-y-2 text-base text-muted">
              {current.specialShabbat && (
                <>
                  <span className="rounded-full border border-gold px-3 py-0.5 text-text">
                    {current.specialShabbat}
                  </span>
                  {" · "}
                </>
              )}
              <time dateTime={current.gregorianDate}>{current.hebrewDate}</time>
            </p>
          </header>

          {hasRealVideo(current) && (
            <div className="mt-8">
              <VideoFacade videoId={current.youtubeId} title={current.title} />
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <a
              href={`${episodePath(current.slug)}/print?auto=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary col-span-2 sm:col-span-1"
            >
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
            <CopyLinkButton url={currentUrl} />
          </div>

          <div className="mt-8 space-y-5">
            {current.script.map((line, i) => (
              <ScriptBlock key={i} type={line.type} text={line.text} />
            ))}
          </div>

          <EpisodeSources sources={current.sources} headingLevel="h3" />
        </article>
      )}

      {previous.length > 0 && (
        <nav aria-labelledby="previous-heading" className="mt-14">
          <h2 id="previous-heading" className="font-ui text-xl text-muted">
            פרקים קודמים
          </h2>
          <ul className="m-0 mt-3 list-none space-y-2 p-0">
            {previous.map((episode) => (
              <li key={episode.slug}>
                <Link href={episodePath(episode.slug)} className="nav-card flex items-center justify-between gap-3">
                  <span className="text-lg font-bold">{episode.parashaNameWithNikud}</span>{" "}
                  <time dateTime={episode.gregorianDate} className="font-ui text-sm text-muted">
                    {episode.hebrewDate}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <p className="font-ui mt-10 text-center">
        <Link href="/archive" className="text-accent underline">
          כל הפרקים בארכיון
        </Link>
      </p>
    </main>
  );
}
