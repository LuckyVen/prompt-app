import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {children}
    </div>
  );
}

export default PageContainer;