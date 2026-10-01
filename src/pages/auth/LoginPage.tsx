import {
  type FormEvent,
  useState,
} from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  ApiError,
} from "../../services/api";

interface LoginLocationState {
  message?: string;
  from?: string;
}

function LoginPage() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    login,
  } = useAuth();

  const locationState =
    location.state as LoginLocationState | null;

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
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
        locationState?.from &&
        locationState.from.startsWith("/")
          ? locationState.from
          : "/";

      navigate(
        destination,
        {
          replace: true,
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
          "Unable to sign in. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      {/* =========================================
          HEADER
      ========================================= */}

      <div>
        <div className="mb-8 hidden lg:block">
          <p className="text-sm font-semibold tracking-tight text-primary">
            PROMPT.
          </p>
        </div>

        <p className="text-sm font-medium text-primary">
          Welcome back
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-zinc-950 sm:text-4xl">
          Sign in to your account
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
          Continue building, saving, and organizing your prompts.
        </p>
      </div>

      {/* =========================================
          SUCCESS MESSAGE
      ========================================= */}

      {locationState?.message && (
        <div
          role="status"
          className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
        >
          {locationState.message}
        </div>
      )}

      {/* =========================================
          FORM
      ========================================= */}

      <form
        onSubmit={handleSubmit}
        className="mt-8"
      >
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Email */}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-800"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              required
              value={email}
              disabled={isSubmitting}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              placeholder="you@example.com"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-zinc-200
                bg-white
                px-4
                text-sm
                text-zinc-950
                outline-none
                transition
                placeholder:text-zinc-400
                hover:border-zinc-300
                focus:border-primary
                focus:ring-4
                focus:ring-primary/10
                disabled:cursor-not-allowed
                disabled:bg-zinc-50
                disabled:opacity-70
              "
            />
          </div>

          {/* Password */}

          <div>
            <div className="mb-2 flex items-center justify-between gap-4">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-800"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-primary transition hover:text-primary-hover"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                required
                value={password}
                disabled={isSubmitting}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Enter your password"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-zinc-200
                  bg-white
                  px-4
                  pr-12
                  text-sm
                  text-zinc-950
                  outline-none
                  transition
                  placeholder:text-zinc-400
                  hover:border-zinc-300
                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/10
                  disabled:cursor-not-allowed
                  disabled:bg-zinc-50
                  disabled:opacity-70
                "
              />

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current,
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  flex
                  h-8
                  w-8
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-lg
                  text-zinc-400
                  transition
                  hover:bg-zinc-100
                  hover:text-zinc-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-primary/20
                  disabled:pointer-events-none
                  disabled:opacity-50
                "
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                    strokeWidth={1.8}
                  />
                ) : (
                  <Eye
                    size={18}
                    strokeWidth={1.8}
                  />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs leading-5 text-zinc-400">
              Your session stays signed in on this device until you log out or the session expires.
            </p>
          </div>
        </div>

        {/* =========================================
            SUBMIT
        ========================================= */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            mt-6
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            px-4
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-primary-hover
            focus:outline-none
            focus:ring-4
            focus:ring-primary/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
              />

              Signing in...
            </>
          ) : (
            <>
              Sign in

              <ArrowRight
                size={17}
                strokeWidth={2}
              />
            </>
          )}
        </button>
      </form>

      {/* =========================================
          CREATE ACCOUNT
      ========================================= */}

      <div className="mt-7 border-t border-zinc-100 pt-6">
        <p className="text-center text-sm text-zinc-500">
          New to PROMPT.?{" "}

          <Link
            to="/register"
            className="font-semibold text-primary transition hover:text-primary-hover"
          >
            Create an account
          </Link>
        </p>
      </div>

      {/* =========================================
          FOOTER INFO
      ========================================= */}

      <div className="mt-8 rounded-2xl bg-zinc-50 px-4 py-3">
        <p className="text-center text-xs leading-5 text-zinc-400">
          Sign in to access your saved prompts, favorites, and account workspace.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;