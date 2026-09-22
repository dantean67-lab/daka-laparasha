/**
 * Shared by the archive page's client-side search box. Runs in the browser, so it must not
 * import anything server-only.
 *
 * Normalizes Hebrew text so a plain-typed query matches text written with nikud, gershayim,
 * or a maqaf: strips nikud/cantillation marks, strips quote marks, and treats a maqaf or a
 * hyphen as a space (so "רשי" finds "רש\"י").
 */
const NIKUD_AND_CANTILLATION = /[֑-ׇ]/g;
const QUOTE_MARKS = /["'׳״]/g;
const MAQAF_OR_HYPHEN = /[־-]/g;

export function normalizeForSearch(text: string): string {
  return text
    .replace(NIKUD_AND_CANTILLATION, "")
    .replace(QUOTE_MARKS, "")
    .replace(MAQAF_OR_HYPHEN, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
