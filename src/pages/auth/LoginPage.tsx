import {
  type FormEvent,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ApiError,
} from "../../services/api";

import {
  useAuth,
} from "../../hooks/useAuth";

interface LoginLocationState {
  message?: string;
  from?: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
  } = useAuth();

  const locationState =
    location.state as LoginLocationState | null;

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const trimmedEmail =
      email.trim();

    if (!trimmedEmail) {
      setError(
        "Please enter your email address.",
      );

      return;
    }

    if (!password) {
      setError(
        "Please enter your password.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await login({
        email: trimmedEmail,
        password,
      });

      const destination =
        locationState?.from ?? "/";

      navigate(
        destination,
        {
          replace: true,
        },
      );
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError(
          "Unable to sign in. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-primary">
          PROMPT.
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Welcome back
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Sign in to continue building better prompts.
        </p>
      </div>

      {locationState?.message && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {locationState.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
            disabled={isSubmitting}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value,
              )
            }
            disabled={isSubmitting}
            placeholder="Enter your password"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Signing in..."
            : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-primary transition hover:text-primary-hover"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;