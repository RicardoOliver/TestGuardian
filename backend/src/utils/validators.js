import { badRequest } from "./http-errors.js";

export function ensureEnum(value, allowed, fieldName) {
  if (!allowed.includes(value)) {
    throw badRequest(`Invalid ${fieldName}. Allowed values: ${allowed.join(", ")}`, {
      field: fieldName,
      allowed
    });
  }
}

export function ensureNumber(value, fieldName, min = 0, max = 100) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw badRequest(`${fieldName} must be a number`, { field: fieldName });
  }

  if (value < min || value > max) {
    throw badRequest(`${fieldName} must be between ${min} and ${max}`, {
      field: fieldName,
      min,
      max
    });
  }
}
