import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </main>
  );
}

export default AuthLayout;