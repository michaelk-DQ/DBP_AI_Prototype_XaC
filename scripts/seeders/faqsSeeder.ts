import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { DATA_PATHS, TABLE_NAMES } from "../config/supabase";
import { loadJsonDataset } from "../loaders/jsonLoader";
import { validateFaqRecord, FaqRecord } from "../validators/recordValidator";
import { SeederResult, SeederPermissionError } from "../utils/tableSeeder";
import { log, logSkipped } from "../utils/logger";

export interface FaqSeederResult extends SeederResult {
  duplicates: number;
}

function isPermissionDenied(error: PostgrestError): boolean {
  return (
    error.code === "42501" ||
    error.message.toLowerCase().includes("permission denied")
  );
}

function extractQuestion(raw: unknown): string {
  if (typeof raw === "object" && raw !== null) {
    const q = (raw as Record<string, unknown>).question;
    if (typeof q === "string" && q.trim().length > 0) return q.trim();
  }
  return "(unknown)";
}

async function questionExists(
  client: SupabaseClient,
  question: string
): Promise<boolean> {
  const { data, error } = await client
    .from(TABLE_NAMES.faqs)
    .select("id")
    .eq("question", question)
    .maybeSingle();

  if (error) {
    if (isPermissionDenied(error)) {
      throw new SeederPermissionError(
        `Duplicate check failed for kb_faqs: ${error.message}. ` +
          "Check SUPABASE_SERVICE_ROLE_KEY and run scripts/sql/grant_kb_tables.sql in Supabase SQL Editor."
      );
    }
    throw new Error(`Duplicate check failed for kb_faqs: ${error.message}`);
  }

  return data !== null;
}

export async function seedFaqs(client: SupabaseClient): Promise<FaqSeederResult> {
  const records = await loadJsonDataset<unknown>(DATA_PATHS.faqs);
  const result: FaqSeederResult = {
    inserted: 0,
    skipped: 0,
    validationErrors: 0,
    insertFailures: 0,
    duplicates: 0,
  };

  for (const raw of records) {
    const question = extractQuestion(raw);
    const validation = validateFaqRecord(raw);

    if (!validation.valid || !validation.record) {
      result.validationErrors += 1;
      result.skipped += 1;
      logSkipped({
        question,
        reason: "validation",
        detail: "Record failed required field validation",
        validationErrors: validation.errors,
      });
      continue;
    }

    const record: FaqRecord = validation.record;

    if (await questionExists(client, record.question)) {
      result.duplicates += 1;
      result.skipped += 1;
      logSkipped({
        question: record.question,
        reason: "duplicate",
        detail: "Question already exists in kb_faqs — skipping to avoid duplicate",
      });
      continue;
    }

    const { error } = await client.from(TABLE_NAMES.faqs).insert(record);

    if (error) {
      if (isPermissionDenied(error)) {
        throw new SeederPermissionError(
          `Insert failed for faq "${record.question.slice(0, 60)}": ${error.message}. ` +
            "Use SUPABASE_SERVICE_ROLE_KEY in frontend/.env for seeding."
        );
      }

      result.insertFailures += 1;
      result.skipped += 1;
      logSkipped({
        question: record.question,
        reason: "insert_failure",
        detail: error.message,
      });
      continue;
    }

    result.inserted += 1;
  }

  return result;
}
