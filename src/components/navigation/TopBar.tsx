import {
  CircleHelp,
  LogIn,
  Menu,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../hooks/useAuth";

function TopBar() {
  const navigate =
    useNavigate();

  const {
    user,
  } = useAuth();

  /*
   * ===============================================
   * USER INITIALS
   * ===============================================
   */

  const initials =
    user?.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part
          .charAt(0)
          .toUpperCase(),
      )
      .join("") ??
    "";

  return (
    <header className="flex h-16 w-full min-w-0 shrink-0 items-center justify-between border-b border-border bg-surface px-3 sm:px-6 lg:px-8">

      {/* ========================================= */}
      {/* MOBILE BRAND                              */}
      {/* ========================================= */}

      <div className="flex min-w-0 items-center gap-1 sm:gap-2 lg:hidden">

        <button
          type="button"
          aria-label="Open menu"
          onClick={() =>
            navigate(
              "/templates",
            )
          }
          className="flex size-10 shrink-0 items-center justify-center rounded-prompt-md text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
        >
          <Menu
            size={20}
            strokeWidth={1.8}
          />
        </button>

        <Link
          to="/"
          className="truncate text-lg font-semibold tracking-tight text-text-primary"
        >
          PROMPT.
        </Link>

      </div>

      <div className="hidden lg:block" />

      {/* ========================================= */}
      {/* RIGHT ACTIONS                             */}
      {/* ========================================= */}

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">

        <button
          type="button"
          aria-label="Help"
          className="flex size-10 shrink-0 items-center justify-center rounded-prompt-md text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
        >
          <CircleHelp
            size={19}
            strokeWidth={1.8}
          />
        </button>

        {/* AUTHENTICATED USER */}

        {user ? (
          <Link
            to="/profile"
            aria-label={`Open ${user.name}'s profile`}
            title={user.name}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            {initials || "U"}
          </Link>
        ) : (

          /* LOGGED OUT */

          <Link
            to="/login"
            aria-label="Sign in"
            title="Sign in"
            className="flex size-9 shrink-0 items-center justify-center rounded-prompt-md text-text-secondary transition-colors hover:bg-background hover:text-primary"
          >
            <LogIn
              aria-hidden="true"
              className="size-4"
            />
          </Link>
        )}

      </div>

    </header>
  );
}

export default TopBar;