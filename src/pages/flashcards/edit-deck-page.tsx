import * as React from "react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Folder,
  ShieldCheck,
  Globe,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
} from "lucide-react";

interface CardItem {
  id: string;
  frontContent: string;
  backContent: string;
  explanation: string;
}

export default function EditDeckPage() {
  // Deck Form Parameters (Maps directly to your Prisma Deck model)
  const [deckData, setDeckData] = React.useState({
    name: "JavaScript Advanced Fundamentals",
    description:
      "Closures, execution contexts, lexical scoping, prototypal inheritance, and coercion engines.",
    category: "TOEIC" as const,
    visibility: "PRIVATE" as "PRIVATE" | "PUBLIC",
  });

  // Flashcards state management
  const [cards, setCards] = React.useState<CardItem[]>([
    {
      id: "card-1",
      frontContent: "What is a closure in JavaScript?",
      backContent:
        "A closure is the combination of a function bundled together with references to its surrounding state (lexical environment).",
      explanation:
        "Closures give inner functions access to an outer function's scope even after the outer function has returned.",
    },
    {
      id: "card-2",
      frontContent: "Explain prototypal inheritance.",
      backContent:
        "Objects inherit properties and methods directly from other objects via the prototype chain.",
      explanation:
        "Almost all objects in JS are instances of Object, located at the top of the prototype chain.",
    },
  ]);

  // UI state controls
  const [expandedCardId, setExpandedCardId] = React.useState<string | null>(
    "card-1",
  );
  const [editingCardId, setEditingCardId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // New Card Form Inline State
  const [newCard, setNewCard] = React.useState({
    frontContent: "",
    backContent: "",
    explanation: "",
  });
  const [showAddCard, setShowAddCard] = React.useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeckChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDeckData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Simulate API network call
      await new Promise((resolve) => setTimeout(resolve, 800));
      showToast("Deck updated successfully!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCard = () => {
    if (!newCard.frontContent.trim() || !newCard.backContent.trim()) return;

    const createdCard: CardItem = {
      id: `card-${Date.now()}`,
      frontContent: newCard.frontContent,
      backContent: newCard.backContent,
      explanation: newCard.explanation,
    };

    setCards((prev) => [...prev, createdCard]);
    setNewCard({ frontContent: "", backContent: "", explanation: "" });
    setShowAddCard(false);
    setExpandedCardId(createdCard.id);
    showToast("New card added!");
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    showToast("Card deleted.");
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      {/* 1. Header Navigation Bar */}
      <header className="w-full bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Decks</span>
          </button>
          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
              <Folder className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-neutral-800 tracking-tight truncate max-w-[200px] sm:max-w-xs">
              Edit: {deckData.name}
            </span>
          </div>
        </div>

        <button
          onClick={handleSaveDeck}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </header>

      {/* Toast Notification Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Content Layout (Dual Column Setup) */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Deck Metadata Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-extrabold text-neutral-800 tracking-tight">
                Deck Settings
              </h2>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                Manage metadata & privacy options.
              </p>
            </div>

            <hr className="border-neutral-100" />

            <form onSubmit={handleSaveDeck} className="space-y-4">
              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Deck Title
                </label>
                <input
                  type="text"
                  name="name"
                  value={deckData.name}
                  onChange={handleDeckChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={deckData.description}
                  onChange={handleDeckChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                />
              </div>

              {/* Readonly Category Baseline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Category
                </label>
                <div className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bold text-neutral-500 select-none">
                  {deckData.category}
                </div>
              </div>

              {/* Visibility Controls */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Visibility
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setDeckData((prev) => ({
                        ...prev,
                        visibility: "PRIVATE",
                      }))
                    }
                    className={`p-3 rounded-xl border flex flex-col items-start text-left cursor-pointer transition-all ${
                      deckData.visibility === "PRIVATE"
                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                        : "border-neutral-200 bg-white hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <ShieldCheck
                        className={`w-4 h-4 ${deckData.visibility === "PRIVATE" ? "text-indigo-600" : "text-neutral-400"}`}
                      />
                      <span className="text-xs font-bold text-neutral-800">
                        Private
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-medium">
                      Only visible to you.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeckData((prev) => ({ ...prev, visibility: "PUBLIC" }))
                    }
                    className={`p-3 rounded-xl border flex flex-col items-start text-left cursor-pointer transition-all ${
                      deckData.visibility === "PUBLIC"
                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                        : "border-neutral-200 bg-white hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <Globe
                        className={`w-4 h-4 ${deckData.visibility === "PUBLIC" ? "text-indigo-600" : "text-neutral-400"}`}
                      />
                      <span className="text-xs font-bold text-neutral-800">
                        Public
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-medium">
                      Shared across workspace.
                    </p>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Flashcards Management Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-extrabold text-neutral-800 tracking-tight">
                Cards ({cards.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowAddCard(!showAddCard)}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Flashcard</span>
            </button>
          </div>

          {/* Add New Card Inline Form Box */}
          {showAddCard && (
            <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Create New Flashcard
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Front Content (Question/Prompt)"
                  value={newCard.frontContent}
                  onChange={(e) =>
                    setNewCard({ ...newCard, frontContent: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-indigo-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />

                <textarea
                  placeholder="Back Content (Answer/Definition)"
                  rows={2}
                  value={newCard.backContent}
                  onChange={(e) =>
                    setNewCard({ ...newCard, backContent: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-indigo-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                />

                <input
                  type="text"
                  placeholder="Explanation (Optional notes)"
                  value={newCard.explanation}
                  onChange={(e) =>
                    setNewCard({ ...newCard, explanation: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-indigo-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-3 py-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCard}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Save Card
                </button>
              </div>
            </div>
          )}

          {/* Cards List Accordion */}
          <div className="space-y-3">
            {cards.length > 0 ? (
              cards.map((card, idx) => {
                const isExpanded = expandedCardId === card.id;

                return (
                  <div
                    key={card.id}
                    className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden transition-all shadow-xs hover:border-neutral-300"
                  >
                    {/* Accordion Header Row */}
                    <div
                      onClick={() =>
                        setExpandedCardId(isExpanded ? null : card.id)
                      }
                      className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-neutral-50/50"
                    >
                      <div className="flex items-center space-x-3 pr-4 truncate">
                        <span className="w-6 h-6 rounded-lg bg-neutral-100 text-neutral-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-bold text-neutral-800 truncate">
                          {card.frontContent}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCard(card.id);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-neutral-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-400" />
                        )}
                      </div>
                    </div>

                    {/* Accordion Expanded Detail View */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-neutral-100 bg-neutral-50/30 space-y-3">
                        <div>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            Answer
                          </p>
                          <p className="text-xs font-medium text-neutral-700 leading-relaxed mt-1">
                            {card.backContent}
                          </p>
                        </div>

                        {card.explanation && (
                          <div className="p-3 rounded-xl bg-neutral-100/70 text-xs text-neutral-600 flex items-start space-x-2">
                            <Info className="w-3.5 h-3.5 text-neutral-400 mt-0.5 flex-shrink-0" />
                            <span>{card.explanation}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white border border-dashed border-neutral-200 p-10 rounded-2xl text-center text-xs font-semibold text-neutral-400">
                No flashcards in this deck yet. Click "Add Flashcard" to get
                started.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 font-medium">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>
    </div>
  );
}
