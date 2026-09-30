/*
 * ===============================================
 * API BASE URL
 * ===============================================
 */

const DEVELOPMENT_API_URL =
  "http://localhost:5000/api";

function getApiBaseUrl(): string {
  const configuredUrl =
    import.meta.env
      .VITE_API_BASE_URL
      ?.trim();

  const apiUrl =
    configuredUrl ||
    DEVELOPMENT_API_URL;

  /*
   * Remove trailing slash:
   *
   * http://localhost:5000/api/
   *
   * becomes:
   *
   * http://localhost:5000/api
   */

  return apiUrl.replace(
    /\/+$/,
    "",
  );
}

export const API_BASE_URL =
  getApiBaseUrl();

/*
 * ===============================================
 * API ERROR
 * ===============================================
 */

export class ApiError
  extends Error {
  status: number;
  code?: string;
  requestId?: string;

  constructor(
    message: string,
    status: number,
    options?: {
      code?: string;
      requestId?: string;
    },
  ) {
    super(message);

    this.name =
      "ApiError";

    this.status =
      status;

    this.code =
      options?.code;

    this.requestId =
      options?.requestId;

    Object.setPrototypeOf(
      this,
      ApiError.prototype,
    );
  }
}

/*
 * ===============================================
 * ERROR RESPONSE
 * ===============================================
 */

interface ApiErrorResponse {
  success?: boolean;
  code?: string;
  message?: string;
}

/*
 * ===============================================
 * IN-FLIGHT REQUESTS
 * ===============================================
 *
 * Identical public requests may reuse the same
 * Promise while one is already running.
 *
 * Authenticated requests are NEVER deduplicated.
 */

const inFlightRequests =
  new Map<
    string,
    Promise<unknown>
  >();

/*
 * ===============================================
 * AUTHORIZATION CHECK
 * ===============================================
 */

function hasAuthorizationHeader(
  options: RequestInit,
): boolean {
  const headers =
    new Headers(
      options.headers,
    );

  return headers.has(
    "Authorization",
  );
}

/*
 * ===============================================
 * REQUEST KEY
 * ===============================================
 */

function createRequestKey(
  endpoint: string,
  options: RequestInit,
): string | null {
  /*
   * Never deduplicate authenticated requests.
   */

  if (
    hasAuthorizationHeader(
      options,
    )
  ) {
    return null;
  }

  const method =
    (
      options.method ??
      "GET"
    ).toUpperCase();

  const body =
    typeof options.body ===
      "string"
      ? options.body
      : options.body ===
            undefined ||
          options.body ===
            null
        ? ""
        : null;

  if (
    body === null
  ) {
    return null;
  }

  return [
    method,
    endpoint,
    body,
  ].join(
    "::",
  );
}

/*
 * ===============================================
 * RESPONSE ERROR PARSER
 * ===============================================
 */

async function parseApiError(
  response: Response,
): Promise<ApiError> {
  let message =
    "Something went wrong.";

  let code:
    string | undefined;

  try {
    const data =
      (await response.json()) as
        ApiErrorResponse;

    if (
      typeof data.message ===
      "string" &&
      data.message.trim()
    ) {
      message =
        data.message;
    }

    if (
      typeof data.code ===
      "string" &&
      data.code.trim()
    ) {
      code =
        data.code;
    }
  } catch {
    /*
     * Some hosting/proxy errors may return plain
     * text or HTML instead of JSON.
     */
  }

  /*
   * Backend Step 10.9 sends X-Request-ID.
   *
   * This lets us match a frontend error with its
   * backend structured log.
   */

  const requestId =
    response.headers.get(
      "X-Request-ID",
    ) ??
    undefined;

  return new ApiError(
    message,
    response.status,
    {
      code,
      requestId,
    },
  );
}

/*
 * ===============================================
 * EXECUTE REQUEST
 * ===============================================
 */

async function executeRequest<T>(
  endpoint: string,
  options: RequestInit,
): Promise<T> {
  const headers =
    new Headers(
      options.headers,
    );

  headers.set(
    "Accept",
    "application/json",
  );

  /*
   * Content-Type is only required when we
   * actually send a body.
   */

  if (
    options.body !==
      undefined &&
    options.body !==
      null &&
    !headers.has(
      "Content-Type",
    )
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      },
    );

  if (
    !response.ok
  ) {
    throw await parseApiError(
      response,
    );
  }

  /*
   * Support endpoints that intentionally return
   * no response body.
   */

  if (
    response.status ===
    204
  ) {
    return undefined as T;
  }

  return response.json() as
    Promise<T>;
}

/*
 * ===============================================
 * API REQUEST
 * ===============================================
 */

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (
    !endpoint.startsWith(
      "/",
    )
  ) {
    throw new Error(
      "API endpoint must start with '/'.",
    );
  }

  const requestKey =
    createRequestKey(
      endpoint,
      options,
    );

  if (
    requestKey
  ) {
    const existingRequest =
      inFlightRequests.get(
        requestKey,
      );

    if (
      existingRequest
    ) {
      return existingRequest as
        Promise<T>;
    }
  }

  const request =
    executeRequest<T>(
      endpoint,
      options,
    );

  /*
   * Authenticated/non-deduplicated request.
   */

  if (
    !requestKey
  ) {
    return request;
  }

  inFlightRequests.set(
    requestKey,
    request,
  );

  try {
    return await request;
  } finally {
    /*
     * Only remove the exact Promise stored for
     * this request key.
     */

    if (
      inFlightRequests.get(
        requestKey,
      ) === request
    ) {
      inFlightRequests.delete(
        requestKey,
      );
    }
  }
}