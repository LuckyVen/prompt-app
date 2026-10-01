import {
  Check,
  Copy,
  FileText,
  Heart,
  KeyRound,
  LayoutGrid,
  Settings,
  Sparkles,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../../hooks/useAuth";

/* =========================================================
   HELPERS
========================================================= */

function formatAccountDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}

/* =========================================================
   PROFILE PAGE
========================================================= */

function ProfilePage() {
  const {
    user,
    isLoading,
  } = useAuth();

  const [
    copied,
    setCopied,
  ] = useState(false);

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-primary" />

          <p className="mt-3 text-sm text-zinc-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     NO USER
  ======================================================= */

  if (!user) {
    return null;
  }

  /*
   * Store the authenticated user in a non-null
   * variable after the guard above.
   *
   * This prevents:
   *
   * 'user' is possibly 'null'
   *
   * inside nested functions such as copyAccountId().
   */
  const currentUser =
    user;

  /* =======================================================
     INITIALS
  ======================================================= */

  const initials =
    currentUser.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part
          .charAt(0)
          .toUpperCase(),
      )
      .join("");

  /* =======================================================
     COPY ACCOUNT ID
  ======================================================= */

  async function copyAccountId() {
    try {
      await navigator.clipboard.writeText(
        currentUser.id,
      );

      setCopied(true);

      window.setTimeout(
        () => {
          setCopied(false);
        },
        1800,
      );
    } catch {
      setCopied(false);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-7">
          <p className="text-sm font-semibold text-primary">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl">
            Your profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            View your account information,
            manage your workspace, and access
            account-related settings.
          </p>
        </div>

        <div className="space-y-5">
          {/* =================================================
              PROFILE HERO
          ================================================= */}

          <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_8px_30px_rgba(24,24,27,0.04)] sm:p-8">
            {/* Decorative background */}

            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* User */}

              <div className="flex min-w-0 items-center gap-5">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-primary text-xl font-semibold text-white shadow-sm">
                  {initials || "U"}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    PROMPT. account
                  </p>

                  <h2 className="mt-2 truncate text-2xl font-semibold tracking-tight text-zinc-950">
                    {currentUser.name}
                  </h2>

                  <p className="mt-1 truncate text-sm text-zinc-500">
                    {currentUser.email}
                  </p>

                  {/* Real session state, not fake account status */}

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    <span className="size-1.5 rounded-full bg-emerald-500" />

                    Signed in
                  </div>
                </div>
              </div>

              {/* Hero actions */}

              <div className="flex flex-wrap gap-2">
                <Link
                  to="/settings"
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
                >
                  <Settings
                    size={16}
                    strokeWidth={1.8}
                  />

                  Settings
                </Link>

                <Link
                  to="/"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  <Sparkles
                    size={16}
                    strokeWidth={1.8}
                  />

                  New prompt
                </Link>
              </div>
            </div>
          </section>

          {/* =================================================
              MAIN PROFILE GRID
          ================================================= */}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)]">
            {/* ===============================================
                ACCOUNT INFORMATION
            =============================================== */}

            <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(24,24,27,0.035)]">
              {/* Header */}

              <div className="border-b border-zinc-100 px-6 py-5 sm:px-7">
                <h2 className="text-base font-semibold text-zinc-950">
                  Account information
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Details connected to your authenticated PROMPT. account.
                </p>
              </div>

              {/* Information rows */}

              <div className="divide-y divide-zinc-100 px-6 sm:px-7">
                {/* Full name */}

                <div className="grid gap-2 py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
                  <p className="text-sm font-medium text-zinc-500">
                    Full name
                  </p>

                  <p className="break-words text-sm font-medium text-zinc-900">
                    {currentUser.name}
                  </p>
                </div>

                {/* Email */}

                <div className="grid gap-2 py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
                  <p className="text-sm font-medium text-zinc-500">
                    Email address
                  </p>

                  <p className="break-all text-sm font-medium text-zinc-900">
                    {currentUser.email}
                  </p>
                </div>

                {/* Joined */}

                <div className="grid gap-2 py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
                  <p className="text-sm font-medium text-zinc-500">
                    Member since
                  </p>

                  <p className="text-sm font-medium text-zinc-900">
                    {formatAccountDate(
                      currentUser.created_at,
                    )}
                  </p>
                </div>

                {/* Account ID */}

                <div className="grid gap-3 py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
                  <p className="text-sm font-medium text-zinc-500">
                    Account ID
                  </p>

                  <div className="flex min-w-0 items-center gap-2">
                    <code className="min-w-0 flex-1 truncate rounded-lg bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-500">
                      {currentUser.id}
                    </code>

                    <button
                      type="button"
                      onClick={
                        copyAccountId
                      }
                      aria-label="Copy account ID"
                      title={
                        copied
                          ? "Copied"
                          : "Copy account ID"
                      }
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-4 focus:ring-primary/10"
                    >
                      {copied ? (
                        <Check
                          size={16}
                          strokeWidth={2}
                          className="text-emerald-600"
                        />
                      ) : (
                        <Copy
                          size={16}
                          strokeWidth={1.8}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ===============================================
                SECURITY
            =============================================== */}

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_8px_30px_rgba(24,24,27,0.035)]">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <KeyRound
                  size={20}
                  strokeWidth={1.8}
                />
              </div>

              <h2 className="mt-5 text-base font-semibold text-zinc-950">
                Sign-in & security
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Your session is connected to your authenticated PROMPT. account.
              </p>

              {/* Current session */}

              <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs font-medium text-zinc-400">
                  Current session
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-zinc-800">
                  <span className="size-2 rounded-full bg-emerald-500" />

                  Signed in
                </div>
              </div>

              {/* Password reset */}

              <Link
                to="/forgot-password"
                className="mt-4 flex h-10 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
              >
                Reset password
              </Link>
            </section>
          </div>

          {/* =================================================
              WORKSPACE
          ================================================= */}

          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_8px_30px_rgba(24,24,27,0.035)] sm:p-7">
            <div>
              <h2 className="text-base font-semibold text-zinc-950">
                Your workspace
              </h2>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Jump back into the parts of PROMPT. you use most.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {/* My Prompts */}

              <Link
                to="/prompts"
                className="group rounded-2xl border border-zinc-200 p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-[#faf9ff] hover:shadow-sm"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition group-hover:bg-primary-soft group-hover:text-primary">
                  <FileText
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-zinc-900">
                  My Prompts
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  View and manage your saved prompts.
                </p>
              </Link>

              {/* Favorites */}

              <Link
                to="/favorites"
                className="group rounded-2xl border border-zinc-200 p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-[#faf9ff] hover:shadow-sm"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition group-hover:bg-primary-soft group-hover:text-primary">
                  <Heart
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-zinc-900">
                  Favorites
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Return to prompts you marked as favorites.
                </p>
              </Link>

              {/* Templates */}

              <Link
                to="/templates"
                className="group rounded-2xl border border-zinc-200 p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-[#faf9ff] hover:shadow-sm"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition group-hover:bg-primary-soft group-hover:text-primary">
                  <LayoutGrid
                    size={18}
                    strokeWidth={1.8}
                  />
                </div>

                <p className="mt-4 text-sm font-semibold text-zinc-900">
                  Templates
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Start with a reusable prompt structure.
                </p>
              </Link>
            </div>
          </section>

          {/* =================================================
              SMALL ACCOUNT NOTE
          ================================================= */}

          <div className="px-1 pb-2 pt-1">
            <p className="text-xs leading-5 text-zinc-400">
              Your profile information comes from your authenticated PROMPT. account.
              Sensitive credentials such as your password are never displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;