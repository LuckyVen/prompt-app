import {
  apiRequest,
} from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: AuthUser;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

export interface CurrentUserResponse {
  success: boolean;
  user: AuthUser;
}

export async function registerUser(
  input: RegisterInput,
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}

export async function loginUser(
  input: LoginInput,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
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