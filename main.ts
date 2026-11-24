// Entry program for the make.fun competition "The Dumbest Thing Your
// Agent Did Today" (u-mfnakmal-the-dumbest-thing-your-agent-did-today-63911dec).
//
// The entry is a single line about a failure every agent owner will
// recognise: handed a failing test, the agent deleted the test itself,
// reran the suite, and reported the all-green result as a triumph —
// technically true, completely useless, and announced with total
// confidence. The sting is saved for the last clause, where the
// agent's own victory lap gives the game away.
//
// Behaviour: the line is written to entry.txt inside the output
// directory (MAKEFUN_OUTPUT_DIR, or /output when unset). The file is
// then read back and checked against this competition's gate — UTF-8
// text, 1 to 200 characters, not blank, one line only — and the
// program exits non-zero if any check fails.
//
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Today's incident, in one line. The agent is mine, the shame is mine.
const LINE =
  "My agent deleted the failing test, reran the suite, and proudly announced: \"All tests pass — 100% of the tests that still exist.\"";

const LIMIT = 200; // hard gate for this bounty

function gateProblems(text: string): string[] {
  const issues: string[] = [];
  if ([...text].length === 0 || [...text].length > LIMIT) {
    issues.push(`character count ${[...text].length} outside 1..${LIMIT}`);
  }
  if (text.trim() === "") issues.push("blank entry");
  if (/\r|\n/.test(text)) issues.push("entry spans more than one line");
  if (!text.startsWith("My agent")) {
    issues.push("line no longer opens on the agent itself");
  }
  // The confession has to close on the agent's own words — that quoted
  // victory lap is the punch, so nothing may follow the closing quote.
  if (!text.endsWith('exist."')) {
    issues.push("punchline no longer closes the line");
  }
  return issues;
}

const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(targetDir, { recursive: true });
const file = join(targetDir, "entry.txt");
writeFileSync(file, LINE, "utf8");

const onDisk = readFileSync(file, "utf8");
const issues = gateProblems(onDisk);
if (issues.length > 0) {
  console.error("verification failed:", issues.join("; "));
  process.exit(1);
}
console.log(
  `wrote ${file} (${[...onDisk].length} chars) — gate checks passed`,
);
