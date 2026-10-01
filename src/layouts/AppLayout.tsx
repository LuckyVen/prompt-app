import {
  Outlet,
  useLocation,
} from "react-router-dom";

import AmbientBlurBackground from "../components/ui/AmbientBlurBackground";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import Sidebar from "../components/navigation/Sidebar";
import TopBar from "../components/navigation/TopBar";

function AppLayout() {
  const location =
    useLocation();

  const isHome =
    location.pathname === "/";

  return (
    <div
      className="
        h-dvh
        w-full
        overflow-hidden
        bg-background
        text-text-primary
      "
    >
      <div className="flex h-full w-full min-w-0">
        {/* =========================================
            DESKTOP SIDEBAR
        ========================================= */}

        <Sidebar />

        {/* =========================================
            MAIN APPLICATION AREA
        ========================================= */}

        <div
          className="
            relative
            flex
            h-full
            min-w-0
            flex-1
            flex-col
            overflow-hidden
          "
        >
          {/* =======================================
              HOME BACKGROUND

              One continuous blur behind both:
              - TopBar
              - HomePage
          ======================================= */}

          {isHome && (
            <AmbientBlurBackground />
          )}

          {/* =======================================
              TOP BAR
          ======================================= */}

          {/* =======================================
    TOP BAR
======================================= */}

          <TopBar transparent />

          {/* =======================================
              PAGE CONTENT
          ======================================= */}

          <main
            className={[
              `
                relative
                z-10
                min-h-0
                min-w-0
                flex-1
                overflow-x-hidden
              `,
          
              isHome
                ? `
                    overflow-y-hidden
                    pb-0
                    lg:overflow-y-auto
                  `
                : `
                    overflow-y-auto
                    pb-20
                    lg:pb-0
                  `,
            ].join(" ")}
          >
            <Outlet />
          </main>
        </div>
      </div>

      {/* =========================================
          MOBILE BOTTOM NAVIGATION
      ========================================= */}

      <MobileBottomNav />
    </div>
  );
}

export default AppLayout;