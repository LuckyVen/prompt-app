import {
  type FormEvent,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  registerUser,
} from "../../services/authService";

import {
  ApiError,
} from "../../services/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
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

    const trimmedName =
      name.trim();

    const trimmedEmail =
      email.trim();

    if (!trimmedName) {
      setError(
        "Please enter your name.",
      );

      return;
    }

    if (!trimmedEmail) {
      setError(
        "Please enter your email address.",
      );

      return;
    }

    if (!password) {
      setError(
        "Please enter a password.",
      );

      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters.",
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

      await registerUser({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      navigate(
        "/login",
        {
          replace: true,
          state: {
            message:
              "Account created successfully. You can now sign in.",
          },
        },
      );
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError(
          "Unable to create your account. Please try again.",
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
          Create your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Create an account to start building and saving better prompts.
        </p>
      </div>

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
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
            disabled={isSubmitting}
            placeholder="Your name"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

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
            autoComplete="new-password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value,
              )
            }
            disabled={isSubmitting}
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Confirm password
          </label>

          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value,
              )
            }
            disabled={isSubmitting}
            placeholder="Enter your password again"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Creating account..."
            : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary transition hover:text-primary-hover"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;