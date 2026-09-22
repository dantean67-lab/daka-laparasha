import type { MetadataRoute } from "next";
import { episodePath } from "@/lib/episode-format";
import { getPublishedEpisodes } from "@/lib/episodes";
import { absoluteUrl } from "@/lib/site";

// Draft episodes and print pages (A5: noindex, canonical to the episode page) are
// deliberately left out - only what should actually show up in Google search results.
export default function sitemap(): MetadataRoute.Sitemap {
  const episodePages: MetadataRoute.Sitemap = getPublishedEpisodes().map((episode) => ({
    url: absoluteUrl(episodePath(episode.slug)),
    lastModified: episode.gregorianDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/archive"), changeFrequency: "weekly", priority: 0.6 },
    ...episodePages,
  ];
}
