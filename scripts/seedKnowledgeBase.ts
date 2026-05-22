import {
  createSupabaseClient,
  logSupabaseEnvDiagnostics,
  verifySeederAccess,
} from "./config/supabase";
import { seedCourses } from "./seeders/coursesSeeder";
import { seedEvents } from "./seeders/eventsSeeder";
import { seedServices } from "./seeders/servicesSeeder";
import { SeederResult, SeederPermissionError } from "./utils/tableSeeder";
import { log, logBanner, logDivider } from "./utils/logger";

function aggregateSkipped(results: SeederResult[]): number {
  return results.reduce((total, result) => total + result.skipped, 0);
}

function aggregateValidationErrors(results: SeederResult[]): number {
  return results.reduce((total, result) => total + result.validationErrors, 0);
}

async function seedKnowledgeBase(): Promise<void> {
  logBanner("DBP AI KNOWLEDGE BASE SEEDER");
  logSupabaseEnvDiagnostics();
  console.log("");

  const client = createSupabaseClient();
  await verifySeederAccess(client);

  const services = await seedServices(client);
  const courses = await seedCourses(client);
  const events = await seedEvents(client);

  log("success", `Services inserted: ${services.inserted}`);
  log("success", `Courses inserted: ${courses.inserted}`);
  log("success", `Events inserted: ${events.inserted}`);

  const allResults = [services, courses, events];
  const totalSkipped = aggregateSkipped(allResults);
  const totalValidationErrors = aggregateValidationErrors(allResults);

  logDivider();

  if (totalSkipped > 0) {
    log("warn", `Skipped records: ${totalSkipped}`);
  }

  if (totalValidationErrors > 0) {
    log("warn", `Validation errors: ${totalValidationErrors}`);
  }

  logDivider();
  log("success", "Seeder completed successfully");
}

seedKnowledgeBase().catch((error: unknown) => {
  if (error instanceof SeederPermissionError) {
    log("error", error.message);
    process.exit(1);
  }

  const message = error instanceof Error ? error.message : String(error);
  log("error", `Seeder failed: ${message}`);
  process.exit(1);
});
