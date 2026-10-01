import {
  apiRequest,
} from "./api";

/* =========================================================
   USER
========================================================= */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/* =========================================================
   REGISTER
========================================================= */

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: AuthUser;
}

export async function registerUser(
  input: RegisterInput,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(
    "/auth/register",
    {
      method: "POST",

      body: JSON.stringify(
        input,
      ),
    },
  );
}

/* =========================================================
   LOGIN
========================================================= */

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

export async function loginUser(
  input: LoginInput,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    "/auth/login",
    {
      method: "POST",

      body: JSON.stringify(
        input,
      ),
    },
  );
}

/* =========================================================
   CURRENT USER
========================================================= */

export interface CurrentUserResponse {
  success: boolean;
  user: AuthUser;
}

export async function getCurrentUser(
  token: string,
): Promise<CurrentUserResponse> {
  return apiRequest<CurrentUserResponse>(
    "/auth/me",
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );
}

/* =========================================================
   FORGOT PASSWORD
========================================================= */

export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export async function requestPasswordReset(
  input: ForgotPasswordInput,
): Promise<ForgotPasswordResponse> {
  return apiRequest<ForgotPasswordResponse>(
    "/auth/forgot-password",
    {
      method: "POST",

      body: JSON.stringify(
        input,
      ),
    },
  );
}

/* =========================================================
   RESET PASSWORD
========================================================= */

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<ResetPasswordResponse> {
  return apiRequest<ResetPasswordResponse>(
    "/auth/reset-password",
    {
      method: "POST",

      body: JSON.stringify(
        input,
      ),
    },
  );
}