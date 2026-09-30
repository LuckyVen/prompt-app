import OpenAI from "openai";

/*
 * ===============================================
 * AI ERROR TYPES
 * ===============================================
 */

export type AiErrorCode =
  | "rate_limit"
  | "quota_exhausted"
  | "authentication"
  | "provider_unavailable"
  | "invalid_response"
  | "configuration"
  | "unknown";

export interface AiHttpError {
  status: number;
  code: AiErrorCode;
  message: string;
}

/*
 * ===============================================
 * HELPERS
 * ===============================================
 */

function hasStringProperty(
  value: unknown,
  property: string,
): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    property in value &&
    typeof (
      value as Record<string, unknown>
    )[property] === "string"
  );
}

function getErrorCode(
  error: unknown,
): string | undefined {
  if (
    hasStringProperty(
      error,
      "code",
    )
  ) {
    return error.code;
  }

  return undefined;
}

function isInvalidProviderResponse(
  error: unknown,
): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.startsWith(
      "OpenAI returned",
    ) ||
    error.message.startsWith(
      "AI generated",
    ) ||
    error.message.startsWith(
      "AI response",
    )
  );
}

/*
 * ===============================================
 * OPENAI ERROR MAPPER
 * ===============================================
 */

export function mapOpenAiError(
  error: unknown,
): AiHttpError {
  /*
   * =============================================
   * LOCAL CONFIGURATION ERROR
   * =============================================
   */

  if (
    error instanceof Error &&
    error.message ===
      "OPENAI_API_KEY is not configured."
  ) {
    return {
      status: 503,
      code: "configuration",
      message:
        "AI service is not configured.",
    };
  }

  /*
   * =============================================
   * INVALID PROVIDER RESPONSE
   * =============================================
   *
   * These errors come from our parsing and
   * validation layers.
   */

  if (
    isInvalidProviderResponse(
      error,
    )
  ) {
    return {
      status: 502,
      code: "invalid_response",
      message:
        "AI returned an invalid response.",
    };
  }

  /*
   * =============================================
   * OPENAI API ERROR
   * =============================================
   */

  if (
    error instanceof OpenAI.APIError
  ) {
    const providerCode =
      getErrorCode(error);

    /*
     * API credits / quota exhausted.
     */

    if (
      providerCode ===
        "insufficient_quota" ||
      providerCode ===
        "credit_balance_exhausted"
    ) {
      return {
        status: 429,
        code: "quota_exhausted",
        message:
          "AI service usage limit has been reached.",
      };
    }

    /*
     * Rate limit.
     */

    if (error.status === 429) {
      return {
        status: 429,
        code: "rate_limit",
        message:
          "AI service is receiving too many requests. Please try again shortly.",
      };
    }

    /*
     * Authentication / authorization.
     */

    if (
      error.status === 401 ||
      error.status === 403
    ) {
      return {
        status: 503,
        code: "authentication",
        message:
          "AI service authentication failed.",
      };
    }

    /*
     * Provider timeout / conflict /
     * server-side failure.
     */

    if (
      error.status === 408 ||
      error.status === 409 ||
      error.status >= 500
    ) {
      return {
        status: 503,
        code: "provider_unavailable",
        message:
          "AI service is temporarily unavailable.",
      };
    }
  }

  /*
   * =============================================
   * CONNECTION ERROR
   * =============================================
   */

  if (
    error instanceof OpenAI.APIConnectionError
  ) {
    return {
      status: 503,
      code: "provider_unavailable",
      message:
        "Unable to reach the AI service.",
    };
  }

  /*
   * =============================================
   * UNKNOWN ERROR
   * =============================================
   */

  return {
    status: 503,
    code: "unknown",
    message:
      "AI service is temporarily unavailable.",
  };
}