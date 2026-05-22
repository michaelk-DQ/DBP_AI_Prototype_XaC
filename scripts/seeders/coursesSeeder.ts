import { SupabaseClient } from "@supabase/supabase-js";
import { DATA_PATHS, TABLE_NAMES } from "../config/supabase";
import { seedTable } from "../utils/tableSeeder";
import { validateCourseRecord } from "../validators/recordValidator";

export async function seedCourses(client: SupabaseClient) {
  return seedTable({
    client,
    table: TABLE_NAMES.courses,
    filePath: DATA_PATHS.courses,
    entityLabel: "course",
    validate: validateCourseRecord,
  });
}
