import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Loader2,
} from "lucide-react";
import {
  useGetDeckByIdQuery,
  useAddFlashcardMutation,
  type ExamCategory,
  type DeckVisibility,
} from "@/redux/flashcard/flashcardApiSlice";

interface CardItem {
  id: string;
  frontContent: string;
  backContent: string;
  explanation?: string | null;
}

export default function EditDeckPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();

  // RTK Query hooks
  const {
    data: deck,
    isLoading: isLoadingDeck,
    isError,
  } = useGetDeckByIdQuery(deckId || "", {
    skip: !deckId,
  });

  const [addFlashcard, { isLoading: isAddingCard }] = useAddFlashcardMutation();

  // Deck Form Parameters State
  const [deckData, setDeckData] = React.useState({
    name: "",
    description: "",
    category: "TOEIC" as ExamCategory,
    visibility: "PRIVATE" as DeckVisibility,
  });

  // Local Flashcards list synced with API
  const [cards, setCards] = React.useState<CardItem[]>([]);

  // UI state controls
  const [expandedCardId, setExpandedCardId] = React.useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // New Card Form Inline State
  const [newCard, setNewCard] = React.useState({
    frontContent: "",
    backContent: "",
    explanation: "",
  });
  const [showAddCard, setShowAddCard] = React.useState(false);

  // Sync state when API data finishes fetching
  React.useEffect(() => {
    if (deck) {
      setDeckData({
        name: deck.name || "",
        description: deck.description || "",
        category: deck.category || "TOEIC",
        visibility: deck.visibility || "PRIVATE",
      });

      if (deck.cards) {
        const mappedCards: CardItem[] = deck.cards.map((card) => ({
          id: card.id,
          frontContent: card.frontContent,
          backContent: card.backContent,
          explanation: card.explanation,
        }));
        setCards(mappedCards);
        if (mappedCards.length > 0 && !expandedCardId) {
          setExpandedCardId(mappedCards[0].id);
        }
      }
    }
  }, [deck]);

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
      await new Promise((resolve) => setTimeout(resolve, 500));
      showToast("Deck updated successfully!");
    } catch (err) {
      showToast("Failed to update deck.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCard = async () => {
    if (!newCard.frontContent.trim() || !newCard.backContent.trim() || !deckId)
      return;

    try {
      const createdCard = await addFlashcard({
        deckId,
        frontContent: newCard.frontContent,
        backContent: newCard.backContent,
        explanation: newCard.explanation || undefined,
      }).unwrap();

      const newCardItem: CardItem = {
        id: createdCard.id,
        frontContent: createdCard.frontContent,
        backContent: createdCard.backContent,
        explanation: createdCard.explanation,
      };

      setCards((prev) => [...prev, newCardItem]);
      setNewCard({ frontContent: "", backContent: "", explanation: "" });
      setShowAddCard(false);
      setExpandedCardId(createdCard.id);
      showToast("New card added!");
    } catch (err) {
      showToast("Failed to add flashcard.");
    }
  };

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    showToast("Card deleted.");
  };

  if (isLoadingDeck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !deckId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-status-error">Failed to load deck data.</p>
        <button
          onClick={() => navigate(-1)}
          className="editdeck-addcard-cancel-btn cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="study-page font-inter">
      {/* 1. Header Navigation Bar */}
      <header className="study-header">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
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
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
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

      {/* 2. Main Content Layout */}
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

              <div className="modal-field">
                <label className="modal-field-label">Category</label>
                <div className="deck-modal-readonly">{deckData.category}</div>
              </div>

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

              <div className="flex items-center justify-end space-x-2 mt-3">
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
                  disabled={isAddingCard}
                  className="editdeck-addcard-save-btn cursor-pointer flex items-center space-x-1"
                >
                  {isAddingCard && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>{isAddingCard ? "Saving..." : "Save Card"}</span>
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
