import Link from "next/link";
import EpisodeSources from "@/components/EpisodeSources";
import MixedText from "@/components/MixedText";
import ScriptBlock from "@/components/ScriptBlock";
import VideoFacade from "@/components/VideoFacade";
import { getCurrentEpisode, getPreviousEpisodes } from "@/lib/episodes";
import { episodePath, hasRealVideo } from "@/lib/episode-format";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// Rebuilt at most once an hour, so the current episode (the one with the earliest
// gregorianDate that is still today or later, Asia/Jerusalem) changes without a new deploy.
export const revalidate = 3600;

export default function HomePage() {
  const current = getCurrentEpisode();
  const previous = current ? getPreviousEpisodes(current) : [];

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
                  <span className="text-lg font-bold">{episode.parashaNameWithNikud}</span>
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
