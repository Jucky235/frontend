import * as React from "react";
import {
  MessageSquare,
  Award,
  BookOpen,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export interface CategoryOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export const CATEGORIES: CategoryOption[] = [
  {
    id: "all",
    name: "All Topics",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  { id: "exams", name: "Exam Strategy", icon: <Award className="w-4 h-4" /> },
  {
    id: "grammar",
    name: "Vocabulary & Grammar",
    icon: <BookOpen className="w-4 h-4" />,
  },
  { id: "qa", name: "Q&A Help", icon: <HelpCircle className="w-4 h-4" /> },
  {
    id: "resources",
    name: "Study Resources",
    icon: <Sparkles className="w-4 h-4" />,
  },
];

interface ForumSidebarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  discussionsCount?: number;
  membersCount?: number;
  categories?: { id: string; name: string; icon?: React.ReactNode }[];
}

export const ForumSidebar: React.FC<ForumSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  discussionsCount = 1280,
  membersCount = 4520,
  categories = CATEGORIES,
}) => {
  return (
    <aside className="space-y-6">
      {/* Category List */}
      <div className="bg-background-card border border-border/80 rounded-2xl p-4 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-foreground-subtle uppercase tracking-wider px-2">
          Categories
        </h2>
        <nav className="space-y-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary-bg text-primary"
                    : "text-foreground-muted hover:bg-background-hover"
                }`}
              >
                <span className={isActive ? "text-primary" : "text-foreground-subtle"}>
                  {cat.icon}
                </span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Community Stats Widget */}
      <div className="bg-background-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
          Community Stats
        </h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-background-hover p-3 rounded-xl border border-border-subtle">
            <div className="text-base font-black text-primary">
              {discussionsCount.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-foreground-subtle">
              Discussions
            </div>
          </div>
          <div className="bg-background-hover p-3 rounded-xl border border-border-subtle">
            <div className="text-base font-black text-brand">
              {membersCount.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-foreground-subtle">
              Members
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ForumSidebar;
