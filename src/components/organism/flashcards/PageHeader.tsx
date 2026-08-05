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
    <header className="w-full bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onBackClick}
          className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            {userInitial}
          </div>
          <span className="font-bold text-lg text-neutral-800 tracking-tight">
            Collections
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onProfileClick}
          className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
        >
          <User className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onLogoutClick}
          className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-red-500 transition-colors px-2 py-1"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
