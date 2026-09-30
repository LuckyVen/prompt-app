import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import type {
  Request,
  Response,
} from "express";

import {
  createAuthToken,
} from "../services/authService.js";

import type {
  AuthenticatedRequest,
} from "../middleware/authMiddleware.js";

import { db } from "../database/db.js";

const SALT_ROUNDS = 12;

export async function register(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const body =
      request.body as
        | {
            name?: unknown;
            email?: unknown;
            password?: unknown;
          }
        | undefined;
    
    if (!body) {
      response.status(400).json({
        success: false,
        message:
          "Request body is required.",
      });
    
      return;
    }
    
    const {
      name,
      email,
      password,
    } = body;

    // =============================================
    // VALIDATION
    // =============================================

    if (
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      response.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters.",
      });

      return;
    }

    if (
      typeof email !== "string" ||
      !email.includes("@")
    ) {
      response.status(400).json({
        success: false,
        message:
          "Please provide a valid email address.",
      });

      return;
    }

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      response.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters.",
      });

      return;
    }

    const normalizedName =
      name.trim();

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    // =============================================
    // CHECK EXISTING USER
    // =============================================

    const existingUser =
      await db.query(
        `
          SELECT id
          FROM users
          WHERE email = $1
          LIMIT 1;
        `,
        [normalizedEmail],
      );

    if (
      existingUser.rowCount !== null &&
      existingUser.rowCount > 0
    ) {
      response.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });

      return;
    }

    // =============================================
    // HASH PASSWORD
    // =============================================

    const passwordHash =
      await bcrypt.hash(
        password,
        SALT_ROUNDS,
      );

    // =============================================
    // CREATE USER
    // =============================================

    const userId =
      randomUUID();

    const result =
      await db.query(
        `
          INSERT INTO users (
            id,
            name,
            email,
            password_hash
          )
          VALUES ($1, $2, $3, $4)
          RETURNING
            id,
            name,
            email,
            created_at,
            updated_at;
        `,
        [
          userId,
          normalizedName,
          normalizedEmail,
          passwordHash,
        ],
      );

    response.status(201).json({
      success: true,
      message:
        "Account created successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error,
    );

    response.status(500).json({
      success: false,
      message:
        "Unable to create account.",
    });
  }
}

export async function login(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    const body =
      request.body as
        | {
            email?: unknown;
            password?: unknown;
          }
        | undefined;

    if (!body) {
      response.status(400).json({
        success: false,
        message:
          "Request body is required.",
      });

      return;
    }

    const {
      email,
      password,
    } = body;

    // =============================================
    // VALIDATION
    // =============================================

    if (
      typeof email !== "string" ||
      !email.includes("@")
    ) {
      response.status(400).json({
        success: false,
        message:
          "Please provide a valid email address.",
      });

      return;
    }

    if (
      typeof password !== "string" ||
      password.length === 0
    ) {
      response.status(400).json({
        success: false,
        message:
          "Password is required.",
      });

      return;
    }

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    // =============================================
    // FIND USER
    // =============================================

    const result =
      await db.query(
        `
          SELECT
            id,
            name,
            email,
            password_hash,
            created_at,
            updated_at
          FROM users
          WHERE email = $1
          LIMIT 1;
        `,
        [normalizedEmail],
      );

    if (
      result.rowCount === null ||
      result.rowCount === 0
    ) {
      response.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });

      return;
    }

    const user =
      result.rows[0] as {
        id: string;
        name: string;
        email: string;
        password_hash: string;
        created_at: Date;
        updated_at: Date;
      };

    // =============================================
    // VERIFY PASSWORD
    // =============================================

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password_hash,
      );

    if (!passwordMatches) {
      response.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });

      return;
    }

    // =============================================
    // CREATE AUTH TOKEN
    // =============================================
    
    const token =
      createAuthToken({
        userId: user.id,
        email: user.email,
      });
    
    // =============================================
    // SUCCESS
    // =============================================
    
    response.status(200).json({
      success: true,
      message:
        "Login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at:
          user.created_at,
        updated_at:
          user.updated_at,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error,
    );

    response.status(500).json({
      success: false,
      message:
        "Unable to log in.",
    });
  }
}

export async function getCurrentUser(
  request: AuthenticatedRequest,
  response: Response,
): Promise<void> {
  try {
    const userId =
      request.auth?.userId;

    if (!userId) {
      response.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

      return;
    }

    const result =
      await db.query(
        `
          SELECT
            id,
            name,
            email,
            created_at,
            updated_at
          FROM users
          WHERE id = $1
          LIMIT 1;
        `,
        [userId],
      );

    if (
      result.rowCount === null ||
      result.rowCount === 0
    ) {
      response.status(404).json({
        success: false,
        message:
          "User not found.",
      });

      return;
    }

    const user =
      result.rows[0] as {
        id: string;
        name: string;
        email: string;
        created_at: Date;
        updated_at: Date;
      };

    response.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at:
          user.created_at,
        updated_at:
          user.updated_at,
      },
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error,
    );

    response.status(500).json({
      success: false,
      message:
        "Unable to retrieve user.",
    });
  }
}