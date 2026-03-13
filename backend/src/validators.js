import { AppError } from "./errors.js";

export function assertObject(value, fieldName) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AppError(`'${fieldName}' must be an object`, 422, "VALIDATION_ERROR");
  }
}

export function assertNumber(value, fieldName, { min = -Infinity, max = Infinity } = {}) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new AppError(`'${fieldName}' must be a number`, 422, "VALIDATION_ERROR");
  }

  if (value < min || value > max) {
    throw new AppError(`'${fieldName}' must be between ${min} and ${max}`, 422, "VALIDATION_ERROR");
  }
}

export function assertInteger(value, fieldName, { min = -Infinity, max = Infinity } = {}) {
  assertNumber(value, fieldName, { min, max });
  if (!Number.isInteger(value)) {
    throw new AppError(`'${fieldName}' must be an integer`, 422, "VALIDATION_ERROR");
  }
}

export function assertString(value, fieldName, { minLength = 1, allowed } = {}) {
  if (typeof value !== "string") {
    throw new AppError(`'${fieldName}' must be a string`, 422, "VALIDATION_ERROR");
  }

  const normalized = value.trim();
  if (normalized.length < minLength) {
    throw new AppError(`'${fieldName}' must have at least ${minLength} characters`, 422, "VALIDATION_ERROR");
  }

  if (allowed && !allowed.includes(normalized)) {
    throw new AppError(`'${fieldName}' must be one of: ${allowed.join(", ")}`, 422, "VALIDATION_ERROR");
  }

  return normalized;
}

export function assertOptionalInteger(value, fieldName, constraints) {
  if (value === undefined || value === null) {
    return;
  }

  assertInteger(value, fieldName, constraints);
}
