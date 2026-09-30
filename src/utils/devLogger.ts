/*
 * ===============================================
 * DEVELOPMENT LOGGER
 * ===============================================
 *
 * Browser diagnostics are useful while developing
 * PROMPT., but they should not clutter production.
 *
 * DEV:
 * console messages are visible.
 *
 * PRODUCTION:
 * these functions remain silent.
 */

export function devWarn(
  message: string,
  error?: unknown,
): void {
  if (
    !import.meta.env.DEV
  ) {
    return;
  }

  if (
    error !== undefined
  ) {
    console.warn(
      message,
      error,
    );

    return;
  }

  console.warn(
    message,
  );
}

export function devError(
  message: string,
  error?: unknown,
): void {
  if (
    !import.meta.env.DEV
  ) {
    return;
  }

  if (
    error !== undefined
  ) {
    console.error(
      message,
      error,
    );

    return;
  }

  console.error(
    message,
  );
}