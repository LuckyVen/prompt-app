import type {
  NextFunction,
  Request,
  Response,
} from "express";

/*
 * ===============================================
 * UNSAFE OBJECT KEYS
 * ===============================================
 *
 * Prevent suspicious nested object keys commonly
 * associated with prototype-pollution attacks.
 */

const UNSAFE_KEYS =
  new Set([
    "__proto__",
    "prototype",
    "constructor",
  ]);

/*
 * Prevent extremely deep JSON objects from causing
 * unnecessary recursive processing.
 */

const MAX_OBJECT_DEPTH =
  20;

/*
 * ===============================================
 * HELPERS
 * ===============================================
 */

function containsUnsafeKey(
  value: unknown,
  depth = 0,
): boolean {
  if (
    depth >
    MAX_OBJECT_DEPTH
  ) {
    return true;
  }

  if (
    value === null ||
    typeof value !==
      "object"
  ) {
    return false;
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    return value.some(
      (item) =>
        containsUnsafeKey(
          item,
          depth + 1,
        ),
    );
  }

  for (
    const [
      key,
      childValue,
    ] of Object.entries(
      value as Record<
        string,
        unknown
      >,
    )
  ) {
    if (
      UNSAFE_KEYS.has(
        key,
      )
    ) {
      return true;
    }

    if (
      containsUnsafeKey(
        childValue,
        depth + 1,
      )
    ) {
      return true;
    }
  }

  return false;
}

/*
 * ===============================================
 * REQUEST OBJECT SECURITY
 * ===============================================
 */

export function rejectUnsafeObjectKeys(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (
    containsUnsafeKey(
      request.body,
    )
  ) {
    response
      .status(400)
      .json({
        success: false,
        message:
          "Request contains unsupported object properties.",
      });

    return;
  }

  next();
}