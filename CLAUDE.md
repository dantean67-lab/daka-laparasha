=== HOW TO TALK TO ME — read this first, it governs everything below ===

I am not a programmer. I have never written code. I ship projects only by
copying what you tell me to copy. Treat me as someone who has never opened
a terminal before.

1. Never say "run X", "install Y", or "set up Z" without giving me the exact,
   complete, copy-pasteable command in its own code block. One command per
   block. If three commands must run in order, give three blocks and number them.

2. After every command, tell me what it looks like when it worked and what it
   looks like when it failed. I cannot tell the difference on my own.

3. For anything in a browser (GitHub, Vercel, settings pages), give me
   click-by-click directions: the exact button text, where it is on screen,
   and what happens after I click. Never say "go to your project settings" —
   say which menu, which tab, which button.

4. Never assume I know what a term means. If you use words like "environment
   variable", "branch", "commit", "dependency", "build", or "deploy", explain
   it in one short sentence the first time.

5. Never give me choices. Decide, and tell me the one thing to do. If there is
   a real tradeoff I must weigh in on, ask one short question with your
   recommended answer marked.

6. My terminal cannot render Hebrew — it shows as boxes or reversed text.
   Write all summaries, explanations and status messages in simple English.
   Hebrew belongs only inside the files themselves.

7. When I need to verify something visually, tell me exactly which URL to
   open, on which device, what to look at, and what "correct" looks like
   versus "broken". I check on a Samsung Galaxy S23 Ultra phone.

8. If I paste an error at you, do not ask me to investigate. Diagnose it
   yourself and give me the exact fix to paste.

9. Stop after each step. In your stop message give me: what you built in plain
   English, a numbered checklist of what to click or look at, and the single
   next thing that happens when I say continue.

If you catch yourself writing an instruction that assumes I already know how
to do something — rewrite it.


=== PROJECT BRIEF: "דקה לפרשה" (Daka LaParasha) — Torah Archive Site ===

BEFORE WRITING ANY CODE: save this entire message as CLAUDE.md in the repo
root, exactly as written, so every future session has full context.


## 1. WHAT THIS IS

A Hebrew, right-to-left, mobile-first website that is the permanent archive
for a weekly one-minute Torah video series called "דקה לפרשה".

Each week a ~1 minute Hebrew video goes up on YouTube Shorts about the weekly
Torah portion, built on classical Jewish sources (Rashi, Talmud, Midrash,
Rambam, Ramban) quoted word-for-word and verified against the original text.

YouTube holds only the video and a truncated description. This site holds the
real asset: the full vocalized (nikud) script plus complete source citations.

YouTube channel: https://www.youtube.com/@DakaLaParasha


## 2. WHO IT IS FOR

- Hebrew-speaking, religiously observant Israeli audience, all ages
- 94% mobile traffic. MOBILE-FIRST IS NOT OPTIONAL.
- They cannot use screens on Shabbat and holidays. This drives the
  "Print for Shabbat" feature.
- Secondary: Google traffic for searches like "פרשת שופטים דבר תורה"


## 3. TECH STACK AND BUDGET

- Next.js (App Router), TypeScript, Tailwind CSS
- Deployed on Vercel Hobby (free)
- No database, no CMS, no authentication, no backend
- Content lives in local JSON files committed to the repo

ZERO BUDGET. Free tiers only: GitHub + Vercel Hobby. No paid services, no
paid APIs, no custom domain. The site lives on the free *.vercel.app
subdomain. Nothing in the code may assume a custom domain.

Load Frank Ruhl Libre and Heebo with next/font/google (Hebrew subset,
self-hosted at build time, no runtime requests to Google).

RENDERING MODE — decide this in step 1:
Do NOT use output: 'export'. Use the default Next.js build on Vercel with
every page prerendered (generateStaticParams, dynamicParams = false). The
homepage regenerates at most once an hour (export const revalidate = 3600)
so the current episode updates without a redeploy. Ensure content files are
readable at runtime on Vercel (outputFileTracingIncludes for content/**).

BASE URL — one source of truth:
lib/site.ts exports SITE_URL, resolved in this order:
  1. process.env.NEXT_PUBLIC_SITE_URL (manual override, e.g. future domain)
  2. "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL (Vercel sets this
     automatically; always the production domain, so preview builds point
     canonicals at production)
  3. http://localhost:3000 (only when not running on Vercel)
If process.env.VERCEL is set and neither 1 nor 2 resolves, fail the build with
a clear error. Never ship localhost URLs. Strip any trailing slash.
metadataBase, canonical URLs, sitemap, robots, Open Graph, JSON-LD and
share/copy links all derive from SITE_URL. Client components receive absolute
URLs as props. Add .env.example documenting NEXT_PUBLIC_SITE_URL.
At the end of every step, grep for hardcoded references to this site's own
domain and remove them. External URLs (YouTube, wa.me) are fine.


## 4. CONTENT MODEL

Folder: /content/parashot/. One JSON file per episode, named {slug}.json.

There are TWO episode types:
- "parasha" — a weekly Torah portion episode
- "moed"    — a holiday or special-occasion episode (not tied to a portion)

Schema:

{
  "slug": "haazinu-5787",
  "episodeType": "parasha",
  "parashaName": "האזינו",
  "parashaNameWithNikud": "הַאֲזִינוּ",
  "chumash": "דברים",
  "chumashOrder": 5,
  "parashaOrder": 53,
  "specialShabbat": "שבת שובה",
  "hebrewDate": "ח' תשרי תשפ\"ז",
  "gregorianDate": "2026-09-19",
  "youtubeId": "REPLACE_WITH_ID",
  "title": "האזינו: הנשר שלוקח את החץ במקומנו",
  "teaser": "יש ציפור אחת שמוכנה לחטוף חץ בשביל הגוזל שלה.",
  "torahReading": "דברים לב, א – לב, נב",
  "haftarah": "הושע יד, ב – י",
  "script": [
    { "type": "opening",   "text": "שַׁבָּת שָׁלוֹם לְכֻלָּם!" },
    { "type": "paragraph", "text": "..." },
    { "type": "quote",     "text": "\"כְּנֶשֶׁר יָעִיר קִנּוֹ... יִשָּׂאֵהוּ עַל אֶבְרָתוֹ\"" },
    { "type": "paragraph", "text": "..." },
    { "type": "message",   "text": "וְכָאן הַמֶּסֶר שֶׁלָּנוּ: ..." },
    { "type": "closing",   "text": "שַׁבָּת שָׁלוֹם וּגְמַר חֲתִימָה טוֹבָה!" }
  ],
  "sources": [
    {
      "citation": "דברים לב, יא",
      "quote": "כְּנֶשֶׁר יָעִיר קִנּוֹ עַל גּוֹזָלָיו יְרַחֵף יִפְרֹשׂ כְּנָפָיו יִקָּחֵהוּ יִשָּׂאֵהוּ עַל אֶבְרָתוֹ",
      "note": "",
      "link": ""
    },
    {
      "citation": "רש\"י דברים לב, יא",
      "quote": "אבל הנשר אינו ירא אלא מן החץ, לפיכך נושאן על כנפיו, אומר מוטב שיכנס החץ בי ולא יכנס בבני",
      "note": "ומקורו במכילתא ובספרי",
      "link": ""
    }
  ],
  "calendarNotes": [
    "שבת שובה — השבת שבין ראש השנה ליום כיפור",
    "יום כיפור: יום שני, 21.9.2026"
  ]
}

For episodeType "moed":
- parashaName holds the occasion name (e.g. "ערב יום כיפור")
- parashaNameWithNikud holds its vocalized form
- chumash, chumashOrder, parashaOrder, torahReading, haftarah are null
- specialShabbat is null
- everything else is identical

gregorianDate = the date the episode is ABOUT (the Shabbat for a parasha,
the occasion date for a moed). Not the upload date.

Render script "type" values differently:
- "opening" / "closing" — bold
- "quote" — indented, slightly larger, with a subtle gold border on the
  right (RTL start side)
- "message" — subtly emphasized; this is the takeaway line
- "paragraph" — normal

Also create /content/parashot/_TEMPLATE.json — an empty copy with every field
present and clear placeholder values, plus a second variant showing the moed
shape, so I can copy it each week.


## 5. PAGES AND ROUTES

### / — Homepage
- Site title and one-line description
- THE CURRENT EPISODE, prominently: video, title, teaser, full script, sources
- CURRENT EPISODE RULE: the episode with the EARLIEST gregorianDate that is
  >= today. If there is none, the episode with the LATEST gregorianDate.
  "today" = the current date in Asia/Jerusalem, never the server's UTC date.
  Rationale: videos go up BEFORE the date they are about. A "most recent date
  <= today" rule would show last week's episode on Friday, which is exactly
  when people print for Shabbat.
- Below it: a compact list of the 3–4 previous episodes with links
- Link to the full archive

### /parasha/[slug] — Episode page (the core page)
Top to bottom:
1. Breadcrumb: בית / דברים / האזינו   (for moed: בית / מועדים / ערב יום כיפור)
2. Name (large, with nikud), specialShabbat label if present, Hebrew date
3. YouTube video — a lightweight click-to-play facade (thumbnail + play
   button) that loads the youtube-nocookie.com iframe only on tap.
   Responsive, 9:16 for Shorts, max-height ~70vh so it does not dominate
   on mobile.
4. Action row: "להדפסה לשבת" button, WhatsApp share, copy-link
5. Full script with nikud, generous line-height
6. "המקורות" — each source as citation + quote + optional note
7. "מתוך הלוח" — calendarNotes as a simple list
8. Prev/next navigation, CHRONOLOGICAL by gregorianDate (not parashaOrder)

### /parasha/[slug]/print — Print for Shabbat (CRITICAL FEATURE)
A completely clean page: no navigation, no video, no buttons, no share icons,
no footer chrome. Just the name, Hebrew date, full script, and sources.
Serif font, black on white, generous margins. Include @media print CSS that
strips anything remaining and sets clean page margins. Small footer line:
"דקה לפרשה · youtube.com/@DakaLaParasha". Should fit one A4 page where possible.
@media print always forces the light tokens regardless of the active theme.

### /archive — Full archive
Grouped by chumash in Torah order: בראשית, שמות, ויקרא, במדבר, דברים —
then a final group "מועדים וזמנים" for episodeType "moed", ordered by
gregorianDate. Within each chumash: ordered by parashaOrder, then gregorianDate.
Each entry: name, specialShabbat if any, title, date.
A client-side text search box filtering by name, title, or source citation.
No server, no API.

### /about — Minimal
Two short paragraphs: what the series is, and the commitment that every source
is verified word-for-word against the original. Link to the YouTube channel.
NOTHING ELSE. No contact form. No personal details about the creator —
no age, no school, no full name.


## 6. HEBREW AND RTL — READ CAREFULLY, THIS IS WHERE THIS PROJECT FAILS

- <html lang="he" dir="rtl"> globally, not per-component
- Use Tailwind logical properties (ms-*, me-*, ps-*, pe-*, text-start,
  text-end) rather than left/right
- ALL body text is Hebrew WITH NIKUD. Most web fonts render nikud badly —
  marks collide with letters or sit at wrong heights.
- Frank Ruhl Libre for all script and body text — it is designed for Hebrew
  with nikud. Heebo for UI chrome only (nav, buttons, labels) — never for
  vocalized text.
- Line-height for vocalized Hebrew: minimum 2.0, ideally 2.1–2.2. Nikud sits
  below the baseline and collides with the line above at normal line-height.
- Body font-size minimum 19px on mobile, 21px preferred.
- NEVER use letter-spacing on Hebrew — it breaks nikud positioning.
- Test with this exact string, which has difficult nikud combinations:
  "וְהַגְּמָרָא דּוֹרֶשֶׁת: כְּשֶׁהוּא חָל בְּחֹל"
- Numbers and Latin text inside Hebrew sentences: wrap in
  <span dir="ltr" class="inline-block"> to prevent reordering
- Ensure Hebrew quotation marks are not auto-converted to Latin curly quotes,
  which render on the wrong side

HEBREW TEXT INTEGRITY — absolute rule:
Copy every Hebrew quote in this brief character-for-character. Never retype,
"correct", re-vocalize, or normalize Hebrew text. These sources are verified
word-for-word against the originals and any change breaks that guarantee.


## 7. DESIGN

Warm, calm, serious. Not childish, not flashy. Should match the channel's
YouTube banner: warm parchment tones, deep navy, muted gold.

Light tokens:
  --bg: #faf8f4      --card: #ffffff    --text: #26211c
  --muted: #8a8378   --line: #e8e2d8    --accent: #1e3a5f   --gold: #b8934a

Dark tokens:
  --bg: #1c1a17      --card: #26231f    --text: #f0ece5
  --muted: #9a9284   --line: #3a362f    --accent: #8fb3d9   --gold: #c9a862

THEMING MECHANICS:
- Tokens are CSS variables on :root. Dark values apply via
  prefers-color-scheme and are overridden by data-theme="light" / "dark"
  on <html>. Expose the tokens to Tailwind as theme colors.
- Components NEVER use dark: variants. Switching theme only swaps variables.
- The manual toggle is stored in localStorage and applied by a tiny inline
  script in <head> before first paint, so there is no flash of the wrong
  theme. Use suppressHydrationWarning on <html>.

LAYOUT:
- Max content width 680px, centered
- Cards: 1px border, 14px radius
- Generous vertical rhythm — this is reading material, not a dashboard
- Sticky minimal header: site name on the right (RTL), archive link on the left
- No hero images, no sliders, no animation beyond subtle hover states


## 8. SEO — A PRIMARY GOAL

The reason this site exists is to be findable in Google for Hebrew
Torah-portion searches.

- Per-page title: "פרשת האזינו | דבר תורה קצר | דקה לפרשה"
- Per-page meta description from the teaser field
- Open Graph and Twitter cards.
  og:image = https://i.ytimg.com/vi/{youtubeId}/hqdefault.jpg
  (NOT maxresdefault — it is not guaranteed to exist, especially for Shorts)
- JSON-LD VideoObject on each episode page: name, description, thumbnailUrl,
  uploadDate, embedUrl, inLanguage: "he"
- Auto-generate /sitemap.xml from the content files
- Auto-generate /robots.txt allowing everything
- Semantic HTML: one <h1> per page, proper heading hierarchy, <article>,
  <time datetime=""> for dates
- Canonical URLs on every page
- Transliterated Latin slugs for link-sharing reliability


## 9. FEATURES

BUILD:
- "להדפסה לשבת" — links to /print, opens in a new tab
- WhatsApp share — https://wa.me/?text={encoded title + url}
  (WhatsApp is the dominant sharing channel in Israel)
- Copy link to clipboard, with a brief "הועתק!" confirmation
- Prev/next episode navigation
- Client-side search on /archive
- Dark mode following system preference, plus the manual toggle

DO NOT BUILD:
- Comments, likes, or any user-generated content
- Newsletter signup or email collection
- Contact form
- Analytics beyond optionally Vercel's built-in
- Login or accounts
- A blog
- Social media feeds
- Any personal details about the creator


## 10. INITIAL CONTENT

Create exactly these twelve files in /content/parashot/, and no others:

  PARASHOT (episodeType: "parasha")
    pinchas-5786.json
    matot-masei-5786.json
    devarim-5786.json
    vaetchanan-5786.json
    eikev-5786.json
    reeh-5786.json
    shoftim-5786.json
    ki-tavo-5786.json
    nitzavim-vayelech-5786.json
    haazinu-5787.json

  MOADIM (episodeType: "moed")
    rosh-hashana-5787.json
    erev-yom-kippur-5787.json

Slug format is {name}-{hebrewYear}. This prevents collisions when the same
parasha comes around again next year.

Ki Teitzei is deliberately absent — there is no episode for it. Do not create
a placeholder, do not leave a gap marker, and do not mention it in the UI.
The archive simply does not list it.

Every file except haazinu-5787.json gets clearly marked placeholder text in
the script and sources arrays, which I will fill in later. Fully populate
haazinu-5787.json as the end-to-end rendering test case, using the sources
exactly as written in section 4 above, plus:

  - שמות יט, ד — "וָאֶשָּׂא אֶתְכֶם עַל כַּנְפֵי נְשָׁרִים"
  - הושע יד, ב — "שׁוּבָה יִשְׂרָאֵל עַד ה' אֱלֹקֶיךָ"

Plus the empty _TEMPLATE.json.

VALIDATION: validate every content file at build time with zod. On error, fail
the build with a message naming the file and the field. A failed Vercel build
never replaces the live site, so this is a safety net, not an inconvenience.


## 11. DOCUMENTATION

Write README.md IN HEBREW, aimed at a non-programmer. Wrap the whole thing in
<div dir="rtl"> with blank lines around the markdown so GitHub renders it
right-to-left. It must cover:
- How to add a new episode each week, step by step (copy _TEMPLATE.json,
  rename, fill fields, commit, push — done)
- Where to find a YouTube video ID
- What each JSON field means, and which are required vs optional
- The difference between a "parasha" and a "moed" episode
- How to run the site locally
- How to deploy to Vercel
- Troubleshooting: nikud looks broken, new episode does not appear on the
  homepage, video will not embed


## 12. BUILD ORDER

 1. Project setup, fonts, RTL base, design tokens, dark mode with manual
    toggle, lib/site.ts, .env.example, CLAUDE.md
 2. I connect the repo to Vercel myself, so every later step is checkable
    on a real URL on my phone
 3. Content loading from JSON + TypeScript types + zod validation
 4. Episode page (/parasha/[slug]) — get this perfect, it is the core page
 5. Print page (/parasha/[slug]/print)
 6. Homepage with current-episode logic
 7. Archive page with search
 8. SEO: metadata, JSON-LD, sitemap, robots
 9. About page
10. README in Hebrew
11. Final checks

STOP AFTER EVERY STEP and wait for my approval.


## STEP 1 — DO THIS NOW

Scope: project setup, fonts, RTL base, design tokens, dark mode with manual
toggle, lib/site.ts, .env.example, CLAUDE.md.

For my approval, make the temporary homepage a style specimen (step 6
replaces it). It should show:
- The sticky header
- One card
- The test string from section 6, styled as a script paragraph
- The Deuteronomy 32:11 verse from section 4, styled as a script paragraph
- One quote block with the gold border
- One "message" line
- UI buttons in Heebo
- The working theme toggle

Then run the build and fix everything until it passes with no errors.
Commit and push to main.

Then STOP. End with a short summary in simple English — my terminal cannot
display Hebrew — and a numbered checklist of what to look at on my phone.


=== AMENDMENTS — added after a review. Where anything above conflicts, these win. ===

A1. DRAFTS
- Add a required boolean field "published" to the schema and to both templates.
- published: false = draft. A draft page is still built at its URL so I can preview it, but it gets <meta name="robots" content="noindex">, shows a visible "טיוטה" banner at the top, and hides the video if youtubeId is not a real ID. Drafts are left out of everything else: the homepage and the current-episode rule, the archive and its search, prev/next, and the sitemap.
- Validation is relaxed for drafts and strict for published episodes: youtubeId must match ^[A-Za-z0-9_-]{11}$, script and sources must not be empty, no string in the file may contain "TODO", and no script line may consist only of "..." (the placeholder style of section 4).
- In drafts: title, teaser, youtubeId, script, sources and calendarNotes are placeholders containing "TODO". The names, episodeType and every value from the A2 table are real.
- Initial state: haazinu-5787 is published: true. The other eleven are published: false.
- haazinu-5787: youtubeId is 6Fl9njt76gY (https://www.youtube.com/shorts/6Fl9njt76gY), and its full script is in A10.
- If no episode is published, the homepage shows the site title, the description and the archive link, and nothing breaks.

A2. EXACT METADATA — use these values. Do not compute dates or orders yourself.
Israeli reading schedule. For a combined parasha, parashaOrder is the first one's.
haftarah: "TODO" in the nine parasha drafts; null in the two moed files.

slug                   | chumash | chumashOrder | parashaOrder | specialShabbat | hebrewDate     | gregorianDate | torahReading
pinchas-5786           | במדבר   | 4 | 41 | null     | י"ט תמוז תשפ"ו | 2026-07-04 | במדבר כה, י – ל, א
matot-masei-5786       | במדבר   | 4 | 42 | null     | כ"ו תמוז תשפ"ו | 2026-07-11 | במדבר ל, ב – לו, יג
devarim-5786           | דברים   | 5 | 44 | שבת חזון | ד' אב תשפ"ו    | 2026-07-18 | דברים א, א – ג, כב
vaetchanan-5786        | דברים   | 5 | 45 | שבת נחמו | י"א אב תשפ"ו   | 2026-07-25 | דברים ג, כג – ז, יא
eikev-5786             | דברים   | 5 | 46 | null     | י"ח אב תשפ"ו   | 2026-08-01 | דברים ז, יב – יא, כה
reeh-5786              | דברים   | 5 | 47 | null     | כ"ה אב תשפ"ו   | 2026-08-08 | דברים יא, כו – טז, יז
shoftim-5786           | דברים   | 5 | 48 | null     | ב' אלול תשפ"ו  | 2026-08-15 | דברים טז, יח – כא, ט
ki-tavo-5786           | דברים   | 5 | 50 | null     | ט"ז אלול תשפ"ו | 2026-08-29 | דברים כו, א – כט, ח
nitzavim-vayelech-5786 | דברים   | 5 | 51 | null     | כ"ג אלול תשפ"ו | 2026-09-05 | דברים כט, ט – לא, ל
haazinu-5787           | as written in section 4
rosh-hashana-5787      | moed: hebrewDate א' תשרי תשפ"ז, gregorianDate 2026-09-12, all parasha-only fields null
erev-yom-kippur-5787   | moed: hebrewDate ט' תשרי תשפ"ז, gregorianDate 2026-09-20, all parasha-only fields null

A3. FILES AND LOADER
- "Exactly these twelve files" means twelve episode files. Also create two templates: _TEMPLATE.json (parasha shape) and _TEMPLATE-moed.json (moed shape), both published: false.
- The content loader ignores every file whose name starts with "_".
- The build fails with a clear message (the file name, and for broken JSON the line number) if a file is not valid JSON, fails validation, or is not named {slug}.json.

A4. TITLES
- Moed pages: <title> is "{parashaName} | דבר תורה קצר | דקה לפרשה". Never put "פרשת" before a moed name anywhere.
- Episode page: show the "title" field as a subtitle directly under the name.

A5. PRINT
- The "להדפסה לשבת" button opens /parasha/[slug]/print?auto=1 in a new tab. With ?auto=1 the page waits for document.fonts.ready (so the nikud prints in Frank Ruhl Libre, not a fallback font), calls window.print() once, then removes ?auto=1 from the address bar with history.replaceState, so a reload or a shared link does not trigger it again.
- The print page also shows one screen-only "הדפסה" button, hidden in @media print. Nothing else is added.
- Print pages get robots noindex, a canonical pointing to the episode page, and are left out of the sitemap.

A6. READABILITY
- Light --muted is #6f685e, not #8a8378. The original is about 3.5:1 against --bg; body text needs at least 4.5:1, and many readers are older.
- --gold is for borders and decoration only, never for text.

A7. SMALL FIXES
- Archive search: normalize both the query and the data before matching — remove nikud and cantillation marks, remove quote marks (" ' ״ ׳), treat maqaf and hyphens as spaces — so typing רשי finds רש"י.
- Video thumbnail: it must look sharp on a high-density phone screen. In hqdefault.jpg a vertical Short is pillarboxed and only about 200px wide, so stretching it to fill the 9:16 box looks blurry. With the real haazinu ID, check which larger thumbnails YouTube actually serves for Shorts (YouTube's own page for this Short points to maxresdefault.jpg, so start there), use the sharpest one, and fall back to hqdefault.
- In haazinu-5787.json, set haftarah to exactly: הושע יד, ב – י (ומוסיפים יואל או מיכה, לפי המנהג)

A8. README — WEEKLY FLOW
- The "add a new episode" steps use the GitHub website only (no terminal, no git commands) and must work from a phone browser: open the repo, go into content/parashot, Add file, Create new file, type the file name, paste, Commit changes, then wait about a minute for Vercel.
- Explain that a double quote inside a JSON text value must be written as \" (for example רש\"י), and that a broken file only fails the build — the live site stays as it was.

A9. STEP ORDER AND FINISH
- I can only check on my phone once the site is on Vercel. So at the end of step 1, after pushing, give me click-by-click instructions to import the repo into Vercel (this is step 2), and write the phone checklist for the resulting vercel.app address. If that address contains random letters, include how to change it to a clean one in Vercel before I share it anywhere.
- In step 11, give me click-by-click instructions to verify the site in Google Search Console (free, HTML-tag method; the tag's value lives in lib/site.ts) and to submit /sitemap.xml.

A10. HAAZINU-5787 SCRIPT — replaces the placeholder script in section 4.
Ten lines, in this order. Each line is: type | text. Copy the text character-for-character — never retype, re-vocalize or "fix" it; only escape double quotes when writing the JSON. The "..." inside the quote line is part of the text (an abbreviated verse), not a placeholder.

opening | שַׁבָּת שָׁלוֹם לְכֻלָּם!
paragraph | הַשַּׁבָּת נִקְרֵאת "שַׁבָּת שׁוּבָה" – הַשַּׁבָּת הַיְּחִידָה שֶׁבֵּין רֹאשׁ הַשָּׁנָה לְיוֹם כִּיפּוּר, עַל שֵׁם פְּתִיחַת הַהַפְטָרָה: "שׁוּבָה יִשְׂרָאֵל עַד ה' אֱלֹקֶיךָ".
paragraph | וּבְפָרָשַׁת הַאֲזִינוּ מִסְתַּתֶּרֶת תְּמוּנָה אַחַת שֶׁאוֹמֶרֶת הַכֹּל:
quote | "כְּנֶשֶׁר יָעִיר קִנּוֹ... יִשָּׂאֵהוּ עַל אֶבְרָתוֹ".
paragraph | רַשִׁ"י מְגַלֶּה מָה מְיֻחָד בַּנֶּשֶׁר: כָּל הָעוֹפוֹת נוֹשְׂאִים אֶת גּוֹזָלֵיהֶם בֵּין רַגְלֵיהֶם – כִּי הֵם פּוֹחֲדִים מֵעוֹף שֶׁעָף מֵעֲלֵיהֶם. אֲבָל הַנֶּשֶׁר עָף גָּבוֹהַּ מִכֻּלָּם. אֵין אַף אֶחָד מֵעָלָיו. הוּא מְפַחֵד רַק מִדָּבָר אֶחָד: מֵחֵץ שֶׁיָּבוֹא מִלְּמַטָּה.
paragraph | וְאָז הוּא עוֹשֶׂה מַשֶּׁהוּ מַדְהִים: הוּא שָׂם אֶת הַגּוֹזָל עַל הַכְּנָפַיִם. וְאוֹמֵר: "מוּטָב שֶׁיִּכָּנֵס הַחֵץ בִּי – וְלֹא בִּבְנִי".
paragraph | וְרַשִׁ"י מוֹסִיף: כָּךְ בְּדִיּוּק נָשָׂא אוֹתָנוּ הַקָּדוֹשׁ בָּרוּךְ הוּא בִּיצִיאַת מִצְרַיִם – "וָאֶשָּׂא אֶתְכֶם עַל כַּנְפֵי נְשָׁרִים".
message | וְכָאן הַמֶּסֶר שֶׁלָּנוּ: אֲנַחְנוּ בְּתוֹךְ עֲשֶׂרֶת יְמֵי תְּשׁוּבָה, וְקַל מְאוֹד לְהַרְגִּישׁ רַק נִשְׁפָּטִים וּמְפֻחָדִים. הַפָּרָשָׁה מַזְכִּירָה לָנוּ מִי הַשּׁוֹפֵט: זֶה שֶׁשָּׂם אוֹתָנוּ עַל הַכְּנָפַיִם שֶׁלּוֹ, וְקִבֵּל אֶת הַחֵץ בִּמְקוֹמֵנוּ.
paragraph | יוֹם כִּיפּוּר נִכְנָס כְּבָר בְּיוֹם רִאשׁוֹן בָּעֶרֶב. עַד אָז – בַּקָּשַׁת סְלִיחָה אַחַת, מֵאָדָם אֶחָד. זֶה הַצַּעַד חֲזָרָה אֶל הַכְּנָפַיִם.
closing | שַׁבָּת שָׁלוֹם וּגְמַר חֲתִימָה טוֹבָה!
