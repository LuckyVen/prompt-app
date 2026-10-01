import {
  FileText,
  Heart,
  LayoutGrid,
  Menu,
  Plus,
  Settings,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  NavLink,
} from "react-router-dom";

import AccountMenu from "../account/AccountMenu";

interface TopBarProps {
  transparent?: boolean;
}

const mobileNavigationItems = [
  {
    label: "My Prompts",
    to: "/prompts",
    icon: FileText,
  },

  {
    label: "Favorites",
    to: "/favorites",
    icon: Heart,
  },

  {
    label: "Templates",
    to: "/templates",
    icon: LayoutGrid,
  },

  {
    label: "Profile",
    to: "/profile",
    icon: UserRound,
  },

  {
    label: "Settings",
    to: "/settings",
    icon: Settings,
  },
];

function TopBar({
  transparent = false,
}: TopBarProps) {
  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  /* =========================================
     ESCAPE + BODY SCROLL
  ========================================= */

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape"
      ) {
        setIsMobileMenuOpen(
          false,
        );
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    if (isMobileMenuOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        "";
    };
  }, [isMobileMenuOpen]);

  function closeMobileMenu() {
    setIsMobileMenuOpen(
      false,
    );
  }

  return (
    <>
      {/* =========================================
          TOP BAR
      ========================================= */}

      <header
        className={[
          `
            relative
            z-40
            flex
            h-16
            w-full
            min-w-0
            shrink-0
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          `,

          transparent
            ? "bg-transparent"
            : "bg-surface",
        ].join(" ")}
      >
        {/* =======================================
            MOBILE LEFT
        ======================================= */}

        <div className="flex min-w-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={
              isMobileMenuOpen
            }
            onClick={() =>
              setIsMobileMenuOpen(
                true,
              )
            }
            className="
              flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-text-secondary
              transition
              hover:bg-white/5
              hover:text-text-primary
            "
          >
            <Menu
              size={21}
              strokeWidth={1.8}
            />
          </button>

          <Link
            to="/"
            className="
              truncate
              text-lg
              font-semibold
              tracking-[-0.03em]
              text-text-primary
            "
          >
            PROMPT.
          </Link>
        </div>

        {/* =======================================
            DESKTOP SPACER
        ======================================= */}

        <div className="hidden lg:block" />

        {/* =======================================
            ACCOUNT
        ======================================= */}

        <AccountMenu variant="avatar" />
      </header>

      {/* =========================================
          MOBILE DRAWER
      ========================================= */}
      
      <div
        aria-hidden={
          !isMobileMenuOpen
        }
        className={[
          `
            fixed
            inset-0
            z-[200]
            lg:hidden
      
            transition
            duration-300
          `,
      
          isMobileMenuOpen
            ? "pointer-events-auto"
            : "pointer-events-none",
        ].join(" ")}
      >
        {/* =====================================
            BACKDROP
        ===================================== */}
      
        <button
          type="button"
          tabIndex={
            isMobileMenuOpen
              ? 0
              : -1
          }
          aria-label="Close navigation"
          onClick={
            closeMobileMenu
          }
          className={[
            `
              absolute
              inset-0
              bg-black/55
              backdrop-blur-[2px]
      
              transition-opacity
              duration-300
              ease-out
            `,
      
            isMobileMenuOpen
              ? "opacity-100"
              : "opacity-0",
          ].join(" ")}
        />
      
        {/* =====================================
            DRAWER
        ===================================== */}
      
        <aside
          className={[
            `
              absolute
              inset-y-0
              left-0
      
              flex
              w-[min(84vw,320px)]
              flex-col
      
              border-r
              border-border
              bg-surface
              shadow-2xl
      
              will-change-transform
      
              transition-transform
              duration-300
              ease-[cubic-bezier(0.22,1,0.36,1)]
            `,
      
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full",
          ].join(" ")}
        >
          {/* ===================================
              DRAWER HEADER
          =================================== */}
      
          <div
            className="
              flex
              h-16
              shrink-0
              items-center
              justify-between
              px-4
            "
          >
            <Link
              to="/"
              onClick={
                closeMobileMenu
              }
              className="
                text-lg
                font-semibold
                tracking-[-0.03em]
                text-text-primary
              "
            >
              PROMPT.
            </Link>
      
            <button
              type="button"
              aria-label="Close navigation"
              onClick={
                closeMobileMenu
              }
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-xl
                text-text-secondary
      
                transition
                duration-200
      
                hover:bg-background
                hover:text-text-primary
      
                active:scale-95
              "
            >
              <X
                size={20}
                strokeWidth={1.8}
              />
            </button>
          </div>
      
          {/* ===================================
              NEW PROMPT
          =================================== */}
      
          <div className="px-4 pt-3">
            <Link
              to="/"
              onClick={
                closeMobileMenu
              }
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-primary
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-primary-hover
              "
            >
              <Plus
                size={18}
                strokeWidth={2}
              />
      
              New Prompt
            </Link>
          </div>
      
          {/* ===================================
              NAVIGATION
          =================================== */}
      
          <nav
            className="
              min-h-0
              flex-1
              overflow-y-auto
              px-3
              py-6
            "
          >
            <div className="space-y-1">
              {mobileNavigationItems.map(
                (item) => {
                  const Icon =
                    item.icon;
      
                  return (
                    <NavLink
                      key={
                        item.to
                      }
                      to={
                        item.to
                      }
                      end
                      onClick={
                        closeMobileMenu
                      }
                      className={({
                        isActive,
                      }) =>
                        [
                          `
                            flex
                            h-11
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            text-sm
                            font-medium
                            transition-colors
                          `,
      
                          isActive
                            ? "bg-primary-soft text-primary"
                            : "text-text-secondary hover:bg-background hover:text-text-primary",
                        ].join(
                          " ",
                        )
                      }
                    >
                      <Icon
                        size={18}
                        strokeWidth={
                          1.8
                        }
                      />
      
                      <span>
                        {
                          item.label
                        }
                      </span>
                    </NavLink>
                  );
                },
              )}
            </div>
          </nav>
      
          {/* ===================================
              BOTTOM NOTE
          =================================== */}
      
          <div
            className="
              shrink-0
              border-t
              border-border
              px-5
              py-4
            "
          >
            <p className="text-xs text-text-muted">
              PROMPT.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

export default TopBar;