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
