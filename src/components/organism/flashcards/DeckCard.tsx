import * as React from "react";
import { Layers, CheckCircle2, Clock, Play } from "lucide-react";

export interface DeckItemData {
  id: string | number;
  name?: string;
  title?: string;
  description?: string;
  desc?: string;
  cardCount?: number;
  _count?: { flashcards: number };
  progress?: number;
  category?: string;
  tag?: string;
  lastStudied?: string;
}

interface DeckCardProps {
  deck: DeckItemData;
  onStudyClick?: (deckId: string | number) => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({ deck, onStudyClick }) => {
  const title = deck.name || deck.title || "Untitled Deck";
  const desc = deck.description || deck.desc || "No description provided.";
  const cardCount = deck.cardCount ?? deck._count?.flashcards ?? 0;
  const progress = deck.progress ?? 0;
  const tag = deck.category || deck.tag || "TOEIC";
  const lastStudied = deck.lastStudied || "Recently";

  return (
    <div className="bg-white border border-neutral-200/80 hover:border-indigo-200 p-6 rounded-2xl transition-all shadow-xs hover:shadow-md group flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex flex-start space-x-4 flex-1">
        <div className="w-12 h-12 bg-neutral-100 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
          <Layers className="w-6 h-6 text-indigo-600" />
        </div>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-neutral-800 group-hover:text-indigo-600 transition-colors leading-tight">
              {title}
            </h3>
            <span className="bg-neutral-100 text-neutral-500 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md tracking-wide">
              {tag}
            </span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed font-medium max-w-2xl">
            {desc}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-neutral-100 pt-4 md:pt-0">
        <div className="flex items-center space-x-6">
          <div className="text-left md:text-right min-w-[80px]">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Progress
            </p>
            <div className="flex items-center md:justify-end space-x-1.5 mt-0.5">
              {progress === 100 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <span className="text-sm font-extrabold text-neutral-700">
                  {progress}%
                </span>
              )}
              <span className="text-xs text-neutral-400 font-medium">
                ({cardCount} cards)
              </span>
            </div>
          </div>

          <div className="hidden sm:block text-right min-w-[100px]">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-end space-x-1">
              <Clock className="w-3 h-3" />
              <span>Studied</span>
            </p>
            <p className="text-xs font-semibold text-neutral-600 mt-1">
              {lastStudied}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onStudyClick?.(deck.id)}
          className="bg-neutral-50 group-hover:bg-indigo-600 text-neutral-600 group-hover:text-white border border-neutral-200 group-hover:border-indigo-600 p-3 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
        >
          <Play className="w-4 h-4 fill-current group-hover:fill-transparent" />
        </button>
      </div>
    </div>
  );
};

export default DeckCard;
