import {
  Heart,
  Home,
  Library,
  Plus,
  UserRound,
} from "lucide-react";

import { Link, NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Home",
    to: "/",
    icon: Home,
    end: true,
  },
  {
    label: "Prompts",
    to: "/prompts",
    icon: Library,
    end: true,
  },
  {
    label: "Saved",
    to: "/favorites",
    icon: Heart,
    end: true,
  },
  {
    label: "Me",
    to: "/profile",
    icon: UserRound,
    end: true,
  },
];

function MobileBottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 w-full border-t border-border bg-surface lg:hidden
      "
    >
      <div className="grid h-16 w-full grid-cols-5 items-center px-1 pb-[env(safe-area-inset-bottom)]">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "flex h-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-text-muted hover:text-text-primary",
                ].join(" ")
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Primary New Prompt Action */}
        <div className="flex h-full items-center justify-center">
          <Link
            to="/"
            aria-label="Create new prompt"
            className="
              flex
              size-11
              items-center
              justify-center
              rounded-full
              bg-primary
              text-white
              shadow-sm
              transition
              hover:bg-primary-hover
              active:scale-95
            "
          >
            <Plus size={22} strokeWidth={2} />
          </Link>
        </div>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "flex h-full flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-text-muted hover:text-text-primary",
                ].join(" ")
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;