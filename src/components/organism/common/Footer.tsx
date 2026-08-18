export default function Footer() {
  return (
    <footer className="w-full bg-background-card border-t border-border py-6 text-center text-xs text-foreground-subtle font-medium">
      &copy; {new Date().getFullYear()} Workspace System. All rights reserved.
    </footer>
  );
}
