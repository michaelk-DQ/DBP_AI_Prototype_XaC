import fs from "fs/promises";

export interface JsonDataset<T> {
  records: T[];
}

export async function loadJsonDataset<T>(filePath: string): Promise<T[]> {
  let raw: string;

  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read dataset at ${filePath}: ${message}`);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON in ${filePath}: ${message}`);
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("records" in parsed) ||
    !Array.isArray((parsed as JsonDataset<T>).records)
  ) {
    throw new Error(
      `Dataset at ${filePath} must be an object with a "records" array.`
    );
  }

  return (parsed as JsonDataset<T>).records;
}
