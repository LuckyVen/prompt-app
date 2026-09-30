import {
  LogOut,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../hooks/useAuth";

function ProfilePage() {
  const navigate = useNavigate();

  const {
    user,
    isLoading,
    logout,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-primary" />

          <p className="text-sm text-zinc-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");

  function handleLogout() {
    logout();

    navigate(
      "/login",
      {
        replace: true,
      },
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-primary">
          Account
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Profile
        </h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          View your account information and profile details.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-semibold text-white">
              {initials || "U"}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-zinc-900">
                {user.name}
              </h2>

              <p className="mt-1 truncate text-sm text-zinc-500">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-zinc-900">
              Account information
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              These details come from your authenticated PROMPT. account.
            </p>
          </div>

          <div className="divide-y divide-zinc-100">
            <div className="grid gap-2 py-5 sm:grid-cols-[180px_1fr] sm:items-center">
              <div>
                <p className="text-sm font-medium text-zinc-700">
                  Full name
                </p>
              </div>

              <div>
                <p className="wrap-break-word text-sm text-zinc-900">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="grid gap-2 py-5 sm:grid-cols-[180px_1fr] sm:items-center">
              <div>
                <p className="text-sm font-medium text-zinc-700">
                  Email address
                </p>
              </div>

              <div>
                <p className="wrap-break-word text-sm text-zinc-900">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="grid gap-2 py-5 sm:grid-cols-[180px_1fr] sm:items-center">
              <div>
                <p className="text-sm font-medium text-zinc-700">
                  Account ID
                </p>
              </div>

              <div>
                <p className="break-all font-mono text-xs text-zinc-500">
                  {user.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white px-6 py-5 sm:px-8">
        <h3 className="text-sm font-semibold text-zinc-900">
          Authentication
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Your profile is connected to your authenticated account and is
          restored automatically when your saved session is valid.
        </p>

        <div className="mt-5 border-t border-zinc-100 pt-5">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut
              aria-hidden="true"
              className="size-4"
            />

            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;