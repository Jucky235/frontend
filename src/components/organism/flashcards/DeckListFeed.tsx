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
      <div className="deck-feed-panel">
        <Loader2 className="deck-feed-spinner w-5 h-5 animate-spin" />
        <span>Fetching study decks...</span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="deck-feed-error-panel">
        <p className="deck-feed-error-text">Failed to load deck collections.</p>
        <button
          type="button"
          onClick={onRefetch}
          className="deck-feed-error-btn cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }
  if (decks.length === 0) {
    return (
      <div className="deck-feed-empty-panel">
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
