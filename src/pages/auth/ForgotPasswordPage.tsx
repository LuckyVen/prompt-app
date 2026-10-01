import {
  type FormEvent,
  useState,
} from "react";

import {
  ArrowLeft,
  LoaderCircle,
  Mail,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  ApiError,
} from "../../services/api";

import {
  requestPasswordReset,
} from "../../services/authService";

function ForgotPasswordPage() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
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
    setSuccessMessage("");

    const trimmedEmail =
      email.trim();

    if (!trimmedEmail) {
      setError(
        "Please enter your email address.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const result =
        await requestPasswordReset({
          email: trimmedEmail,
        });

      setSuccessMessage(
        result.message,
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
          "Unable to request a password reset. Please try again.",
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
        Forgot your password?
      </h1>

      <p className="mt-3 text-sm leading-6 text-zinc-500">
        Enter the email connected to your PROMPT. account.
        We&apos;ll send instructions for choosing a new password.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
        >
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-7"
      >
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-zinc-800"
        >
          Email address
        </label>

        <div className="relative">
          <Mail
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          />

          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            value={email}
            disabled={isSubmitting}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
            placeholder="you@example.com"
            className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle
                size={17}
                className="animate-spin"
              />

              Sending instructions...
            </>
          ) : (
            "Send reset instructions"
          )}
        </button>
      </form>

      <Link
        to="/login"
        className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-zinc-950"
      >
        <ArrowLeft
          size={16}
        />

        Back to sign in
      </Link>
    </div>
  );
}

export default ForgotPasswordPage;