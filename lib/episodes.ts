/**
 * The one way the rest of the site reads episodes. Server-side only (uses the file system).
 *
 * Drafts (published: false) are returned ONLY by getAllEpisodes() and getEpisodeBySlug(),
 * so a draft page can be built at its URL for preview. Everything else on the site
 * (homepage, archive, prev/next, sitemap) must use getPublishedEpisodes().
 */
import { CONTENT_DIR, loadEpisodesFromDir } from "./content/load";
import type { Episode } from "./content/schema";

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
