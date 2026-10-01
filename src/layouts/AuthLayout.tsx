import {
  Outlet,
} from "react-router-dom";

function AuthLayout() {
  return (
    <main className="min-h-screen bg-[#f8f8fa]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(520px,0.95fr)]">
        {/* =========================================
            DESKTOP BRAND PANEL
        ========================================= */}

        <section
          className="
            relative
            hidden
            overflow-hidden
            bg-[#111114]
            lg:flex
            lg:flex-col
          "
        >
          {/* =======================================
              AMBIENT BLURRED BACKGROUND
          ======================================= */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              overflow-hidden
            "
          >
            {/* Main top-left violet glow */}

            <div
              className="
                absolute
                -left-[180px]
                -top-[180px]
                h-[520px]
                w-[520px]
                rounded-full
                bg-[#6d5dfb]/25
                blur-[130px]
              "
            />

            {/* Mid-left blue/violet glow */}

            <div
              className="
                absolute
                -left-[120px]
                top-[30%]
                h-[420px]
                w-[420px]
                rounded-full
                bg-[#5146c8]/15
                blur-[130px]
              "
            />

            {/* Bottom-right purple glow */}

            <div
              className="
                absolute
                -bottom-[170px]
                -right-[130px]
                h-[520px]
                w-[520px]
                rounded-full
                bg-[#7968ff]/18
                blur-[140px]
              "
            />

            {/* Bottom-center soft indigo glow */}

            <div
              className="
                absolute
                bottom-[-180px]
                left-[35%]
                h-[460px]
                w-[460px]
                rounded-full
                bg-[#4338ca]/10
                blur-[150px]
              "
            />

            {/* Very subtle center haze */}

            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-[420px]
                w-[420px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-white/[0.025]
                blur-[140px]
              "
            />

            {/* Soft dark overlay for readability */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-transparent
                via-[#111114]/20
                to-[#111114]/50
              "
            />
          </div>

          {/* =======================================
              CONTENT
          ======================================= */}

          <div
            className="
              relative
              z-10
              flex
              h-full
              flex-col
              px-12
              py-10
              xl:px-16
              xl:py-12
            "
          >
            {/* =====================================
                BRAND
            ===================================== */}

            <div>
              <p
                className="
                  text-xl
                  font-semibold
                  tracking-tight
                  text-white
                "
              >
                PROMPT.
              </p>
            </div>

            {/* =====================================
                MAIN CONTENT
            ===================================== */}

            <div
              className="
                my-auto
                max-w-xl
                py-16
              "
            >
              {/* Badge */}

              <div
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.05]
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-zinc-300
                  backdrop-blur-sm
                "
              >
                Your prompt workspace
              </div>

              {/* Heading */}

              <h1
                className="
                  mt-7
                  max-w-lg
                  text-4xl
                  font-semibold
                  leading-[1.08]
                  tracking-[-0.04em]
                  text-white
                  xl:text-5xl
                "
              >
                Turn simple ideas into
                prompts worth using.
              </h1>

              {/* Description */}

              <p
                className="
                  mt-6
                  max-w-lg
                  text-base
                  leading-7
                  text-zinc-400
                "
              >
                PROMPT. helps you structure ideas,
                fill in missing details, and build
                clearer prompts without starting
                from a blank page.
              </p>

              {/* ===================================
                  FEATURE LIST
              =================================== */}

              <div className="mt-10 grid gap-3">
                {/* Feature 1 */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-white/[0.045]
                    px-4
                    py-3.5
                    backdrop-blur-sm
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary/15
                      text-sm
                      font-semibold
                      text-[#a89eff]
                    "
                  >
                    01
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Start with a rough idea
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        leading-5
                        text-zinc-500
                      "
                    >
                      You do not need to know how
                      to write the perfect prompt.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-white/[0.045]
                    px-4
                    py-3.5
                    backdrop-blur-sm
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary/15
                      text-sm
                      font-semibold
                      text-[#a89eff]
                    "
                  >
                    02
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Build the missing details
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        leading-5
                        text-zinc-500
                      "
                    >
                      Smart Builder helps turn your
                      idea into a useful structure.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-white/[0.045]
                    px-4
                    py-3.5
                    backdrop-blur-sm
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary/15
                      text-sm
                      font-semibold
                      text-[#a89eff]
                    "
                  >
                    03
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      Save and reuse your work
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-xs
                        leading-5
                        text-zinc-500
                      "
                    >
                      Keep your prompts organized
                      and ready for later.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================
                FOOTER
            ===================================== */}

            <p className="text-xs text-zinc-600">
              PROMPT. — Build better prompts from
              simpler ideas.
            </p>
          </div>
        </section>

        {/* =========================================
            AUTH FORM PANEL
        ========================================= */}

        <section
          className="
            flex
            min-h-screen
            flex-col
            bg-white
          "
        >
          {/* =======================================
              MOBILE BRAND
          ======================================= */}

          <div
            className="
              flex
              h-20
              items-center
              border-b
              border-zinc-100
              px-6
              lg:hidden
            "
          >
            <p
              className="
                text-lg
                font-semibold
                tracking-tight
                text-zinc-950
              "
            >
              PROMPT.
            </p>
          </div>

          {/* =======================================
              AUTH FORM
          ======================================= */}

          <div
            className="
              flex
              flex-1
              items-center
              justify-center
              px-6
              py-12
              sm:px-10
              lg:px-12
            "
          >
            <div className="w-full max-w-[460px]">
              <Outlet />
            </div>
          </div>

          {/* =======================================
              MOBILE FOOTER
          ======================================= */}

          <div
            className="
              px-6
              pb-8
              text-center
              lg:hidden
            "
          >
            <p className="text-xs text-zinc-400">
              Build better prompts from simpler
              ideas.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;