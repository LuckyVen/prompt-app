import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <p className="text-sm font-medium text-primary">
          404
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
          Page not found
        </h1>

        <p className="mt-2 text-text-secondary">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-prompt-md bg-primary px-5 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;