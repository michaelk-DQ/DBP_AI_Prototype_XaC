import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { loadJsonDataset } from "../loaders/jsonLoader";
import { log } from "./logger";

export interface SeederResult {
  inserted: number;
  skipped: number;
  validationErrors: number;
  insertFailures: number;
}

export class SeederPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SeederPermissionError";
  }
}

function isPermissionDenied(error: PostgrestError | null): boolean {
  return (
    error?.code === "42501" ||
    (error?.message ?? "").toLowerCase().includes("permission denied")
  );
}

function handleQueryError(
  error: PostgrestError,
  context: string,
  slug?: string
): never {
  if (isPermissionDenied(error)) {
    throw new SeederPermissionError(
      `${context}${slug ? ` (slug: ${slug})` : ""}: ${error.message}. ` +
        "Check SUPABASE_SERVICE_ROLE_KEY and run scripts/sql/grant_kb_tables.sql in Supabase SQL Editor."
    );
  }

  throw new Error(`${context}${slug ? ` (slug: ${slug})` : ""}: ${error.message}`);
}

async function slugExists(
  client: SupabaseClient,
  table: string,
  slug: string
): Promise<boolean> {
  const { data, error } = await client
    .from(table)
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    handleQueryError(error, `Duplicate check failed for table ${table}`, slug);
  }

  return data !== null;
}

type ValidateFn<T> = (record: unknown) => {
  valid: boolean;
  record: T | null;
  errors: string[];
};

export async function seedTable<T extends { slug: string }>(options: {
  client: SupabaseClient;
  table: string;
  filePath: string;
  entityLabel: string;
  validate: ValidateFn<T>;
}): Promise<SeederResult> {
  const records = await loadJsonDataset<unknown>(options.filePath);
  const result: SeederResult = {
    inserted: 0,
    skipped: 0,
    validationErrors: 0,
    insertFailures: 0,
  };

  for (const raw of records) {
    const validation = options.validate(raw);

    if (!validation.valid || !validation.record) {
      result.validationErrors += 1;
      result.skipped += 1;
      log(
        "warn",
        `Skipped ${options.entityLabel} — ${validation.errors.join("; ")}`
      );
      continue;
    }

    const record = validation.record;

    if (await slugExists(options.client, options.table, record.slug)) {
      result.skipped += 1;
      continue;
    }

    const { error } = await options.client.from(options.table).insert(record);

    if (error) {
      if (isPermissionDenied(error)) {
        throw new SeederPermissionError(
          `Insert failed for ${options.entityLabel} "${record.slug}": ${error.message}. ` +
            "Use SUPABASE_SERVICE_ROLE_KEY in frontend/.env for seeding."
        );
      }

      result.insertFailures += 1;
      result.skipped += 1;
      log(
        "error",
        `Failed to insert ${options.entityLabel} "${record.slug}": ${error.message}`
      );
      continue;
    }

    result.inserted += 1;
  }

  return result;
}
