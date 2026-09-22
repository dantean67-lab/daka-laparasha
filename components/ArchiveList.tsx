"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import MixedText from "@/components/MixedText";
import { normalizeForSearch } from "@/lib/search";
import { episodePath } from "@/lib/episode-format";

export type ArchiveEntry = {
  slug: string;
  parashaName: string;
  parashaNameWithNikud: string;
  specialShabbat: string | null;
  hebrewDate: string;
  gregorianDate: string;
  title: string;
  /** Every source citation, so the search box can find an episode by its sources too. */
  citations: string[];
};

export type ArchiveGroupView = { id: string; label: string; episodes: ArchiveEntry[] };

function matches(entry: ArchiveEntry, query: string): boolean {
  if (query === "") return true;
  const haystacks = [entry.parashaName, entry.parashaNameWithNikud, entry.title, ...entry.citations];
  return haystacks.some((text) => normalizeForSearch(text).includes(query));
}

export default function ArchiveList({ groups }: { groups: ArchiveGroupView[] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = useMemo(() => normalizeForSearch(query), [query]);

  const filteredGroups = groups
    .map((group) => ({ ...group, episodes: group.episodes.filter((e) => matches(e, normalizedQuery)) }))
    .filter((group) => group.episodes.length > 0);

  return (
    <div>
      <label className="font-ui block">
        <span className="sr-only">חיפוש בארכיון</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש לפי שם, כותרת או מקור..."
          className="min-h-11 w-full rounded-[14px] border border-line bg-card px-4 text-lg text-text placeholder:text-muted"
        />
      </label>

      {filteredGroups.length === 0 && (
        <p className="font-ui mt-8 text-center text-muted">לא נמצאו פרקים מתאימים.</p>
      )}

      {filteredGroups.map((group) => (
        <section key={group.id} id={group.id} className="mt-10">
          <h2 className="text-2xl leading-[1.6]">{group.label}</h2>
          <ul className="m-0 mt-3 list-none space-y-2 p-0">
            {group.episodes.map((entry) => (
              <li key={entry.slug}>
                <Link href={episodePath(entry.slug)} className="nav-card block">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-lg font-bold">{entry.parashaNameWithNikud}</span>
                    {entry.specialShabbat && (
                      <>
                        {" "}
                        <span className="font-ui rounded-full border border-gold px-2 py-0.5 text-xs text-muted">
                          {entry.specialShabbat}
                        </span>
                      </>
                    )}
                  </span>{" "}
                  <span className="mt-1 block text-base">
                    <MixedText>{entry.title}</MixedText>
                  </span>{" "}
                  <time dateTime={entry.gregorianDate} className="font-ui mt-1 block text-sm text-muted">
                    {entry.hebrewDate}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
