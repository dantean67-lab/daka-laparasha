/**
 * The shape of one episode file, and every rule an episode file must obey.
 *
 * Two levels of strictness:
 *   - DRAFT     (published: false)  structure must be right; placeholders such as "TODO" are fine.
 *   - PUBLISHED (published: true)   structure AND content must be real: no "TODO", a real
 *                                   YouTube ID, a non-empty script and sources.
 *
 * IMPORTANT: this file never changes, trims or normalizes any text. Hebrew (with nikud)
 * is checked, never rewritten.
 */
import { z } from "zod";

export const CHUMASH_NAMES = ["בראשית", "שמות", "ויקרא", "במדבר", "דברים"] as const;
export const SCRIPT_TYPES = ["opening", "paragraph", "quote", "message", "closing"] as const;

export const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*-\d{4}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ISO_8601_DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
/** The date written in the templates. A published episode must never still carry it. */
const TEMPLATE_PLACEHOLDER_DATE = "2000-01-01";

function isRealDate(value: string): boolean {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

const text = z.string().refine((v) => v.trim().length > 0, "must not be empty");

const scriptLine = z.strictObject({
  type: z.enum(SCRIPT_TYPES),
  text,
});

const source = z.strictObject({
  citation: text,
  quote: text,
  // Optional: leave out, or use "" when there is nothing to add.
  note: z.string().default(""),
  link: z
    .string()
    .refine((v) => v === "" || /^https?:\/\/\S+$/.test(v), "must be empty, or a full web address starting with https://")
    .default(""),
});

const shared = {
  slug: z.string().regex(SLUG_PATTERN, 'must look like "haazinu-5787": lowercase English letters and digits, words joined by "-", ending with the Hebrew year'),
  published: z.boolean(),
  parashaName: text,
  parashaNameWithNikud: text,
  hebrewDate: text,
  gregorianDate: z.string().regex(DATE_PATTERN, "must look like 2026-09-19 (year-month-day)").refine(isRealDate, "is not a real calendar date"),
  // Optional: leave out, or use "" when not known yet. Falls back to gregorianDate for
  // JSON-LD's uploadDate - but that is the Shabbat/occasion date, not the real upload date,
  // so fill this in as soon as the video is live.
  youtubeUploadDate: z
    .string()
    .refine(
      (v) => v === "" || ISO_8601_DATETIME_PATTERN.test(v),
      'must be empty, or a full ISO 8601 date-time like "2026-09-18T07:57:55-07:00"',
    )
    .default(""),
  youtubeId: text,
  title: text,
  teaser: text,
  script: z.array(scriptLine),
  sources: z.array(source),
  calendarNotes: z.array(text),
};

const parashaSchema = z.strictObject({
  ...shared,
  episodeType: z.literal("parasha"),
  chumash: z.enum(CHUMASH_NAMES, { error: "must be exactly one of the five Chumash names (see _TEMPLATE.json)" }),
  chumashOrder: z.number().int().min(1).max(5),
  parashaOrder: z.number().int().min(1).max(54),
  specialShabbat: text.nullable(),
  torahReading: text,
  haftarah: text,
});

const nullForMoed = { error: 'must be null (written without quotes) for a "moed" episode' };
const moedSchema = z.strictObject({
  ...shared,
  episodeType: z.literal("moed"),
  chumash: z.null(nullForMoed),
  chumashOrder: z.null(nullForMoed),
  parashaOrder: z.null(nullForMoed),
  specialShabbat: z.null(nullForMoed),
  torahReading: z.null(nullForMoed),
  haftarah: z.null(nullForMoed),
});

const episodeSchema = z.discriminatedUnion("episodeType", [parashaSchema, moedSchema]);

export type Episode = z.infer<typeof episodeSchema>;
export type ParashaEpisode = z.infer<typeof parashaSchema>;
export type MoedEpisode = z.infer<typeof moedSchema>;
export type ScriptLine = z.infer<typeof scriptLine>;
export type Source = z.infer<typeof source>;

/** One problem found in one file: which field, and what is wrong. */
export type ContentIssue = { path: string; message: string };

function formatPath(path: ReadonlyArray<PropertyKey>): string {
  if (path.length === 0) return "(top level of the file)";
  return path.reduce<string>((out, part) => {
    if (typeof part === "number") return `${out}[${part}]`;
    return out === "" ? String(part) : `${out}.${String(part)}`;
  }, "");
}

function friendlyMessage(issue: z.core.$ZodIssue): string {
  if (issue.code === "unrecognized_keys") {
    return `unknown field ${issue.keys.map((k) => `"${k}"`).join(", ")}. Check the spelling against _TEMPLATE.json`;
  }
  const typeMismatch = /expected (\w+), received (\w+)/.exec(issue.message);
  if (typeMismatch) {
    const [, expected, received] = typeMismatch;
    if (received === "undefined") return "is missing (this field is required)";
    return `must be ${expected}, but the file has ${received}`;
  }
  return issue.message;
}

/** Every string anywhere inside the episode, with its location. */
function* allStrings(value: unknown, path: PropertyKey[] = []): Generator<{ path: PropertyKey[]; value: string }> {
  if (typeof value === "string") {
    yield { path, value };
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) yield* allStrings(value[i], [...path, i]);
  } else if (value && typeof value === "object") {
    for (const [key, inner] of Object.entries(value)) yield* allStrings(inner, [...path, key]);
  }
}

/** Rules that apply to every episode, draft or published. */
function consistencyIssues(episode: Episode): ContentIssue[] {
  const issues: ContentIssue[] = [];
  if (episode.episodeType === "parasha") {
    const expectedOrder = CHUMASH_NAMES.indexOf(episode.chumash) + 1;
    if (episode.chumashOrder !== expectedOrder) {
      issues.push({
        path: "chumashOrder",
        message: `is ${episode.chumashOrder}, but the chumash "${episode.chumash}" is number ${expectedOrder} in Torah order`,
      });
    }
  }
  return issues;
}

/** Extra rules that apply only when published is true. */
function publishedIssues(episode: Episode): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const add = (path: PropertyKey[], message: string) => issues.push({ path: formatPath(path), message });

  if (!YOUTUBE_ID_PATTERN.test(episode.youtubeId)) {
    add(["youtubeId"], "must be the real 11-character YouTube video ID (letters, digits, - and _) in a published episode");
  }
  if (episode.script.length === 0) add(["script"], "must have at least one line in a published episode");
  if (episode.sources.length === 0) add(["sources"], "must have at least one source in a published episode");
  if (episode.gregorianDate === TEMPLATE_PLACEHOLDER_DATE) {
    add(["gregorianDate"], `is still the template placeholder ${TEMPLATE_PLACEHOLDER_DATE}. Write the real date`);
  }

  for (const { path, value } of allStrings(episode)) {
    if (value.includes("TODO")) {
      add(path, 'still contains the placeholder "TODO". Replace it, or set "published" to false');
    }
  }
  episode.script.forEach((line, i) => {
    if (/^[.…\s]+$/.test(line.text)) {
      add(["script", i, "text"], 'is only "..." (a placeholder). Write the real line, or set "published" to false');
    }
  });
  return issues;
}

/**
 * Checks one parsed JSON value. `fileName` is the file it came from, e.g. "haazinu-5787.json".
 * Returns the episode when there are no problems, otherwise every problem found.
 */
export function validateEpisodeData(
  raw: unknown,
  fileName: string,
): { episode: Episode; issues: [] } | { episode: null; issues: ContentIssue[] } {
  const fail = (issues: ContentIssue[]) => ({ episode: null, issues });

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return fail([{ path: "(whole file)", message: "must be one JSON object: it starts with { and ends with }" }]);
  }
  const record = raw as Record<string, unknown>;
  const issues: ContentIssue[] = [];

  if (typeof record.slug === "string" && `${record.slug}.json` !== fileName) {
    issues.push({
      path: "slug",
      message: `is "${record.slug}", so the file must be named "${record.slug}.json", but it is named "${fileName}". Rename the file or fix the slug so they match`,
    });
  }

  if (record.episodeType !== "parasha" && record.episodeType !== "moed") {
    issues.push({ path: "episodeType", message: 'must be exactly "parasha" or "moed"' });
    return fail(issues);
  }

  const parsed = episodeSchema.safeParse(raw);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      issues.push({ path: formatPath(issue.path), message: friendlyMessage(issue) });
    }
    return fail(issues);
  }

  issues.push(...consistencyIssues(parsed.data));
  if (parsed.data.published) issues.push(...publishedIssues(parsed.data));

  return issues.length > 0 ? fail(issues) : { episode: parsed.data, issues: [] };
}
