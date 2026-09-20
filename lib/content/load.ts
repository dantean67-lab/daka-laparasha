/**
 * Reads every episode file from a folder and checks it.
 * Runs on the server / at build time only (it uses the file system). Never import it
 * from a client component.
 *
 * Rules:
 *   - Files whose name starts with "_" (the templates) or "." are ignored.
 *   - Every other file must be named {slug}.json, contain valid JSON, and pass validation.
 *   - If anything is wrong, ONE error is thrown that lists every problem in every file.
 */
import fs from "node:fs";
import path from "node:path";
import { validateEpisodeData, type ContentIssue, type Episode } from "./schema";

export const CONTENT_DIR = path.join(process.cwd(), "content", "parashot");

export type FileIssues = { file: string; issues: ContentIssue[] };

export class ContentError extends Error {
  readonly problems: FileIssues[];

  constructor(problems: FileIssues[]) {
    super(formatProblems(problems));
    this.name = "ContentError";
    this.problems = problems;
  }
}

function formatProblems(problems: FileIssues[]): string {
  const count = problems.reduce((n, p) => n + p.issues.length, 0);
  const lines = [
    "",
    `CONTENT ERROR: ${count} problem(s) in ${problems.length} episode file(s). The site was NOT built.`,
    "The live site is unchanged. Fix the file(s) below and commit again.",
    "",
  ];
  for (const { file, issues } of problems) {
    lines.push(`  content/parashot/${file}`);
    for (const issue of issues) lines.push(`    - ${issue.path}: ${issue.message}`);
    lines.push("");
  }
  return lines.join("\n");
}

/** Turns a JSON syntax error into a message with the line number. */
function describeJsonError(error: unknown, source: string): ContentIssue {
  const message = error instanceof Error ? error.message : String(error);
  const lineInfo = /\(line (\d+) column (\d+)\)/.exec(message);
  const position = /position (\d+)/.exec(message);
  let where = "";
  if (lineInfo) {
    where = `line ${lineInfo[1]}, column ${lineInfo[2]}`;
  } else if (position) {
    const line = source.slice(0, Number(position[1])).split("\n").length;
    where = `line ${line}`;
  }
  return {
    path: where || "(whole file)",
    message:
      `the file is not valid JSON (${message}). ` +
      'Common causes: a double quote (") inside a text must be written as \\" ; ' +
      "a missing or extra comma; a missing closing quote, bracket or brace",
  };
}

export function loadEpisodesFromDir(dir: string): Episode[] {
  const problems: FileIssues[] = [];
  const episodes: Episode[] = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;

    if (!entry.isFile()) {
      problems.push({ file: entry.name, issues: [{ path: "(folder)", message: "folders are not allowed here; only {slug}.json files" }] });
      continue;
    }
    if (!entry.name.endsWith(".json")) {
      problems.push({
        file: entry.name,
        issues: [{ path: "(file name)", message: 'every episode file must be named {slug}.json, for example "haazinu-5787.json". (Files starting with _ are ignored)' }],
      });
      continue;
    }

    // A leading byte-order mark (added by some Windows editors) is not part of the content.
    const source = fs.readFileSync(path.join(dir, entry.name), "utf8").replace(/^﻿/, "");
    let data: unknown;
    try {
      data = JSON.parse(source);
    } catch (error) {
      problems.push({ file: entry.name, issues: [describeJsonError(error, source)] });
      continue;
    }

    const result = validateEpisodeData(data, entry.name);
    if (result.episode) episodes.push(result.episode);
    else problems.push({ file: entry.name, issues: result.issues });
  }

  if (problems.length > 0) throw new ContentError(problems);
  return episodes;
}
