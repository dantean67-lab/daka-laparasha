import Ltr from "@/components/Ltr";
import ScriptBlock from "@/components/ScriptBlock";
import ThemeToggle from "@/components/ThemeToggle";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// The homepage is rebuilt at most once an hour, so the "current episode" (step 6)
// changes without a new deploy.
export const revalidate = 3600;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-ui mt-10 mb-3 text-sm text-muted" dir="ltr">
      {children}
    </p>
  );
}

// TEMPORARY style specimen. Step 6 replaces this page with the real homepage.
export default function HomePage() {
  return (
    <main className="mx-auto max-w-[680px] px-5 py-10">
      <h1 className="text-4xl">{SITE_NAME}</h1>
      <p className="mt-2">{SITE_DESCRIPTION}</p>

      <Label>1. Card + script text (Frank Ruhl Libre, nikud)</Label>
      <article className="rounded-[14px] border border-line bg-card p-5 sm:p-8">
        <h2 className="text-3xl">הַאֲזִינוּ</h2>
        <p className="font-ui text-base text-muted">
          שבת שובה · <time dateTime="2026-09-19">ח' תשרי תשפ"ז</time>
        </p>

        <div className="mt-6 space-y-4">
          <ScriptBlock type="opening" text="שַׁבָּת שָׁלוֹם לְכֻלָּם!" />
          <ScriptBlock type="paragraph" text="וְהַגְּמָרָא דּוֹרֶשֶׁת: כְּשֶׁהוּא חָל בְּחֹל" />
          <ScriptBlock
            type="paragraph"
            text="כְּנֶשֶׁר יָעִיר קִנּוֹ עַל גּוֹזָלָיו יְרַחֵף יִפְרֹשׂ כְּנָפָיו יִקָּחֵהוּ יִשָּׂאֵהוּ עַל אֶבְרָתוֹ"
          />
          <ScriptBlock type="quote" text={'"כְּנֶשֶׁר יָעִיר קִנּוֹ... יִשָּׂאֵהוּ עַל אֶבְרָתוֹ"'} />
          <ScriptBlock type="message" text="וְכָאן הַמֶּסֶר שֶׁלָּנוּ: ..." />
          <ScriptBlock type="closing" text="שַׁבָּת שָׁלוֹם וּגְמַר חֲתִימָה טוֹבָה!" />
        </div>

        <p className="mt-6 border-t border-line pt-4">
          יום כיפור: יום שני, <Ltr>21.9.2026</Ltr>
        </p>
      </article>

      <Label>2. Buttons + theme toggle (Heebo)</Label>
      <div className="font-ui flex flex-wrap gap-3">
        <button
          type="button"
          className="min-h-11 cursor-pointer rounded-[14px] bg-accent px-5 text-base font-medium text-on-accent transition-opacity hover:opacity-90"
        >
          להדפסה לשבת
        </button>
        <button
          type="button"
          className="min-h-11 cursor-pointer rounded-[14px] border border-line bg-card px-5 text-base font-medium text-text transition-colors hover:border-gold"
        >
          שיתוף בוואטסאפ
        </button>
        <ThemeToggle showLabel />
      </div>
    </main>
  );
}
