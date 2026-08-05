import * as React from "react";
import { Plus } from "lucide-react";

interface DeckHeaderProps {
  onCreateClick: () => void;
}

export const DeckHeader: React.FC<DeckHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-800 tracking-tight">
          Decks
        </h1>
        <p className="text-xs text-neutral-400 font-medium mt-0.5">
          Select an interactive card bundle module to test your abilities.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateClick}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 self-start sm:self-auto"
      >
        <Plus className="w-4 h-4" />
        <span>Create Deck</span>
      </button>
    </div>
  );
};

export default DeckHeader;
