/**
 * Small checks for the content validation rules in lib/content/schema.ts that are easy
 * to break by accident. Run by hand with: npm test
 * No test framework needed: plain Node assertions, run through tsx like the other scripts.
 */
import assert from "node:assert/strict";
import { validateEpisodeData } from "../lib/content/schema";

let passed = 0;
function check(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

// A minimal but fully valid PUBLISHED parasha episode, used as a base for each test below.
function validPublishedEpisode(): Record<string, unknown> {
  return {
    slug: "test-parasha-5786",
    episodeType: "parasha",
    published: true,
    parashaName: "בְּדִיקָה",
    parashaNameWithNikud: "בְּדִיקָה",
    chumash: "דברים",
    chumashOrder: 5,
    parashaOrder: 44,
    specialShabbat: null,
    hebrewDate: "א' תשרי תשפ\"ו",
    gregorianDate: "2026-09-19",
    youtubeId: "abcdefghijk",
    title: "כותרת",
    teaser: "תקציר",
    torahReading: "דברים א, א",
    haftarah: "ישעיהו א, א",
    script: [
      { type: "opening", text: "שַׁבָּת שָׁלוֹם" },
      { type: "closing", text: "שַׁבָּת שָׁלוֹם" },
    ],
    sources: [{ citation: "דברים א, א", quote: "אֵלֶּה הַדְּבָרִים", note: "", link: "" }],
    calendarNotes: [],
  };
}

console.log("content schema: script placeholder rule (A1)");

check("a fully valid published episode passes", () => {
  const result = validateEpisodeData(validPublishedEpisode(), "test-parasha-5786.json");
  assert.equal(result.episode !== null, true, `expected no issues, got: ${JSON.stringify((result as { issues: unknown }).issues)}`);
});

check('a published episode is rejected when a script line is only "..."', () => {
  const data = validPublishedEpisode();
  (data.script as { type: string; text: string }[]).push({ type: "paragraph", text: "..." });
  const result = validateEpisodeData(data, "test-parasha-5786.json");
  assert.equal(result.episode, null, "expected the episode to be rejected");
  const issues = (result as { issues: { path: string; message: string }[] }).issues;
  assert.equal(
    issues.some((i) => i.path === "script[2].text" && i.message.includes("placeholder")),
    true,
    `expected a placeholder issue for script[2].text, got: ${JSON.stringify(issues)}`,
  );
});

check('a published episode is rejected when a script line is only an ellipsis character "…"', () => {
  const data = validPublishedEpisode();
  (data.script as { type: string; text: string }[]).push({ type: "paragraph", text: "…" });
  const result = validateEpisodeData(data, "test-parasha-5786.json");
  assert.equal(result.episode, null, "expected the episode to be rejected");
});

check('a draft episode (published: false) is NOT rejected for a "..." script line', () => {
  const data = validPublishedEpisode();
  data.published = false;
  (data.script as { type: string; text: string }[]).push({ type: "paragraph", text: "..." });
  const result = validateEpisodeData(data, "test-parasha-5786.json");
  assert.equal(result.episode !== null, true, "drafts must not be held to the published placeholder rule");
});

check('a real script line that merely starts with "..." is NOT rejected', () => {
  const data = validPublishedEpisode();
  (data.script as { type: string; text: string }[]).push({ type: "paragraph", text: "...וְהִנֵּה זֶה טֶקְסְט אֲמִתִּי" });
  const result = validateEpisodeData(data, "test-parasha-5786.json");
  assert.equal(result.episode !== null, true, "a line that only starts with the placeholder pattern should still pass");
});

console.log(`\n${passed} test(s) passed.`);
