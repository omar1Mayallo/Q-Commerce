/**
 * Strong password regex.
 * Requires at least one digit, one lowercase letter,
 * one uppercase letter, one special character,
 * and a length between 8 and 25 characters.
 */
export const PASSWORD_REGEX = /^.{5,20}$/;

/**
 * Username regex.
 * Allows a mix of Latin and Arabic characters,
 * along with numbers and underscores.
 * Enforces a minimum length of 3 characters
 * and a maximum length of 30 characters.
 */
export const USERNAME_REGEX: RegExp =
  /^[a-zA-Z0-9\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF _-]{3,30}$/;

/**
 * Unique violation regex.
 * Extracts field name and value from PostgreSQL unique constraint violation messages.
 */
export const UNIQUE_VIOLATION_REGEX =
  /Key \(([^)]+)\)=\(([^)]+)\) already exists/;

/**
 * Filtering date format regex.
 * Matches dates in the format "YYYY-MM-DDTHH:mm:ss.sssZ."
 */
export const LONG_FILTERING_DATE_FORMAT_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/**
 * Filtering date format regex.
 * Matches dates in the format "YYYY-MM-DD."
 */
export const SHORT_FILTERING_DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
