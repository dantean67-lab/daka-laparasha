import type { Metadata } from "next";
import ArchiveList, { type ArchiveGroupView } from "@/components/ArchiveList";
import { getArchiveGroups } from "@/lib/episodes";
import { SITE_NAME } from "@/lib/site";

const TITLE = `ארכיון | ${SITE_NAME}`;
const DESCRIPTION = "כל הפרקים של דקה לפרשה, לפי סדר החומשים והמועדים, עם חיפוש לפי שם, כותרת או מקור.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/archive" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/archive" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

// Rebuilt at most once an hour, same as the homepage, so a newly published episode appears
// without a full redeploy.
export const revalidate = 3600;

export default function ArchivePage() {
  const groups: ArchiveGroupView[] = getArchiveGroups().map((group) => ({
    id: group.id,
    label: group.label,
    episodes: group.episodes.map((episode) => ({
      slug: episode.slug,
      parashaName: episode.parashaName,
      parashaNameWithNikud: episode.parashaNameWithNikud,
      specialShabbat: episode.specialShabbat,
      hebrewDate: episode.hebrewDate,
      gregorianDate: episode.gregorianDate,
      title: episode.title,
      citations: episode.sources.map((source) => source.citation),
    })),
  }));

  return (
    <main className="mx-auto max-w-[680px] px-5 py-8">
      <h1 className="text-4xl">ארכיון</h1>
      <p className="font-ui mt-2 text-lg text-muted">{DESCRIPTION}</p>

      <div className="mt-6">
        <ArchiveList groups={groups} />
      </div>
    </main>
  );
}
