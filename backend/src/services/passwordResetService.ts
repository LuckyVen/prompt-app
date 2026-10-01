import {
  createHash,
  randomBytes,
} from "node:crypto";

/* =========================================================
   PASSWORD RESET CONFIGURATION
========================================================= */

const DEFAULT_RESET_MINUTES = 15;

/* =========================================================
   RESET EXPIRATION
========================================================= */

function getResetExpirationMinutes(): number {
  const raw =
    process.env
      .PASSWORD_RESET_EXPIRES_MINUTES
      ?.trim();

  const parsed =
    Number(raw);

  if (
    !Number.isFinite(parsed) ||
    parsed <= 0
  ) {
    return DEFAULT_RESET_MINUTES;
  }

  return parsed;
}

/* =========================================================
   HASH RESET TOKEN
========================================================= */

export function hashPasswordResetToken(
  token: string,
): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

/* =========================================================
   CREATE RESET TOKEN
========================================================= */

export function createPasswordResetToken() {
  const token =
    randomBytes(32)
      .toString("hex");

  const tokenHash =
    hashPasswordResetToken(
      token,
    );

  const expirationMinutes =
    getResetExpirationMinutes();

  const expiresAt =
    new Date(
      Date.now() +
        expirationMinutes *
          60 *
          1000,
    );

  return {
    token,
    tokenHash,
    expiresAt,
  };
}

/* =========================================================
   BUILD RESET URL
========================================================= */

export function buildPasswordResetUrl(
  token: string,
): string {
  const frontendUrl =
    process.env.FRONTEND_URL?.trim();

  if (!frontendUrl) {
    throw new Error(
      "FRONTEND_URL is not configured.",
    );
  }

  const cleanFrontendUrl =
    frontendUrl.replace(
      /\/+$/,
      "",
    );

  return (
    `${cleanFrontendUrl}` +
    `/reset-password` +
    `?token=${encodeURIComponent(token)}`
  );
}

/* =========================================================
   DELIVERY MODE
========================================================= */

function getDeliveryMode():
  | "console"
  | "resend" {
  const configured =
    process.env
      .PASSWORD_RESET_DELIVERY
      ?.trim()
      .toLowerCase();

  if (
    configured === "resend"
  ) {
    return "resend";
  }

  return "console";
}

/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHtml(
  value: string,
): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   PASSWORD RESET EMAIL
========================================================= */

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
): Promise<void> {
  const mode =
    getDeliveryMode();

  const expirationMinutes =
    getResetExpirationMinutes();

  /* =======================================================
     DEVELOPMENT CONSOLE DELIVERY
  ======================================================= */

  if (mode === "console") {
    if (
      process.env.NODE_ENV ===
      "production"
    ) {
      throw new Error(
        "Console password-reset delivery is disabled in production.",
      );
    }

    console.log(
      "\n==============================================",
    );

    console.log(
      "PASSWORD RESET — DEVELOPMENT ONLY",
    );

    console.log(
      `Email: ${email}`,
    );

    console.log(
      `Reset URL: ${resetUrl}`,
    );

    console.log(
      `Expires in: ${expirationMinutes} minutes`,
    );

    console.log(
      "==============================================\n",
    );

    return;
  }

  /* =======================================================
     RESEND CONFIGURATION
  ======================================================= */

  const apiKey =
    process.env.RESEND_API_KEY?.trim();

  const fromEmail =
    process.env
      .PASSWORD_RESET_FROM_EMAIL
      ?.trim();

  if (
    !apiKey ||
    !fromEmail
  ) {
    throw new Error(
      "Password-reset email provider is not configured.",
    );
  }

  const safeResetUrl =
    escapeHtml(
      resetUrl,
    );

  /* =======================================================
     SEND EMAIL
  ======================================================= */

  const response =
    await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          from:
            fromEmail,

          to: [
            email,
          ],

          subject:
            "Reset your PROMPT. password",

          /* =================================================
             PLAIN TEXT FALLBACK
          ================================================= */

          text: [
            "Reset your PROMPT. password",
            "",
            "We received a request to reset the password for your PROMPT. account.",
            "",
            "Open the link below to choose a new password:",
            resetUrl,
            "",
            `This link expires in ${expirationMinutes} minutes and can only be used once.`,
            "",
            "If you did not request a password reset, you can safely ignore this email.",
            "",
            "PROMPT.",
          ].join("\n"),

          /* =================================================
             PROFESSIONAL HTML EMAIL
          ================================================= */

          html: `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />

    <title>
      Reset your PROMPT. password
    </title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f8f8fa;
      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        Helvetica,
        Arial,
        sans-serif;
      color: #18181b;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="
        width: 100%;
        background-color: #f8f8fa;
      "
    >
      <tr>
        <td
          align="center"
          style="
            padding: 48px 16px;
          "
        >
          <!-- =============================================
               EMAIL CONTAINER
          ============================================== -->

          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width: 100%;
              max-width: 560px;
            "
          >
            <!-- ===========================================
                 BRAND
            ============================================ -->

            <tr>
              <td
                align="center"
                style="
                  padding-bottom: 24px;
                "
              >
                <div
                  style="
                    font-size: 24px;
                    line-height: 32px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                    color: #18181b;
                  "
                >
                  PROMPT<span
                    style="
                      color: #6d5dfb;
                    "
                  >.</span>
                </div>
              </td>
            </tr>

            <!-- ===========================================
                 CARD
            ============================================ -->

            <tr>
              <td
                style="
                  background-color: #ffffff;
                  border-radius: 20px;
                  padding: 40px;
                  box-shadow:
                    0 1px 2px
                    rgba(24, 24, 27, 0.04);
                "
              >
                <!-- ICON -->

                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      valign="middle"
                      style="
                        width: 48px;
                        height: 48px;
                        border-radius: 14px;
                        background-color: #efedff;
                        color: #6d5dfb;
                        font-size: 22px;
                        font-weight: 700;
                      "
                    >
                      ↻
                    </td>
                  </tr>
                </table>

                <!-- TITLE -->

                <h1
                  style="
                    margin:
                      24px 0
                      12px 0;

                    font-size: 28px;
                    line-height: 36px;
                    font-weight: 700;
                    letter-spacing: -0.6px;
                    color: #18181b;
                  "
                >
                  Reset your password
                </h1>

                <!-- DESCRIPTION -->

                <p
                  style="
                    margin:
                      0 0
                      28px 0;

                    font-size: 15px;
                    line-height: 24px;
                    color: #71717a;
                  "
                >
                  We received a request to reset
                  the password for your PROMPT.
                  account. Click the button below
                  to choose a new password.
                </p>

                <!-- RESET BUTTON -->

                <table
                  role="presentation"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                >
                  <tr>
                    <td
                      align="center"
                      style="
                        border-radius: 12px;
                        background-color: #6d5dfb;
                      "
                    >
                      <a
                        href="${safeResetUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="
                          display: inline-block;
                          padding:
                            14px 24px;

                          font-size: 15px;
                          line-height: 20px;
                          font-weight: 600;
                          text-decoration: none;
                          color: #ffffff;
                          background-color: #6d5dfb;
                          border-radius: 12px;
                        "
                      >
                        Reset password
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- EXPIRATION -->

                <p
                  style="
                    margin:
                      28px 0
                      0 0;

                    font-size: 13px;
                    line-height: 20px;
                    color: #a1a1aa;
                  "
                >
                  This link expires in
                  ${expirationMinutes} minutes
                  and can only be used once.
                </p>

                <!-- DIVIDER -->

                <div
                  style="
                    height: 1px;
                    margin:
                      32px 0;
                    background-color: #f0f0f2;
                  "
                ></div>

                <!-- SECURITY NOTE -->

                <p
                  style="
                    margin: 0;

                    font-size: 13px;
                    line-height: 21px;
                    color: #71717a;
                  "
                >
                  If you did not request a
                  password reset, you can safely
                  ignore this email. Your current
                  password will remain unchanged.
                </p>

                <!-- FALLBACK URL -->

                <p
                  style="
                    margin:
                      24px 0
                      8px 0;

                    font-size: 12px;
                    line-height: 18px;
                    color: #a1a1aa;
                  "
                >
                  If the button doesn't work,
                  copy and paste this link into
                  your browser:
                </p>

                <p
                  style="
                    margin: 0;

                    font-size: 12px;
                    line-height: 18px;
                    word-break: break-all;
                  "
                >
                  <a
                    href="${safeResetUrl}"
                    style="
                      color: #6d5dfb;
                      text-decoration: none;
                    "
                  >
                    ${safeResetUrl}
                  </a>
                </p>
              </td>
            </tr>

            <!-- ===========================================
                 FOOTER
            ============================================ -->

            <tr>
              <td
                align="center"
                style="
                  padding:
                    24px
                    16px
                    0;
                "
              >
                <p
                  style="
                    margin: 0;

                    font-size: 12px;
                    line-height: 18px;
                    color: #a1a1aa;
                  "
                >
                  This is an automated security
                  email from PROMPT.
                </p>

                <p
                  style="
                    margin:
                      6px 0
                      0 0;

                    font-size: 12px;
                    line-height: 18px;
                    color: #a1a1aa;
                  "
                >
                  Please do not reply to this
                  message.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
          `.trim(),
        }),
      },
    );

  /* =======================================================
     PROVIDER ERROR
  ======================================================= */

  if (!response.ok) {
    const providerResponse =
      await response
        .text()
        .catch(
          () => "",
        );

    console.error(
      "Password-reset email provider error:",
      response.status,
      providerResponse,
    );

    throw new Error(
      `Unable to send password reset email. Provider returned ${response.status}.`,
    );
  }
}