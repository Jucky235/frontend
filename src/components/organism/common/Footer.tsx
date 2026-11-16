export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background-card py-6 text-center text-xs font-medium text-foreground-subtle shrink-0">
      © {new Date().getFullYear()} Hệ thống Workspace. Bảo lưu mọi quyền.
    </footer>
  );
}
