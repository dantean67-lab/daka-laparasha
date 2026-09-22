/**
 * Small helpers that turn an episode into the words and addresses the pages need.
 * Server-side only (imports the content schema).
 */
import { absoluteUrl, SITE_NAME } from "./site";
import { YOUTUBE_ID_PATTERN, type Episode } from "./content/schema";

export function episodePath(slug: string): string {
  return `/parasha/${slug}`;
}

export function episodeUrl(slug: string): string {
  return absoluteUrl(episodePath(slug));
}

/** True when youtubeId looks like a real video ID (drafts hold "TODO" instead). */
export function hasRealVideo(episode: Episode): boolean {
  return YOUTUBE_ID_PATTERN.test(episode.youtubeId);
}

/**
 * Open Graph's og:image. hqdefault, never maxresdefault: for a Short, maxresdefault is not
 * guaranteed to exist, hqdefault always does.
 */
export function ogImageUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
}

/**
 * JSON-LD VideoObject's uploadDate: the real day the video went up on YouTube, not the
 * Shabbat/occasion date. Falls back to gregorianDate only when youtubeUploadDate is not
 * filled in yet.
 */
export function jsonLdUploadDate(episode: Episode): string {
  return episode.youtubeUploadDate || episode.gregorianDate;
}

/**
 * <title> text. A weekly portion gets the word for "portion" in front of its name;
 * a holiday/occasion (moed) NEVER does.
 */
export function seoTitle(episode: Episode): string {
  const name = episode.episodeType === "parasha" ? `פרשת ${episode.parashaName}` : episode.parashaName;
  return `${name} | דבר תורה קצר | ${SITE_NAME}`;
}

/**
 * The middle step of the breadcrumb: the chumash for a portion, "moadim" for an occasion.
 * The href points to the matching group on the archive page (built in step 7,
 * which must give its groups these same ids: chumash-1 ... chumash-5, and moadim).
 */
export function breadcrumbParent(episode: Episode): { label: string; href: string } {
  if (episode.episodeType === "parasha") {
    return { label: episode.chumash, href: `/archive#chumash-${episode.chumashOrder}` };
  }
  return { label: "מועדים", href: "/archive#moadim" };
}
