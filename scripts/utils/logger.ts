export type LogLevel = "info" | "warn" | "error" | "success";

const PREFIX: Record<LogLevel, string> = {
  info: "ℹ",
  warn: "⚠",
  error: "✗",
  success: "✓",
};

export function log(level: LogLevel, message: string): void {
  console.log(`${PREFIX[level]} ${message}`);
}

export function logBanner(title: string): void {
  const line = "━".repeat(26);
  console.log(`\n${line}`);
  console.log(title);
  console.log(`${line}\n`);
}

export function logDivider(): void {
  console.log("");
}

export type SkipReason = "duplicate" | "validation" | "insert_failure" | "malformed";

export interface SkipEntry {
  question: string;
  reason: SkipReason;
  detail: string;
  validationErrors?: string[];
}

export function logSkipped(entry: SkipEntry): void {
  const label =
    entry.reason === "duplicate"      ? "DUPLICATE" :
    entry.reason === "validation"     ? "VALIDATION FAILURE" :
    entry.reason === "insert_failure" ? "INSERT FAILURE" :
                                        "MALFORMED RECORD";

  console.log(`\n  [FAQ SKIPPED — ${label}]`);
  console.log(`  Question : ${entry.question || "(unknown)"}`);
  console.log(`  Reason   : ${entry.detail}`);

  if (entry.validationErrors && entry.validationErrors.length > 0) {
    console.log(`  Errors   : ${entry.validationErrors.join(" | ")}`);
  }
}
