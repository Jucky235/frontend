import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen w-full bg-background font-inter overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),transparent_30%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-[30px] border border-border bg-background-card p-8 text-center shadow-2xl shadow-black/5 md:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
            <SearchX className="h-10 w-10" />
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-foreground-subtle">
              404 error
            </p>
            <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
              Page not found
            </h1>
            <p className="mx-auto max-w-md text-sm leading-6 text-foreground-muted md:text-base">
              The page you are looking for does not exist or may have been moved.
              Let’s get you back to a working place.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary-hover shadow-lg shadow-primary/20"
            >
              <Home className="h-4 w-4" />
              Go home
            </Link>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background-hover px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-background-subtle-hover"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
