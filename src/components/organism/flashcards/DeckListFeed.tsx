import * as React from "react";
import { Loader2 } from "lucide-react";
import DeckCard, { type DeckItemData } from "./DeckCard";

interface DeckListFeedProps {
  decks: DeckItemData[];
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
  onStudyDeck?: (deckId: string | number) => void;
}

export const DeckListFeed: React.FC<DeckListFeedProps> = ({
  decks,
  isLoading,
  isError,
  onRefetch,
  onStudyDeck,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-neutral-200 p-12 rounded-2xl flex items-center justify-center space-x-2 text-neutral-400 text-sm font-semibold">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        <span>Fetching study decks...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center space-y-3">
        <p className="text-xs font-bold text-red-600">
          Failed to load deck collections.
        </p>
        <button
          type="button"
          onClick={onRefetch}
          className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="bg-white border border-dashed border-neutral-200 p-12 rounded-2xl text-center text-sm font-semibold text-neutral-400">
        No matching collections found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} onStudyClick={onStudyDeck} />
      ))}
    </div>
  );
};

export default DeckListFeed;
