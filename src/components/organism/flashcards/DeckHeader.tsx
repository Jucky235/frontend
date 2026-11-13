import * as React from "react";
import { Plus, Upload } from "lucide-react";

interface DeckHeaderProps {
  onCreateClick: () => void;
  onImportClick?: () => void;
}

export const DeckHeader: React.FC<DeckHeaderProps> = ({
  onCreateClick,
  onImportClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="deck-header-title">Decks</h1>
        <p className="deck-header-subtitle">
          Select an interactive card bundle module to test your abilities.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        {onImportClick && (
          <button
            type="button"
            onClick={onImportClick}
            className="deck-header-create-btn cursor-pointer active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Import Deck</span>
          </button>
        )}

        <button
          type="button"
          onClick={onCreateClick}
          className="deck-header-create-btn cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Deck</span>
        </button>
      </div>
    </div>
  );
};

export default DeckHeader;
