import {
  createSupabaseClient,
  logSupabaseEnvDiagnostics,
  verifySeederAccess,
} from "./config/supabase";
import { seedCourses } from "./seeders/coursesSeeder";
import { seedEvents } from "./seeders/eventsSeeder";
import { seedServices } from "./seeders/servicesSeeder";
import { seedFaqs, FaqSeederResult } from "./seeders/faqsSeeder";
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
  const faqs: FaqSeederResult = await seedFaqs(client);

  log("success", `Services inserted: ${services.inserted}`);
  log("success", `Courses inserted: ${courses.inserted}`);
  log("success", `Events inserted: ${events.inserted}`);

  logDivider();
  log("success", `FAQs inserted:            ${faqs.inserted}`);
  if (faqs.skipped > 0)          log("warn",    `FAQs skipped:             ${faqs.skipped}`);
  if (faqs.duplicates > 0)       log("warn",    `FAQ duplicates:           ${faqs.duplicates}`);
  if (faqs.validationErrors > 0) log("warn",    `FAQ validation failures:  ${faqs.validationErrors}`);
  if (faqs.insertFailures > 0)   log("error",   `FAQ insert failures:      ${faqs.insertFailures}`);

  const allResults = [services, courses, events, faqs];
  const totalSkipped = aggregateSkipped(allResults);
  const totalValidationErrors = aggregateValidationErrors(allResults);

  logDivider();

  if (totalSkipped > 0) {
    log("warn", `Total skipped records: ${totalSkipped}`);
  }

  if (totalValidationErrors > 0) {
    log("warn", `Total validation errors: ${totalValidationErrors}`);
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
