export interface ServiceRecord {
  service_name: string;
  slug: string;
  [key: string]: unknown;
}

export interface CourseRecord {
  course_title: string;
  slug: string;
  [key: string]: unknown;
}

export interface EventRecord {
  event_title: string;
  slug: string;
  [key: string]: unknown;
}

export interface ValidationResult<T> {
  valid: boolean;
  record: T | null;
  errors: string[];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function baseRecordErrors(record: unknown, label: string): string[] {
  const errors: string[] = [];

  if (typeof record !== "object" || record === null) {
    errors.push(`${label}: record must be a non-null object`);
    return errors;
  }

  const row = record as Record<string, unknown>;

  if (!isNonEmptyString(row.slug)) {
    errors.push(`${label}: slug is required for idempotent seeding`);
  }

  return errors;
}

export function validateServiceRecord(record: unknown): ValidationResult<ServiceRecord> {
  const errors = baseRecordErrors(record, "service");

  if (errors.length > 0) {
    return { valid: false, record: null, errors };
  }

  const row = record as Record<string, unknown>;

  if (!isNonEmptyString(row.service_name)) {
    errors.push("service: service_name is required");
  }

  if (errors.length > 0) {
    return { valid: false, record: null, errors };
  }

  return { valid: true, record: row as ServiceRecord, errors: [] };
}

export function validateCourseRecord(record: unknown): ValidationResult<CourseRecord> {
  const errors = baseRecordErrors(record, "course");

  if (errors.length > 0) {
    return { valid: false, record: null, errors };
  }

  const row = record as Record<string, unknown>;

  if (!isNonEmptyString(row.course_title)) {
    errors.push("course: course_title is required");
  }

  if (errors.length > 0) {
    return { valid: false, record: null, errors };
  }

  return { valid: true, record: row as CourseRecord, errors: [] };
}

export function validateEventRecord(record: unknown): ValidationResult<EventRecord> {
  const errors = baseRecordErrors(record, "event");

  if (errors.length > 0) {
    return { valid: false, record: null, errors };
  }

  const row = record as Record<string, unknown>;

  if (!isNonEmptyString(row.event_title)) {
    errors.push("event: event_title is required");
  }

  if (errors.length > 0) {
    return { valid: false, record: null, errors };
  }

  return { valid: true, record: row as EventRecord, errors: [] };
}
