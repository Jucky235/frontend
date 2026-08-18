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
    <div className="study-page font-inter">
      {/* 1. Header Navigation Bar */}
      <header className="study-header">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="study-header-back-btn cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Decks</span>
          </button>
          <div className="study-header-divider hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="editdeck-header-logo">
              <Folder className="w-4 h-4" />
            </div>
            <span className="editdeck-header-title truncate max-w-[200px] sm:max-w-xs">
              Edit: {deckData.name}
            </span>
          </div>
        </div>

        <button
          onClick={handleSaveDeck}
          disabled={isSaving}
          className="editdeck-save-btn cursor-pointer active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </header>

      {/* Toast Notification Alert Banner */}
      {toastMessage && (
        <div className="editdeck-toast animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-4 h-4 text-status-success" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Content Layout (Dual Column Setup) */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Deck Metadata Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="editdeck-panel">
            <div>
              <h2 className="editdeck-panel-title">Deck Settings</h2>
              <p className="editdeck-panel-subtitle">
                Manage metadata & privacy options.
              </p>
            </div>

            <hr className="modal-divider" />

            <form onSubmit={handleSaveDeck} className="space-y-4">
              {/* Title Field */}
              <div className="modal-field">
                <label className="modal-field-label">Deck Title</label>
                <input
                  type="text"
                  name="name"
                  value={deckData.name}
                  onChange={handleDeckChange}
                  className="modal-input"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="modal-field">
                <label className="modal-field-label">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={deckData.description}
                  onChange={handleDeckChange}
                  className="modal-input resize-none"
                />
              </div>

              {/* Readonly Category Baseline */}
              <div className="modal-field">
                <label className="modal-field-label">Category</label>
                <div className="deck-modal-readonly">{deckData.category}</div>
              </div>

              {/* Visibility Controls */}
              <div className="modal-field">
                <label className="modal-field-label">Visibility</label>
                <div className="deck-visibility-grid">
                  <button
                    type="button"
                    onClick={() =>
                      setDeckData((prev) => ({
                        ...prev,
                        visibility: "PRIVATE",
                      }))
                    }
                    className={`deck-visibility-option cursor-pointer ${
                      deckData.visibility === "PRIVATE" ? "is-selected" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <ShieldCheck
                        className={`deck-visibility-icon w-4 h-4 ${
                          deckData.visibility === "PRIVATE" ? "is-selected" : ""
                        }`}
                      />
                      <span className="deck-visibility-label">Private</span>
                    </div>
                    <p className="deck-visibility-desc">Only visible to you.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeckData((prev) => ({ ...prev, visibility: "PUBLIC" }))
                    }
                    className={`deck-visibility-option cursor-pointer ${
                      deckData.visibility === "PUBLIC" ? "is-selected" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <Globe
                        className={`deck-visibility-icon w-4 h-4 ${
                          deckData.visibility === "PUBLIC" ? "is-selected" : ""
                        }`}
                      />
                      <span className="deck-visibility-label">Public</span>
                    </div>
                    <p className="deck-visibility-desc">
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
              <Layers className="editdeck-cards-icon w-5 h-5" />
              <h2 className="editdeck-cards-title">Cards ({cards.length})</h2>
            </div>

            <button
              type="button"
              onClick={() => setShowAddCard(!showAddCard)}
              className="editdeck-add-card-btn cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Flashcard</span>
            </button>
          </div>

          {/* Add New Card Inline Form Box */}
          {showAddCard && (
            <div className="editdeck-addcard-panel animate-in fade-in duration-200">
              <h3 className="editdeck-addcard-heading">Create New Flashcard</h3>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Front Content (Question/Prompt)"
                  value={newCard.frontContent}
                  onChange={(e) =>
                    setNewCard({ ...newCard, frontContent: e.target.value })
                  }
                  className="editdeck-addcard-input"
                />

                <textarea
                  placeholder="Back Content (Answer/Definition)"
                  rows={2}
                  value={newCard.backContent}
                  onChange={(e) =>
                    setNewCard({ ...newCard, backContent: e.target.value })
                  }
                  className="editdeck-addcard-input resize-none"
                />

                <input
                  type="text"
                  placeholder="Explanation (Optional notes)"
                  value={newCard.explanation}
                  onChange={(e) =>
                    setNewCard({ ...newCard, explanation: e.target.value })
                  }
                  className="editdeck-addcard-input"
                />
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="editdeck-addcard-cancel-btn cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCard}
                  className="editdeck-addcard-save-btn cursor-pointer"
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
                  <div key={card.id} className="editdeck-card-item">
                    {/* Accordion Header Row */}
                    <div
                      onClick={() =>
                        setExpandedCardId(isExpanded ? null : card.id)
                      }
                      className="editdeck-card-header-row"
                    >
                      <div className="flex items-center space-x-3 pr-4 truncate">
                        <span className="editdeck-card-index-badge">
                          {idx + 1}
                        </span>
                        <p className="editdeck-card-front-text truncate">
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
                          className="editdeck-card-delete-btn cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="editdeck-card-chevron w-4 h-4" />
                        ) : (
                          <ChevronDown className="editdeck-card-chevron w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* Accordion Expanded Detail View */}
                    {isExpanded && (
                      <div className="editdeck-card-detail">
                        <div>
                          <p className="editdeck-card-detail-label">Answer</p>
                          <p className="editdeck-card-detail-answer">
                            {card.backContent}
                          </p>
                        </div>

                        {card.explanation && (
                          <div className="editdeck-card-explanation-box">
                            <Info className="editdeck-card-explanation-icon w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>{card.explanation}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="deck-feed-empty-panel border-dashed">
                No flashcards in this deck yet. Click "Add Flashcard" to get
                started.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="deck-footer">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>
    </div>
  );
}
