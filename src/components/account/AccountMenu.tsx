import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Lightbulb,
  LogOut,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../hooks/useAuth";

/* =========================================================
   TYPES
========================================================= */

interface AccountMenuProps {
  variant:
    | "sidebar"
    | "avatar";
}

type MenuView =
  | "main"
  | "help"
  | "learn";

/* =========================================================
   ACCOUNT MENU
========================================================= */

function AccountMenu({
  variant,
}: AccountMenuProps) {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    user,
    logout,
  } = useAuth();

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    menuView,
    setMenuView,
  ] =
    useState<MenuView>(
      "main",
    );

  const menuRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  /* =======================================================
     CLOSE
  ======================================================= */

  function closeMenu() {
    setIsOpen(
      false,
    );

    setMenuView(
      "main",
    );
  }

  /* =======================================================
     CLICK OUTSIDE + ESCAPE
  ======================================================= */

  useEffect(() => {
    function handlePointerDown(
      event: MouseEvent,
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        closeMenu();
      }
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        closeMenu();
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  /* =======================================================
     USER
  ======================================================= */

  if (!user) {
    return null;
  }

  const currentUser =
    user;

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
     LOGOUT
  ======================================================= */

  function handleLogout() {
    closeMenu();

    logout();

    navigate(
      "/login",
      {
        replace: true,
      },
    );
  }

  /* =======================================================
     MENU ITEM CLASS
  ======================================================= */

  function getMenuItemClass(
    path?: string,
  ) {
    const active =
      path
        ? location.pathname ===
          path
        : false;

    return [
      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium transition",

      active
        ? "bg-primary-soft text-primary"
        : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950",
    ].join(" ");
  }

  /* =======================================================
     ICON WRAPPER
  ======================================================= */

  const iconClass =
    "flex size-7 shrink-0 items-center justify-center text-zinc-500";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      ref={menuRef}
      className={
        variant === "sidebar"
          ? "relative w-full"
          : "relative w-auto"
      }
    >
      {/* ===================================================
          SIDEBAR TRIGGER
      =================================================== */}

      {variant ===
      "sidebar" ? (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={
            isOpen
          }
          onClick={() => {
            setIsOpen(
              (current) =>
                !current,
            );

            setMenuView(
              "main",
            );
          }}
          className={[
            "flex w-full min-w-0 items-center gap-2 rounded-xl px-2 py-1.5 text-left transition",

            isOpen
              ? "bg-primary-soft"
              : "hover:bg-background",
          ].join(" ")}
        >
          {/* Avatar */}

          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-[11px] font-semibold text-primary">
            {initials ||
              "U"}
          </div>

          {/* Name */}

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-5 text-text-primary">
              {
                currentUser.name
              }
            </p>

            <p className="truncate text-[11px] leading-4 text-text-muted">
              {
                currentUser.email
              }
            </p>
          </div>

          <ChevronDown
            size={14}
            strokeWidth={1.8}
            className={[
              "shrink-0 text-text-muted transition-transform",

              isOpen
                ? "rotate-180"
                : "",
            ].join(" ")}
          />
        </button>
      ) : (
        /* =================================================
           TOP BAR AVATAR
        ================================================= */

        <button
          type="button"
          aria-label="Open account menu"
          aria-haspopup="menu"
          aria-expanded={
            isOpen
          }
          onClick={() => {
            setIsOpen(
              (current) =>
                !current,
            );

            setMenuView(
              "main",
            );
          }}
          className={[
            "flex size-10 items-center justify-center rounded-full text-xs font-semibold transition",

            isOpen
              ? "bg-primary text-white"
              : "bg-primary-soft text-primary hover:bg-primary hover:text-white",
          ].join(" ")}
        >
          {initials ||
            "U"}
        </button>
      )}

      {/* ===================================================
          DROPDOWN
      =================================================== */}

      {isOpen && (
        <div
          role="menu"
          className={[
            "absolute z-[150] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_18px_55px_rgba(24,24,27,0.15)]",

            variant ===
            "sidebar"
              ? "bottom-[calc(100%+6px)] left-0 right-0"
              : "right-0 top-[calc(100%+8px)] w-[270px]",
          ].join(" ")}
        >
          {/* =================================================
              MAIN
          ================================================= */}

          {menuView ===
            "main" && (
            <>
              {/* =============================================
                  ACCOUNT HEADER
              ============================================= */}

              <div className="border-b border-zinc-100 px-2.5 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-semibold text-white">
                    {initials ||
                      "U"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-zinc-950">
                      {
                        currentUser.name
                      }
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                      {
                        currentUser.email
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* =============================================
                  MENU ITEMS
              ============================================= */}

              <div className="p-1">
                {/* Profile */}

                <Link
                  to="/profile"
                  role="menuitem"
                  onClick={
                    closeMenu
                  }
                  className={getMenuItemClass(
                    "/profile",
                  )}
                >
                  <div className={iconClass}>
                    <UserRound
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <span>
                    Profile
                  </span>
                </Link>

                {/* Settings */}

                <Link
                  to="/settings"
                  role="menuitem"
                  onClick={
                    closeMenu
                  }
                  className={getMenuItemClass(
                    "/settings",
                  )}
                >
                  <div className={iconClass}>
                    <Settings
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <span>
                    Settings
                  </span>
                </Link>

                <div className="mx-2 my-1 h-px bg-zinc-100" />

                {/* Get help */}

                <button
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    setMenuView(
                      "help",
                    )
                  }
                  className={
                    getMenuItemClass()
                  }
                >
                  <div className={iconClass}>
                    <CircleHelp
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <span className="flex-1">
                    Get help
                  </span>

                  <ChevronRight
                    size={14}
                    strokeWidth={1.8}
                    className="text-zinc-400"
                  />
                </button>

                {/* Learn more */}

                <button
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    setMenuView(
                      "learn",
                    )
                  }
                  className={
                    getMenuItemClass()
                  }
                >
                  <div className={iconClass}>
                    <BookOpen
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <span className="flex-1">
                    Learn more
                  </span>

                  <ChevronRight
                    size={14}
                    strokeWidth={1.8}
                    className="text-zinc-400"
                  />
                </button>
              </div>

              {/* =============================================
                  LOGOUT
              ============================================= */}

              <div className="border-t border-zinc-100 p-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={
                    handleLogout
                  }
                  className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-lg
                    px-2
                    py-1.5
                    text-left
                    text-sm
                    font-medium
                    text-zinc-700
                    transition
                    hover:bg-red-50
                    hover:text-red-600
                  "
                >
                  <div className={iconClass}>
                    <LogOut
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <span>
                    Log out
                  </span>
                </button>
              </div>
            </>
          )}

          {/* =================================================
              HELP
          ================================================= */}

          {menuView ===
            "help" && (
            <>
              <div className="flex items-center gap-2 border-b border-zinc-100 px-2 py-2">
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() =>
                    setMenuView(
                      "main",
                    )
                  }
                  className="flex size-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
                >
                  <ArrowLeft
                    size={16}
                  />
                </button>

                <p className="text-sm font-semibold text-zinc-950">
                  Get help
                </p>
              </div>

              <div className="p-2">
                <div className="rounded-lg bg-zinc-50 p-3">
                  <CircleHelp
                    size={17}
                    className="text-primary"
                  />

                  <h3 className="mt-2 text-sm font-semibold text-zinc-950">
                    Need help?
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Start with a simple
                    idea and Smart Builder
                    will guide you through
                    the missing details.
                  </p>
                </div>

                <div className="mt-1">
                  <Link
                    to="/"
                    onClick={
                      closeMenu
                    }
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    <Sparkles
                      size={16}
                      className="text-zinc-400"
                    />

                    Start a prompt
                  </Link>

                  <Link
                    to="/settings"
                    onClick={
                      closeMenu
                    }
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    <Settings
                      size={16}
                      className="text-zinc-400"
                    />

                    Account settings
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* =================================================
              LEARN MORE
          ================================================= */}

          {menuView ===
            "learn" && (
            <>
              <div className="flex items-center gap-2 border-b border-zinc-100 px-2 py-2">
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() =>
                    setMenuView(
                      "main",
                    )
                  }
                  className="flex size-7 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
                >
                  <ArrowLeft
                    size={16}
                  />
                </button>

                <p className="text-sm font-semibold text-zinc-950">
                  Learn more
                </p>
              </div>

              <div className="p-2">
                <div className="rounded-lg bg-primary-soft p-3">
                  <Lightbulb
                    size={17}
                    className="text-primary"
                  />

                  <h3 className="mt-2 text-sm font-semibold text-zinc-950">
                    About PROMPT.
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    PROMPT. turns rough
                    ideas into clearer,
                    structured prompts.
                  </p>
                </div>

                <div className="space-y-2 px-2 py-3">
                  <div className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />

                    <p className="text-xs leading-5 text-zinc-600">
                      Start with a simple idea.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />

                    <p className="text-xs leading-5 text-zinc-600">
                      Answer guided questions.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />

                    <p className="text-xs leading-5 text-zinc-600">
                      Review, save, and reuse your final prompt.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AccountMenu;