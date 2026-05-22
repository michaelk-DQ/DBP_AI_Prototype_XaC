import { SupabaseClient } from "@supabase/supabase-js";
import { DATA_PATHS, TABLE_NAMES } from "../config/supabase";
import { seedTable } from "../utils/tableSeeder";
import { validateServiceRecord } from "../validators/recordValidator";

export type { SeederResult } from "../utils/tableSeeder";

export async function seedServices(client: SupabaseClient) {
  return seedTable({
    client,
    table: TABLE_NAMES.services,
    filePath: DATA_PATHS.services,
    entityLabel: "service",
    validate: validateServiceRecord,
  });
}
