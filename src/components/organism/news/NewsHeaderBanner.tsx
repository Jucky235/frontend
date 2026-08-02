import * as React from "react";
import { Plus, Sparkles } from "lucide-react";

interface NewsHeaderBannerProps {
  onOpenCreateModal: () => void;
}

export const NewsHeaderBanner: React.FC<NewsHeaderBannerProps> = ({
  onOpenCreateModal,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
      <div>
        <div className="inline-flex items-center space-x-1.5 bg-indigo-50 text-[#5A67FF] text-xs font-bold px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Admin Dashboard</span>
        </div>
        <h1 className="text-2xl font-black text-neutral-800 tracking-tight">
          News & Announcements
        </h1>
        <p className="text-xs text-neutral-500 font-medium mt-1">
          Create, edit, and publish platform news and study tips for members.
        </p>
      </div>

      <button
        onClick={onOpenCreateModal}
        className="bg-[#5A67FF] hover:bg-indigo-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95 shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span>Create Article</span>
      </button>
    </div>
  );
};
