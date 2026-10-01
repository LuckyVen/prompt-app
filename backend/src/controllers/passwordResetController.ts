import bcrypt from "bcrypt";

import {
  randomUUID,
} from "node:crypto";

import type {
  Request,
  Response,
} from "express";

import {
  db,
} from "../database/db.js";

import {
  buildPasswordResetUrl,
  createPasswordResetToken,
  hashPasswordResetToken,
  sendPasswordResetEmail,
} from "../services/passwordResetService.js";

const SALT_ROUNDS = 12;

const GENERIC_SUCCESS_MESSAGE =
  "If an account exists for that email, password reset instructions have been sent.";

export async function requestPasswordReset(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const body =
      request.body as
        | {
            email?: unknown;
          }
        | undefined;

    const email =
      body?.email;

    if (
      typeof email !== "string" ||
      !email.includes("@")
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

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    const userResult =
      await db.query(
        `
          SELECT
            id,
            email
          FROM users
          WHERE email = $1
          LIMIT 1;
        `,
        [
          normalizedEmail,
        ],
      );

    /*
     * Do not reveal whether an account exists.
     */
    if (
      userResult.rowCount === null ||
      userResult.rowCount === 0
    ) {
      response
        .status(200)
        .json({
          success: true,
          message:
            GENERIC_SUCCESS_MESSAGE,
        });

      return;
    }

    const user =
      userResult.rows[0] as {
        id: string;
        email: string;
      };

    /*
     * Invalidate any previously unused
     * reset requests for this user.
     */
    await db.query(
      `
        DELETE FROM password_reset_tokens
        WHERE user_id = $1
          AND used_at IS NULL;
      `,
      [
        user.id,
      ],
    );

    const {
      token,
      tokenHash,
      expiresAt,
    } =
      createPasswordResetToken();

    const resetId =
      randomUUID();

    await db.query(
      `
        INSERT INTO password_reset_tokens (
          id,
          user_id,
          token_hash,
          expires_at
        )
        VALUES ($1, $2, $3, $4);
      `,
      [
        resetId,
        user.id,
        tokenHash,
        expiresAt,
      ],
    );

    const resetUrl =
      buildPasswordResetUrl(
        token,
      );

    try {
      await sendPasswordResetEmail(
        user.email,
        resetUrl,
      );
    } catch (error) {
      /*
       * Remove the unusable token if delivery fails.
       */
      await db.query(
        `
          DELETE FROM password_reset_tokens
          WHERE id = $1;
        `,
        [
          resetId,
        ],
      );

      console.error(
        "Password reset delivery error:",
        error,
      );
    }

    /*
     * Always return the same public response.
     * This helps prevent email/account enumeration.
     */
    response
      .status(200)
      .json({
        success: true,
        message:
          GENERIC_SUCCESS_MESSAGE,
      });
  } catch (error) {
    console.error(
      "Request password reset error:",
      error,
    );

    response
      .status(500)
      .json({
        success: false,
        message:
          "Unable to process password reset request.",
      });
  }
}

export async function resetPassword(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const body =
      request.body as
        | {
            token?: unknown;
            password?: unknown;
          }
        | undefined;

    const token =
      body?.token;

    const password =
      body?.password;

    if (
      typeof token !== "string" ||
      token.trim().length < 32
    ) {
      response
        .status(400)
        .json({
          success: false,
          message:
            "Reset link is invalid or expired.",
        });

      return;
    }

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      response
        .status(400)
        .json({
          success: false,
          message:
            "Password must contain at least 8 characters.",
        });

      return;
    }

    const tokenHash =
      hashPasswordResetToken(
        token.trim(),
      );

    const tokenResult =
      await db.query(
        `
          SELECT
            id,
            user_id
          FROM password_reset_tokens
          WHERE token_hash = $1
            AND used_at IS NULL
            AND expires_at > NOW()
          LIMIT 1;
        `,
        [
          tokenHash,
        ],
      );

    if (
      tokenResult.rowCount === null ||
      tokenResult.rowCount === 0
    ) {
      response
        .status(400)
        .json({
          success: false,
          message:
            "Reset link is invalid or expired.",
        });

      return;
    }

    const resetRecord =
      tokenResult.rows[0] as {
        id: string;
        user_id: string;
      };

    const newPasswordHash =
      await bcrypt.hash(
        password,
        SALT_ROUNDS,
      );

    const client =
      await db.connect();

    try {
      await client.query(
        "BEGIN",
      );

      await client.query(
        `
          UPDATE users
          SET
            password_hash = $1,
            updated_at = NOW()
          WHERE id = $2;
        `,
        [
          newPasswordHash,
          resetRecord.user_id,
        ],
      );

      /*
       * Mark every outstanding reset token for
       * this account as used.
       *
       * This makes reset links single-use.
       */
      await client.query(
        `
          UPDATE password_reset_tokens
          SET used_at = NOW()
          WHERE user_id = $1
            AND used_at IS NULL;
        `,
        [
          resetRecord.user_id,
        ],
      );

      await client.query(
        "COMMIT",
      );
    } catch (error) {
      await client.query(
        "ROLLBACK",
      );

      throw error;
    } finally {
      client.release();
    }

    response
      .status(200)
      .json({
        success: true,
        message:
          "Password updated successfully. You can now sign in with your new password.",
      });
  } catch (error) {
    console.error(
      "Reset password error:",
      error,
    );

    response
      .status(500)
      .json({
        success: false,
        message:
          "Unable to reset password.",
      });
  }
}