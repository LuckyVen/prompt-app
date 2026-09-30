import {
  FileText,
  Heart,
  LayoutTemplate,
  LogIn,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../hooks/useAuth";

interface NavigationItem {
  label: string;
  to: string;
  icon: typeof FileText;
}

const navigationItems: NavigationItem[] = [
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
    icon: LayoutTemplate,
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const initials = user?.name
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
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center px-5">
        <NavLink
          to="/"
          className="text-xl font-semibold tracking-tight text-text-primary"
        >
          PROMPT.
        </NavLink>
      </div>

      {/* New Prompt */}
      <div className="px-4 pt-3">
        <NavLink
          to="/"
          className="flex h-11 items-center justify-center gap-2 rounded-prompt-md bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          <Plus
            size={18}
            strokeWidth={2}
          />

          New Prompt
        </NavLink>
      </div>

      {/* Main Navigation */}
      <nav className="mt-6 flex-1 px-3">
        <div className="space-y-1">
          {navigationItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({
                    isActive,
                  }) =>
                    [
                      "flex h-10 items-center gap-3 rounded-prompt-md px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-soft text-primary"
                        : "text-text-secondary hover:bg-background hover:text-text-primary",
                    ].join(" ")
                  }
                >
                  <Icon
                    size={18}
                    strokeWidth={1.8}
                  />

                  <span>
                    {item.label}
                  </span>
                </NavLink>
              );
            },
          )}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-3">
        {user ? (
          <>
            <NavLink
              to="/settings"
              className={({
                isActive,
              }) =>
                [
                  "flex h-10 items-center gap-3 rounded-prompt-md px-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-text-secondary hover:bg-background hover:text-text-primary",
                ].join(" ")
              }
            >
              <Settings
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Settings
              </span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({
                isActive,
              }) =>
                [
                  "mt-2 flex items-center gap-3 rounded-prompt-md p-2 transition-colors",
                  isActive
                    ? "bg-primary-soft"
                    : "hover:bg-background",
                ].join(" ")
              }
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {initials || "U"}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">
                  {user.name}
                </p>

                <p className="truncate text-xs text-text-muted">
                  {user.email}
                </p>
              </div>
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 flex h-10 w-full items-center gap-3 rounded-prompt-md px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Log out
              </span>
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="flex h-10 items-center gap-3 rounded-prompt-md px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
          >
            <LogIn
              size={18}
              strokeWidth={1.8}
            />

            <span>
              Sign in
            </span>
          </NavLink>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;