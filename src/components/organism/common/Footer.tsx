export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 font-medium">
      &copy; {new Date().getFullYear()} Workspace System. All rights reserved.
    </footer>
  );
}
