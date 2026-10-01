import {
  type FormEvent,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ApiError,
} from "../../services/api";

import {
  resetPassword,
} from "../../services/authService";

function ResetPasswordPage() {
  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const token =
    searchParams.get(
      "token",
    ) ?? "";

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");

    if (!token) {
      setError(
        "This password reset link is invalid.",
      );

      return;
    }

    if (
      password.length < 8
    ) {
      setError(
        "Password must contain at least 8 characters.",
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const result =
        await resetPassword({
          token,
          password,
        });

      navigate(
        "/login",
        {
          replace: true,
          state: {
            message:
              result.message,
          },
        },
      );
    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        setError(
          error.message,
        );
      } else {
        setError(
          "Unable to reset your password. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <p className="text-sm font-semibold text-primary">
        Account recovery
      </p>

      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-zinc-950">
        Create a new password
      </h1>

      <p className="mt-3 text-sm leading-6 text-zinc-500">
        Choose a new password for your PROMPT. account.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-7 space-y-5"
      >
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            New password
          </label>

          <div className="relative">
            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              value={password}
              disabled={isSubmitting}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              placeholder="At least 8 characters"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm text-zinc-950 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) =>
                    !current,
                )
              }
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff
                  size={18}
                />
              ) : (
                <Eye
                  size={18}
                />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Confirm new password
          </label>

          <input
            id="confirm-password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete="new-password"
            value={
              confirmPassword
            }
            disabled={isSubmitting}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value,
              )
            }
            placeholder="Repeat your new password"
            className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-950 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !token
          }
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
              />

              Updating password...
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>

      {!token && (
        <Link
          to="/forgot-password"
          className="mt-6 inline-block text-sm font-semibold text-primary"
        >
          Request a new reset link
        </Link>
      )}
    </div>
  );
}

export default ResetPasswordPage;