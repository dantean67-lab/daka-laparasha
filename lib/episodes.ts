/**
 * The one way the rest of the site reads episodes. Server-side only (uses the file system).
 *
 * Drafts (published: false) are returned ONLY by getAllEpisodes() and getEpisodeBySlug(),
 * so a draft page can be built at its URL for preview. Everything else on the site
 * (homepage, archive, prev/next, sitemap) must use getPublishedEpisodes().
 */
import { CONTENT_DIR, loadEpisodesFromDir } from "./content/load";
import { CHUMASH_NAMES, type Episode } from "./content/schema";

export type { Episode, MoedEpisode, ParashaEpisode, ScriptLine, Source } from "./content/schema";

let cache: Episode[] | null = null;

function byDateThenSlug(a: Episode, b: Episode): number {
  return a.gregorianDate.localeCompare(b.gregorianDate) || a.slug.localeCompare(b.slug);
}

/** Every episode, drafts included, oldest date first. Throws ContentError if any file is invalid. */
export function getAllEpisodes(): Episode[] {
  // In development the files change while the server runs, so re-read them every time.
  if (cache && process.env.NODE_ENV === "production") return cache;
  cache = loadEpisodesFromDir(CONTENT_DIR).sort(byDateThenSlug);
  return cache;
}

/** Published episodes only, oldest date first. */
export function getPublishedEpisodes(): Episode[] {
  return getAllEpisodes().filter((episode) => episode.published);
}

/** One episode by slug, draft or published. */
export function getEpisodeBySlug(slug: string): Episode | undefined {
  return getAllEpisodes().find((episode) => episode.slug === slug);
}

/**
 * The published episode just before and just after this one, in date order
 * (NOT parasha order). Works for drafts too: a draft's neighbours are the published
 * episodes around its date, but a draft is never anyone's neighbour.
 */
export function getNeighbors(episode: Episode): { previous: Episode | null; next: Episode | null } {
  const published = getPublishedEpisodes();
  const before = published.filter((e) => byDateThenSlug(e, episode) < 0);
  const after = published.filter((e) => byDateThenSlug(e, episode) > 0);
  return { previous: before.at(-1) ?? null, next: after[0] ?? null };
}

/** Today's date in Asia/Jerusalem as YYYY-MM-DD, never the server's own (UTC) date. */
function todayInJerusalem(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(new Date());
}

/**
 * The homepage's current episode: the published episode with the earliest gregorianDate
 * that is still >= today, or - if every published episode's date has passed - the most
 * recent one. A video goes up before the date it is about, so this is the one people
 * are meant to be reading/printing right now. null when nothing is published yet.
 */
export function getCurrentEpisode(): Episode | null {
  const published = getPublishedEpisodes();
  if (published.length === 0) return null;
  const today = todayInJerusalem();
  return published.find((e) => e.gregorianDate >= today) ?? published.at(-1)!;
}

/** Up to `limit` published episodes right before `current`, most recent first. */
export function getPreviousEpisodes(current: Episode, limit = 4): Episode[] {
  const published = getPublishedEpisodes();
  const before = published.filter((e) => byDateThenSlug(e, current) < 0);
  return before.slice(-limit).reverse();
}

/** The one text a source contributes to the archive's search box. */
export type ArchiveSourceCitation = string;

export type ArchiveGroup = {
  /** Matches the ids breadcrumbParent() links to: chumash-1 .. chumash-5, or "moadim". */
  id: string;
  label: string;
  episodes: Episode[];
};

/**
 * Published episodes grouped for /archive: the five Chumashim in Torah order (parashaOrder,
 * then gregorianDate within each), then a final "מועדים וזמנים" group of moed episodes
 * (gregorianDate order). A group with nothing published in it yet is left out entirely -
 * same "no empty state" rule as the homepage's previous-episodes list.
 */
export function getArchiveGroups(): ArchiveGroup[] {
  const published = getPublishedEpisodes();

  const chumashGroups: ArchiveGroup[] = CHUMASH_NAMES.map((label, i) => {
    const chumashOrder = i + 1;
    const episodes = published
      .filter((e) => e.episodeType === "parasha" && e.chumashOrder === chumashOrder)
      .sort((a, b) => {
        if (a.episodeType !== "parasha" || b.episodeType !== "parasha") return 0;
        return a.parashaOrder - b.parashaOrder || byDateThenSlug(a, b);
      });
    return { id: `chumash-${chumashOrder}`, label, episodes };
  });

  const moedEpisodes = published.filter((e) => e.episodeType === "moed").sort(byDateThenSlug);

  return [...chumashGroups, { id: "moadim", label: "מועדים וזמנים", episodes: moedEpisodes }].filter(
    (group) => group.episodes.length > 0,
  );
}
