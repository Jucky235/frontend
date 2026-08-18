import * as React from "react";
import { Plus } from "lucide-react";

interface DeckHeaderProps {
  onCreateClick: () => void;
}

export const DeckHeader: React.FC<DeckHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="deck-header-title">Decks</h1>
        <p className="deck-header-subtitle">
          Select an interactive card bundle module to test your abilities.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreateClick}
        className="deck-header-create-btn cursor-pointer active:scale-95 self-start sm:self-auto"
      >
        <Plus className="w-4 h-4" />
        <span>Create Deck</span>
      </button>
    </div>
  );
};

export default DeckHeader;
