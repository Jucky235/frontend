import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  Clock,
  Play,
  Settings,
  AlertCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  Pencil,
  Trash2,
  FileUp,
} from "lucide-react";
import { useGetDeckStudyStatsQuery } from "@/redux/flashcard/flashcardApiSlice";

export interface DeckItemData {
  id: string | number;
  name?: string;
  title?: string;
  description?: string;
  desc?: string;
  cardCount?: number;
  _count?: { cards?: number; flashcards?: number };
  category?: string;
  tag?: string;
  lastStudied?: string;
  dueCount?: number;
  newCount?: number;
  learningCount?: number;
  reviewCount?: number;
}

interface DeckCardProps {
  deck: DeckItemData;
  onStudyClick?: (deckId: string | number) => void;
  onEditClick?: (deckId: string | number) => void;
  onDeleteClick?: (deckId: string | number) => void;
  onExportClick?: (deckId: string | number) => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({
  deck,
  onStudyClick,
  onEditClick,
  onDeleteClick,
  onExportClick,
}) => {
  const navigate = useNavigate();
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const { data: stats } = useGetDeckStudyStatsQuery(String(deck.id), {
    skip: !deck.id,
  });

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const title = deck.name || deck.title || "Untitled Deck";
  const desc = deck.description || deck.desc || "No description provided.";
  const tag = deck.category || deck.tag || "TOEIC";
  const lastStudied = deck.lastStudied || "Not studied yet";

  const cardCount =
    deck.cardCount ??
    stats?.totalCards ??
    deck._count?.cards ??
    deck._count?.flashcards ??
    0;

  const newCount = deck.newCount ?? stats?.newCardsCount ?? 0;
  const learningCount = deck.learningCount ?? stats?.learningCount ?? 0;
  const reviewCount = deck.reviewCount ?? stats?.reviewCount ?? 0;
  const dueCount =
    deck.dueCount ?? stats?.totalDue ?? newCount + learningCount + reviewCount;

  const handleStudy = () => {
    if (onStudyClick) {
      onStudyClick(deck.id);
    } else {
      navigate(`/flashcards/${deck.id}`);
    }
  };

  const handleMenuAction = (
    action: "edit" | "delete" | "export",
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();
    setMenuOpen(false);

    if (action === "edit") {
      onEditClick?.(deck.id);
      return;
    }

    if (action === "delete") {
      onDeleteClick?.(deck.id);
      return;
    }

    onExportClick?.(deck.id);
  };

  return (
    <div className="deckcard group" ref={menuRef}>
      <div className="flex items-start space-x-4 flex-1">
        <div className="deckcard-icon-wrapper">
          <div className="deckcard-icon-box">
            <Layers className="w-6 h-6" />
          </div>
          {dueCount > 0 && (
            <span className="deckcard-due-badge">
              <AlertCircle className="w-3 h-3" />
              {dueCount}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="deckcard-title">{title}</h3>
            <span className="deckcard-tag">{tag}</span>
          </div>
          <p className="deckcard-desc line-clamp-2">{desc}</p>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-border pt-4 md:pt-0">
        <div className="flex items-center space-x-4">
          <div className="deckcard-stats-pill">
            <div className="deckcard-stat-item" title="New cards to learn">
              <Sparkles className="deckcard-stat-icon variant-new w-3.5 h-3.5" />
              <span className="deckcard-stat-value variant-new">{newCount}</span>
            </div>

            <div
              className="deckcard-stat-item"
              title="Cards currently in learning phase"
            >
              <RotateCcw className="deckcard-stat-icon variant-learning w-3.5 h-3.5" />
              <span className="deckcard-stat-value variant-learning">
                {learningCount}
              </span>
            </div>

            <div className="deckcard-stat-item" title="Cards due for review">
              <BookOpen className="deckcard-stat-icon variant-review w-3.5 h-3.5" />
              <span className="deckcard-stat-value variant-review">
                {reviewCount}
              </span>
            </div>
          </div>

          <div className="deckcard-meta hidden lg:block">
            <p className="deckcard-meta-label">
              <Clock className="w-3 h-3" />
              <span>Studied</span>
            </p>
            <p className="deckcard-meta-value">{lastStudied}</p>
            <p className="deckcard-meta-sub">{cardCount} total cards</p>
          </div>
        </div>

        <div className="relative flex items-center space-x-2 flex-shrink-0">
          <div className="relative">
            <button
              type="button"
              title="Deck options"
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="deckcard-btn-edit cursor-pointer active:scale-95"
            >
              <Settings className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-border bg-background-card shadow-lg z-20 overflow-hidden">
                <button
                  type="button"
                  onClick={(event) => handleMenuAction("edit", event)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-background-hover"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(event) => handleMenuAction("delete", event)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-background-hover"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
                <button
                  type="button"
                  onClick={(event) => handleMenuAction("export", event)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-background-hover"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  Export
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            title={dueCount > 0 ? "Review Due Cards" : "Start Studying"}
            onClick={handleStudy}
            className={`deckcard-btn-study cursor-pointer active:scale-95 ${
              dueCount > 0 ? "is-due" : "is-idle"
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">
              {dueCount > 0 ? `Study (${dueCount})` : "Study"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeckCard;
