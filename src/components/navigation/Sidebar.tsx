import {
  FileText,
  Heart,
  LayoutGrid,
  Plus,
} from "lucide-react";

import {
  Link,
  NavLink,
} from "react-router-dom";

import AccountMenu from "../account/AccountMenu";

/* =========================================================
   NAVIGATION
========================================================= */

const navigationItems = [
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
];

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar() {
  return (
    <aside
      className="
        hidden
        h-full
        w-[260px]
        shrink-0
        flex-col
        border-r
        border-border
        bg-surface
        lg:flex
      "
    >
      {/* =================================================
          BRAND
      ================================================= */}

      <div className="flex h-16 shrink-0 items-center px-5">
        <Link
          to="/"
          className="text-xl font-semibold tracking-[-0.03em] text-text-primary"
        >
          PROMPT.
        </Link>
      </div>

      {/* =================================================
          NEW PROMPT
      ================================================= */}

      <div className="px-4 pt-3">
        <Link
          to="/"
          className="
            flex
            h-11
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

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-1">
          {navigationItems.map(
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
                  className={({
                    isActive,
                  }) =>
                    [
                      "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",

                      isActive
                        ? "bg-primary-soft text-primary"
                        : "text-text-secondary hover:bg-background hover:text-text-primary",
                    ].join(" ")
                  }
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
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

      {/* =================================================
          ACCOUNT
      ================================================= */}

      <div className="shrink-0 border-t border-border p-2">
        <AccountMenu variant="sidebar" />
      </div>
    </aside>
  );
}

export default Sidebar;