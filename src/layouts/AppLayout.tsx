import { Outlet } from "react-router-dom";

import MobileBottomNav from "../components/navigation/MobileBottomNav";
import Sidebar from "../components/navigation/Sidebar";
import TopBar from "../components/navigation/TopBar";

function AppLayout() {
  return (
    <div className="h-dvh w-full overflow-hidden bg-background text-text-primary">
      <div className="flex h-full w-full min-w-0">
        <Sidebar />

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <TopBar />

          <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-20 lg:pb-0">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default AppLayout;