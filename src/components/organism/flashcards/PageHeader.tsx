import * as React from "react";
import { ArrowLeft, User, LogOut } from "lucide-react";

interface PageHeaderProps {
  userInitial?: string;
  onBackClick?: () => void;
  onLogoutClick?: () => void;
  onProfileClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  userInitial = "J",
  onBackClick,
  onLogoutClick,
  onProfileClick,
}) => {
  return (
    <header className="w-full bg-background-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onBackClick}
          className="flex items-center space-x-1.5 text-sm font-semibold text-foreground-subtle hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Quay lại</span>
        </button>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            {userInitial}
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">
            Bộ sưu tập
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onProfileClick}
          className="w-9 h-9 bg-background-hover rounded-full flex items-center justify-center text-foreground-muted hover:bg-border transition-colors"
        >
          <User className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onLogoutClick}
          className="flex items-center space-x-1.5 text-sm font-semibold text-foreground-subtle hover:text-red-500 transition-colors px-2 py-1"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
