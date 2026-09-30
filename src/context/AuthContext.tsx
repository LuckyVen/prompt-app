import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ApiError,
} from "../services/api";

import {
  getCurrentUser,
  loginUser,
  type AuthUser,
  type LoginInput,
} from "../services/authService";

const AUTH_TOKEN_KEY =
  "prompt.authToken";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    input: LoginInput,
  ) => Promise<AuthUser>;

  logout: () => void;
}

export const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [
    user,
    setUser,
  ] =
    useState<AuthUser | null>(
      null,
    );

  const [
    token,
    setToken,
  ] =
    useState<string | null>(
      () =>
        localStorage.getItem(
          AUTH_TOKEN_KEY,
        ),
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  /*
   * ===============================================
   * LOGOUT
   * ===============================================
   */

  const logout =
    useCallback(() => {
      localStorage.removeItem(
        AUTH_TOKEN_KEY,
      );

      setToken(null);
      setUser(null);
    }, []);

  /*
   * ===============================================
   * LOGIN
   * ===============================================
   */

  const login =
    useCallback(
      async (
        input: LoginInput,
      ): Promise<AuthUser> => {
        const response =
          await loginUser(
            input,
          );

        /*
         * Store token BEFORE changing
         * authenticated React state.
         */

        localStorage.setItem(
          AUTH_TOKEN_KEY,
          response.token,
        );

        setToken(
          response.token,
        );

        setUser(
          response.user,
        );

        return response.user;
      },
      [],
    );

  /*
   * ===============================================
   * RESTORE SESSION AFTER REFRESH
   * ===============================================
   */

  useEffect(() => {
    let isActive =
      true;

    async function restoreSession() {
      /*
       * No stored token means the user
       * is genuinely logged out.
       */

      if (!token) {
        if (isActive) {
          setUser(null);
          setIsLoading(
            false,
          );
        }

        return;
      }

      setIsLoading(
        true,
      );

      try {
        /*
         * Validate the stored token and
         * restore the authenticated user.
         */

        const response =
          await getCurrentUser(
            token,
          );

        if (!isActive) {
          return;
        }

        setUser(
          response.user,
        );
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error(
          "Unable to restore authentication session:",
          error,
        );

        /*
         * IMPORTANT:
         *
         * Only remove the JWT when the server
         * explicitly says authentication is invalid.
         *
         * Do NOT destroy a valid login because of:
         *
         * - temporary network failure
         * - backend restarting
         * - database connection problem
         * - server 500 error
         */

        if (
          error instanceof
            ApiError &&
          (
            error.status ===
              401 ||
            error.status ===
              404
          )
        ) {
          localStorage.removeItem(
            AUTH_TOKEN_KEY,
          );

          setToken(
            null,
          );

          setUser(
            null,
          );

          return;
        }

        /*
         * Keep the stored token for temporary
         * backend/network errors.
         *
         * We do not claim the user is authenticated
         * until /auth/me succeeds.
         */

        setUser(
          null,
        );
      } finally {
        if (isActive) {
          setIsLoading(
            false,
          );
        }
      }
    }

    void restoreSession();

    return () => {
      isActive =
        false;
    };
  }, [
    token,
  ]);

  /*
   * ===============================================
   * CONTEXT VALUE
   * ===============================================
   */

  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,
        token,

        isAuthenticated:
          user !== null,

        isLoading,

        login,
        logout,
      }),
      [
        user,
        token,
        isLoading,
        login,
        logout,
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}