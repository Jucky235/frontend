export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background-card py-6 text-center text-xs font-medium text-foreground-subtle shrink-0">
      &copy; {new Date().getFullYear()} Workspace System. All rights reserved.
    </footer>
  );
}
