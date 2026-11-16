import * as React from "react";
import { Loader2 } from "lucide-react";
import DeckCard, { type DeckItemData } from "./DeckCard";

interface DeckListFeedProps {
  decks: DeckItemData[];
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
  onStudyDeck?: (deckId: string | number) => void;
  onEditDeck?: (deckId: string | number) => void;
  onDeleteDeck?: (deckId: string | number) => void;
  onImportDeck?: (deckId: string | number) => void;
  onExportDeck?: (deckId: string | number) => void;
}

export const DeckListFeed: React.FC<DeckListFeedProps> = ({
  decks,
  isLoading,
  isError,
  onRefetch,
  onStudyDeck,
  onEditDeck,
  onDeleteDeck,
  onImportDeck,
  onExportDeck,
}) => {
  if (isLoading) {
    return (
      <div className="deck-feed-panel">
        <Loader2 className="deck-feed-spinner w-5 h-5 animate-spin" />
        <span>Đang tải các bộ thẻ học tập...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="deck-feed-error-panel">
        <p className="deck-feed-error-text">Không thể tải các bộ thẻ.</p>
        <button
          type="button"
          onClick={onRefetch}
          className="deck-feed-error-btn cursor-pointer"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div className="deck-feed-empty-panel">
        Không tìm thấy bộ sưu tập phù hợp.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {decks.map((deck) => (
        <DeckCard
          key={deck.id}
          deck={deck}
          onStudyClick={onStudyDeck}
          onEditClick={onEditDeck}
          onDeleteClick={onDeleteDeck}
          onImportClick={onImportDeck}
          onExportClick={onExportDeck}
        />
      ))}
    </div>
  );
};

export default DeckListFeed;
