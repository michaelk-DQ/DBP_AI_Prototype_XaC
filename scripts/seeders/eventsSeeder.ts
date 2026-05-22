import { SupabaseClient } from "@supabase/supabase-js";
import { DATA_PATHS, TABLE_NAMES } from "../config/supabase";
import { seedTable } from "../utils/tableSeeder";
import { validateEventRecord } from "../validators/recordValidator";

export async function seedEvents(client: SupabaseClient) {
  return seedTable({
    client,
    table: TABLE_NAMES.events,
    filePath: DATA_PATHS.events,
    entityLabel: "event",
    validate: validateEventRecord,
  });
}
