import type {
  NextFunction,
  Request,
  Response,
} from "express";

/*
 * ===============================================
 * LIMITS
 * ===============================================
 */

const MIN_NAME_LENGTH =
  2;

const MAX_NAME_LENGTH =
  100;

const MAX_EMAIL_LENGTH =
  255;

const MIN_PASSWORD_LENGTH =
  8;

const MAX_PASSWORD_LENGTH =
  128;

/*
 * ===============================================
 * ALLOWED REQUEST FIELDS
 * ===============================================
 */

const REGISTER_FIELDS =
  new Set([
    "name",
    "email",
    "password",
  ]);

const LOGIN_FIELDS =
  new Set([
    "email",
    "password",
  ]);

/*
 * ===============================================
 * HELPERS
 * ===============================================
 */

function isPlainObject(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(
      value,
    )
  );
}

function containsOnlyFields(
  body: Record<
    string,
    unknown
  >,
  allowedFields: Set<string>,
): boolean {
  return Object.keys(
    body,
  ).every(
    (key) =>
      allowedFields.has(
        key,
      ),
  );
}

/*
 * This intentionally stays reasonably simple.
 *
 * Full RFC email validation is unnecessary here.
 * The database also enforces uniqueness.
 */

function isValidEmail(
  email: string,
): boolean {
  if (
    email.length === 0 ||
    email.length >
      MAX_EMAIL_LENGTH
  ) {
    return false;
  }

  /*
   * Reject whitespace anywhere inside the email.
   */

  if (
    /\s/.test(
      email,
    )
  ) {
    return false;
  }

  /*
   * Basic structure:
   *
   * something@something.something
   */

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email,
  );
}

/*
 * ===============================================
 * REGISTER VALIDATION
 * ===============================================
 */

export function validateRegister(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (
    !isPlainObject(
      request.body,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Request body must be a valid JSON object.",
      });

    return;
  }

  if (
    !containsOnlyFields(
      request.body,
      REGISTER_FIELDS,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Registration request contains unsupported fields.",
      });

    return;
  }

  const {
    name,
    email,
    password,
  } = request.body;

  /*
   * =============================================
   * NAME
   * =============================================
   */

  if (
    typeof name !==
    "string"
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Name is required.",
      });

    return;
  }

  const normalizedName =
    name
      .trim()
      .replace(
        /\s+/g,
        " ",
      );

  if (
    normalizedName.length <
      MIN_NAME_LENGTH ||
    normalizedName.length >
      MAX_NAME_LENGTH
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          `Name must contain between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`,
      });

    return;
  }

  /*
   * Control characters are unnecessary in names.
   */

  if (
    /[\u0000-\u001F\u007F]/.test(
      normalizedName,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Name contains unsupported characters.",
      });

    return;
  }

  /*
   * =============================================
   * EMAIL
   * =============================================
   */

  if (
    typeof email !==
    "string"
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Email is required.",
      });

    return;
  }

  const normalizedEmail =
    email
      .trim()
      .toLowerCase();

  if (
    !isValidEmail(
      normalizedEmail,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Please provide a valid email address.",
      });

    return;
  }

  /*
   * =============================================
   * PASSWORD
   * =============================================
   *
   * Important:
   *
   * Do NOT trim, lowercase, sanitize, or otherwise
   * modify a password.
   */

  if (
    typeof password !==
    "string"
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Password is required.",
      });

    return;
  }

  if (
    password.length <
      MIN_PASSWORD_LENGTH ||
    password.length >
      MAX_PASSWORD_LENGTH
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          `Password must contain between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`,
      });

    return;
  }

  /*
   * =============================================
   * NORMALIZED REQUEST BODY
   * =============================================
   */

  request.body = {
    name:
      normalizedName,

    email:
      normalizedEmail,

    password,
  };

  next();
}

/*
 * ===============================================
 * LOGIN VALIDATION
 * ===============================================
 */

export function validateLogin(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (
    !isPlainObject(
      request.body,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Request body must be a valid JSON object.",
      });

    return;
  }

  if (
    !containsOnlyFields(
      request.body,
      LOGIN_FIELDS,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Login request contains unsupported fields.",
      });

    return;
  }

  const {
    email,
    password,
  } = request.body;

  /*
   * EMAIL
   */

  if (
    typeof email !==
    "string"
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Email is required.",
      });

    return;
  }

  const normalizedEmail =
    email
      .trim()
      .toLowerCase();

  if (
    !isValidEmail(
      normalizedEmail,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Please provide a valid email address.",
      });

    return;
  }

  /*
   * PASSWORD
   */

  if (
    typeof password !==
      "string" ||
    password.length ===
      0 ||
    password.length >
      MAX_PASSWORD_LENGTH
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Password is required.",
      });

    return;
  }

  request.body = {
    email:
      normalizedEmail,

    password,
  };

  next();
}