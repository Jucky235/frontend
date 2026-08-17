import * as React from "react";
import { Flame, Plus } from "lucide-react";

interface ForumBannerProps {
  onNewDiscussionClick?: () => void;
}

export const ForumBanner: React.FC<ForumBannerProps> = ({
  onNewDiscussionClick,
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="space-y-2 z-10 max-w-xl">
        <span className="inline-flex items-center space-x-1.5 bg-white/20 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-amber-300 fill-current" />
          <span>Community Forum</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Discuss, Ask & Share Knowledge
        </h1>
        <p className="text-xs sm:text-sm opacity-90 font-medium leading-relaxed">
          Connect with fellow learners, exchange study notes, ask questions, and
          practice with global peers.
        </p>
      </div>

      <button
        onClick={onNewDiscussionClick}
        className="z-10 bg-white text-[#5A67FF] hover:bg-neutral-100 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95 shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span>New Discussion</span>
      </button>

      {/* Background decoration */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500 rounded-full opacity-30 blur-2xl pointer-events-none" />
    </div>
  );
};

export default ForumBanner;
