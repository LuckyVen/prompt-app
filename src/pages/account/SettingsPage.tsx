import {
  Check,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";

import type {
  ThemePreference,
} from "../../context/ThemeContext";

import {
  useTheme,
} from "../../hooks/useTheme";

/* =========================================================
   THEME OPTIONS
========================================================= */

const themeOptions: {
  value: ThemePreference;
  label: string;
  description: string;
  icon: typeof Sun;
}[] = [
  {
    value: "light",
    label: "Light",
    description:
      "Always use the light appearance.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description:
      "Always use the dark appearance.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description:
      "Match your device appearance automatically.",
    icon: Monitor,
  },
];

/* =========================================================
   PREVIEW
========================================================= */

function ThemePreview({
  mode,
}: {
  mode: ThemePreference;
}) {
  const isDark =
    mode === "dark";

  const isSystem =
    mode === "system";

  return (
    <div
      className={[
        "relative h-[92px] overflow-hidden rounded-xl border",

        isDark
          ? "border-zinc-700 bg-[#151518]"
          : isSystem
            ? "border-zinc-300 bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_50%,#151518_50%,#151518_100%)]"
            : "border-zinc-200 bg-white",
      ].join(" ")}
    >
      {/* Sidebar */}

      <div
        className={[
          "absolute bottom-0 left-0 top-0 w-[28%] border-r",

          isDark
            ? "border-zinc-700 bg-[#111113]"
            : isSystem
              ? "border-zinc-300 bg-zinc-50"
              : "border-zinc-200 bg-zinc-50",
        ].join(" ")}
      />

      {/* Logo */}

      <div
        className={[
          "absolute left-2 top-2 h-2 w-7 rounded-full",

          isDark
            ? "bg-zinc-600"
            : "bg-zinc-300",
        ].join(" ")}
      />

      {/* Sidebar lines */}

      <div
        className={[
          "absolute left-2 top-7 h-1.5 w-8 rounded-full",

          isDark
            ? "bg-zinc-700"
            : "bg-zinc-200",
        ].join(" ")}
      />

      <div
        className={[
          "absolute left-2 top-11 h-1.5 w-10 rounded-full",

          isDark
            ? "bg-zinc-700"
            : "bg-zinc-200",
        ].join(" ")}
      />

      {/* Content */}

      <div className="absolute left-[38%] right-3 top-5">
        <div
          className={[
            "h-2 w-20 rounded-full",

            isDark
              ? "bg-zinc-600"
              : isSystem
                ? "bg-primary/50"
                : "bg-primary/40",
          ].join(" ")}
        />

        <div
          className={[
            "mt-3 h-1.5 w-full rounded-full",

            isDark
              ? "bg-zinc-700"
              : "bg-zinc-200",
          ].join(" ")}
        />

        <div
          className={[
            "mt-2 h-1.5 w-[72%] rounded-full",

            isDark
              ? "bg-zinc-700"
              : "bg-zinc-200",
          ].join(" ")}
        />

        <div className="mt-3 h-2 w-10 rounded-full bg-primary" />
      </div>
    </div>
  );
}

/* =========================================================
   SETTINGS PAGE
========================================================= */

function SettingsPage() {
  const {
    theme,
    setTheme,
    resolvedTheme,
  } = useTheme();

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">
            Settings
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
            Appearance
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            Choose how PROMPT. looks on this device.
            Your preference is saved automatically.
          </p>
        </div>

        {/* ===============================================
            APPEARANCE CARD
        =============================================== */}

        <section className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="border-b border-border px-5 py-5 sm:px-6">
            <h2 className="text-base font-semibold text-text-primary">
              Visual style
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Select the appearance that feels best for you.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div
              className="grid gap-3 md:grid-cols-3"
              role="radiogroup"
              aria-label="Appearance"
            >
              {themeOptions.map(
                (option) => {
                  const Icon =
                    option.icon;

                  const selected =
                    theme ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      role="radio"
                      aria-checked={
                        selected
                      }
                      onClick={() =>
                        setTheme(
                          option.value,
                        )
                      }
                      className={[
                        "group relative rounded-2xl border p-3 text-left transition",

                        selected
                          ? "border-primary bg-primary-soft shadow-sm"
                          : "border-border bg-background hover:border-primary/40",
                      ].join(" ")}
                    >
                      {/* Selected check */}

                      {selected && (
                        <div className="absolute right-5 top-5 z-10 flex size-6 items-center justify-center rounded-full bg-primary text-white">
                          <Check
                            size={14}
                            strokeWidth={2.5}
                          />
                        </div>
                      )}

                      {/* Preview */}

                      <ThemePreview
                        mode={
                          option.value
                        }
                      />

                      {/* Information */}

                      <div className="mt-4 flex items-start gap-3 px-1 pb-1">
                        <div
                          className={[
                            "flex size-9 shrink-0 items-center justify-center rounded-xl",

                            selected
                              ? "bg-primary text-white"
                              : "bg-primary-soft text-primary",
                          ].join(" ")}
                        >
                          <Icon
                            size={17}
                            strokeWidth={1.8}
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary">
                            {
                              option.label
                            }
                          </p>

                          <p className="mt-1 text-xs leading-5 text-text-muted">
                            {
                              option.description
                            }
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                },
              )}
            </div>

            {/* Current state */}

            <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Current appearance
                </p>

                <p className="mt-0.5 text-xs text-text-muted">
                  {theme ===
                  "system"
                    ? `System is currently using ${resolvedTheme} mode.`
                    : `PROMPT. is using ${resolvedTheme} mode.`}
                </p>
              </div>

              <div className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold capitalize text-primary">
                {theme}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;