import {
  randomUUID,
} from "node:crypto";

import pinoHttp from "pino-http";

import {
  logger,
} from "../services/logger.js";

/*
 * ===============================================
 * REQUEST LOGGER
 * ===============================================
 */

export const requestLogger =
  pinoHttp({
    logger,

    /*
     * =============================================
     * REQUEST ID
     * =============================================
     *
     * Accept a reasonable X-Request-ID if a proxy
     * supplied one.
     *
     * Otherwise generate our own UUID.
     */

    genReqId: (
      request,
      response,
    ) => {
      const header =
        request.headers[
          "x-request-id"
        ];

      const suppliedId =
        Array.isArray(
          header,
        )
          ? header[0]
          : header;

      const requestId =
        typeof suppliedId ===
          "string" &&
        suppliedId.length > 0 &&
        suppliedId.length <=
          100
          ? suppliedId
          : randomUUID();

      /*
       * Return the ID to the client too.
       */

      response.setHeader(
        "X-Request-ID",
        requestId,
      );

      return requestId;
    },

    /*
     * =============================================
     * LOG LEVEL BY STATUS
     * =============================================
     */

    customLogLevel: (
      _request,
      response,
      error,
    ) => {
      if (
        error ||
        response.statusCode >=
          500
      ) {
        return "error";
      }

      if (
        response.statusCode >=
        400
      ) {
        return "warn";
      }

      return "info";
    },

    /*
     * =============================================
     * ATTRIBUTE NAMES
     * =============================================
     */

    customAttributeKeys: {
      req:
        "request",

      res:
        "response",

      err:
        "error",

      responseTime:
        "responseTimeMs",
    },

    /*
     * =============================================
     * MESSAGES
     * =============================================
     */

    customSuccessMessage: (
      request,
      response,
    ) => {
      return (
        `${request.method} ` +
        `${request.url} ` +
        `${response.statusCode}`
      );
    },

    customErrorMessage: (
      request,
      response,
    ) => {
      return (
        `${request.method} ` +
        `${request.url} ` +
        `${response.statusCode}`
      );
    },
  });