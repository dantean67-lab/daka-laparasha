/**
 * Checks every episode file. Runs automatically before every build (see "build" in package.json)
 * and can be run by hand with: npm run validate
 * Exits with an error (so the build stops) if anything is wrong.
 */
import { CONTENT_DIR, ContentError, loadEpisodesFromDir } from "../lib/content/load";

try {
  const episodes = loadEpisodesFromDir(CONTENT_DIR);
  const published = episodes.filter((e) => e.published).length;
  console.log(`Content OK: ${episodes.length} episode file(s) checked (${published} published, ${episodes.length - published} draft).`);
} catch (error) {
  if (error instanceof ContentError) {
    console.error(error.message);
  } else {
    console.error("Could not read the content folder:", error);
  }
  process.exit(1);
}
