import Link from "next/link";

import { archiveSummaries } from "@/content/homepage";

/**
 * Editorial archive index — replaces the old year cards. Rows with typography
 * and hairline dividers (not cards), each linking to the corresponding gallery
 * year anchor. Year, count and the existing year summary come straight from the
 * data; no new descriptive copy is invented.
 */
export function ArchiveIndex() {
  return (
    <section className="home-archive" aria-labelledby="home-archive-heading">
      <h2 id="home-archive-heading" className="home-archive-heading">
        Archive
      </h2>
      <ul className="archive-list">
        {archiveSummaries.map((summary) => (
          <li key={summary.year} className="archive-row">
            <Link
              className="archive-row-link"
              href={`/gallery#year-${summary.year}`}
              aria-label={`${summary.year}, ${summary.count} works`}
            >
              <span className="archive-year">{summary.year}</span>
              <span className="archive-count">{summary.count} works</span>
              <span className="archive-story">{summary.story}</span>
              <span className="archive-cue" aria-hidden="true">
                View
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
