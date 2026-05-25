import path from "path";
import dotenv from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const ENV_PATH = path.resolve(process.cwd(), "frontend", ".env");

function loadEnv(): void {
  dotenv.config({ path: ENV_PATH, override: true });
}

function decodeJwtRole(jwt: string): string | null {
  try {
    const payload = jwt.split(".")[1];
    if (!payload) return null;
    const json = Buffer.from(payload, "base64url").toString("utf-8");
    const claims = JSON.parse(json) as { role?: string };
    return claims.role ?? null;
  } catch {
    return null;
  }
}

export type SupabaseKeyMode = "service_role" | "anon";

export interface SupabaseEnvDiagnostics {
  envPath: string;
  urlSet: boolean;
  serviceRoleKeySet: boolean;
  anonKeySet: boolean;
  keyMode: SupabaseKeyMode;
  jwtRole: string | null;
}

export function getSupabaseEnvDiagnostics(): SupabaseEnvDiagnostics {
  loadEnv();

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim();
  const usingServiceRole = Boolean(serviceRoleKey);
  const apiKey = serviceRoleKey || anonKey || "";

  return {
    envPath: ENV_PATH,
    urlSet: Boolean(process.env.VITE_SUPABASE_URL?.trim()),
    serviceRoleKeySet: usingServiceRole,
    anonKeySet: Boolean(anonKey),
    keyMode: usingServiceRole ? "service_role" : "anon",
    jwtRole: apiKey ? decodeJwtRole(apiKey) : null,
  };
}

export function logSupabaseEnvDiagnostics(): void {
  const d = getSupabaseEnvDiagnostics();

  console.log(`Env file: ${d.envPath}`);
  console.log(`VITE_SUPABASE_URL: ${d.urlSet ? "set" : "missing"}`);
  console.log(
    `SUPABASE_SERVICE_ROLE_KEY: ${d.serviceRoleKeySet ? "set" : "missing"}`
  );
  console.log(`VITE_SUPABASE_ANON_KEY: ${d.anonKeySet ? "set" : "missing"}`);
  console.log(`Active key mode: ${d.keyMode}`);
  console.log(`JWT role claim: ${d.jwtRole ?? "unknown"}`);

  if (d.serviceRoleKeySet && d.jwtRole !== "service_role") {
    console.warn(
      "⚠ SUPABASE_SERVICE_ROLE_KEY is set but JWT role is not service_role — check you copied the service_role secret, not the anon key."
    );
  }

  if (!d.serviceRoleKeySet) {
    console.warn(
      "⚠ SUPABASE_SERVICE_ROLE_KEY is not set — using anon key. Seeding may fail under RLS or missing GRANTs."
    );
  }
}

export function createSupabaseClient(): SupabaseClient {
  loadEnv();

  const url = process.env.VITE_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim();
  const apiKey = serviceRoleKey || anonKey;

  if (!url) {
    throw new Error(
      "Missing VITE_SUPABASE_URL. Set it in frontend/.env before running the seeder."
    );
  }

  if (!apiKey) {
    throw new Error(
      "Missing Supabase API key. Set SUPABASE_SERVICE_ROLE_KEY (recommended) or VITE_SUPABASE_ANON_KEY in frontend/.env."
    );
  }

  return createClient(url, apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function formatAccessError(table: string, message: string, hint: string | null): string {
  const grantHint =
    hint?.includes("GRANT") ||
    message.toLowerCase().includes("permission denied");

  if (grantHint) {
    return (
      `Cannot access "${table}" (${message}). ` +
      "The service role key is loaded, but PostgreSQL table privileges are missing. " +
      "Run scripts/sql/grant_kb_tables.sql in Supabase Dashboard → SQL Editor, then re-run npm run seed:kb."
    );
  }

  return `Cannot access "${table}" (${message}).`;
}

export async function verifySeederAccess(client: SupabaseClient): Promise<void> {
  const probeTable = TABLE_NAMES.services;

  const { error } = await client.from(probeTable).select("slug").limit(1);

  if (!error) {
    return;
  }

  throw new Error(formatAccessError(probeTable, error.message, error.hint ?? null));
}

export const DATA_PATHS = {
  services: path.resolve(process.cwd(), "frontend", "src", "data", "services.json"),
  courses: path.resolve(process.cwd(), "frontend", "src", "data", "courses.json"),
  events: path.resolve(process.cwd(), "frontend", "src", "data", "events.json"),
  faqs: path.resolve(process.cwd(), "frontend", "src", "data", "faqs.json"),
} as const;

export const TABLE_NAMES = {
  services: "kb_services",
  courses: "kb_courses",
  events: "kb_events",
  faqs: "kb_faqs",
} as const;
