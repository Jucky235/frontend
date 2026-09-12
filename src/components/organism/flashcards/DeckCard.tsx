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
  // Explicit FSRS metrics override (optional)
  dueCount?: number;
  newCount?: number;
  learningCount?: number;
  reviewCount?: number;
}

interface DeckCardProps {
  deck: DeckItemData;
  onStudyClick?: (deckId: string | number) => void;
  onEditClick?: (deckId: string | number) => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({
  deck,
  onStudyClick,
  onEditClick,
}) => {
  const navigate = useNavigate();

  // Fetch live deck stats via RTK Query
  const { data: stats } = useGetDeckStudyStatsQuery(String(deck.id), {
    skip: !deck.id,
  });

  const title = deck.name || deck.title || "Untitled Deck";
  const desc = deck.description || deck.desc || "No description provided.";
  const tag = deck.category || deck.tag || "TOEIC";
  const lastStudied = deck.lastStudied || "Not studied yet";

  // Priority: Direct Props -> Fetched RTK Query Stats -> Prisma Counts -> 0
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

  return (
    <div className="deckcard group">
      {/* Left Column: Icon & Basic Info */}
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

      {/* Right Column: FSRS Metrics & Actions */}
      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-border pt-4 md:pt-0">
        {/* FSRS Queue Breakdown */}
        <div className="flex items-center space-x-4">
          <div className="deckcard-stats-pill">
            {/* New Cards */}
            <div className="deckcard-stat-item" title="New cards to learn">
              <Sparkles className="deckcard-stat-icon variant-new w-3.5 h-3.5" />
              <span className="deckcard-stat-value variant-new">
                {newCount}
              </span>
            </div>

            {/* Learning Cards */}
            <div
              className="deckcard-stat-item"
              title="Cards currently in learning phase"
            >
              <RotateCcw className="deckcard-stat-icon variant-learning w-3.5 h-3.5" />
              <span className="deckcard-stat-value variant-learning">
                {learningCount}
              </span>
            </div>

            {/* Review Cards */}
            <div className="deckcard-stat-item" title="Cards due for review">
              <BookOpen className="deckcard-stat-icon variant-review w-3.5 h-3.5" />
              <span className="deckcard-stat-value variant-review">
                {reviewCount}
              </span>
            </div>
          </div>

          {/* Total & Last Studied */}
          <div className="deckcard-meta hidden lg:block">
            <p className="deckcard-meta-label">
              <Clock className="w-3 h-3" />
              <span>Studied</span>
            </p>
            <p className="deckcard-meta-value">{lastStudied}</p>
            <p className="deckcard-meta-sub">{cardCount} total cards</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            type="button"
            title="Edit Deck"
            onClick={() => onEditClick?.(deck.id)}
            className="deckcard-btn-edit cursor-pointer active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>

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
