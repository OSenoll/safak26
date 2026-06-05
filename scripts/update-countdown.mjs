import { appendFileSync, writeFileSync } from "node:fs";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const endDate = process.env.END_DATE ?? "2026-07-01";
const timeZone = process.env.TIME_ZONE ?? "Europe/Istanbul";

function localDateParts(date, zone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
}

function parseIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new Error(`END_DATE must be YYYY-MM-DD, got: ${value}`);
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function dateKey({ year, month, day }) {
  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

function utcMidnight({ year, month, day }) {
  return Date.UTC(year, month - 1, day);
}

function setOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

const today = localDateParts(new Date(), timeZone);
const end = parseIsoDate(endDate);
const daysLeft = Math.ceil((utcMidnight(end) - utcMidnight(today)) / MS_PER_DAY);

setOutput("days_left", String(daysLeft));

if (daysLeft < 0) {
  setOutput("should_commit", "false");
  console.log("Countdown finished. No update needed.");
  process.exit(0);
}

const status =
  daysLeft === 0
    ? "I return from military service today."
    : `${daysLeft} days until I return from military service.`;

const commitMessage =
  daysLeft === 0
    ? "Military countdown: returning today"
    : `Military countdown: ${daysLeft} days left`;

const content = `# Military Countdown

${status}

Updated: ${dateKey(today)} (${timeZone})
`;

writeFileSync("countdown.md", content);

setOutput("should_commit", "true");
setOutput("commit_message", commitMessage);

console.log(status);

