import * as React from "react";
import { useNavigate } from "react-router-dom";
import DeckHeader from "@/components/organism/flashcards/DeckHeader";
import DeckSearchFilterBar, {
  type DeckFilterTab,
} from "@/components/organism/flashcards/DeckSearchFilterBar";
import DeckListFeed from "@/components/organism/flashcards/DeckListFeed";
import CreateDeckModal from "@/components/organism/flashcards/modals/CreateDeckModal";
import {
  useGetDecksQuery,
  useCreateDeckMutation,
  type Deck,
  type ExamCategory,
  type DeckVisibility,
} from "@/redux/flashcard/flashcardApiSlice";
import Header from "@/components/organism/common/Header";

export default function FlashcardsListPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<DeckFilterTab>("all");

  // RTK Query Hooks
  const { data: decks = [], isLoading, isError, refetch } = useGetDecksQuery();
  const [createDeck, { isLoading: isSubmitting }] = useCreateDeckMutation();

  // Filter logic works directly on API response
  const filteredDecks = React.useMemo(() => {
    return decks.filter((deck: Deck) => {
      const title = deck.name || "";
      const desc = deck.description || "";
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());

      const progress = deck.progress ?? 0;
      if (activeTab === "completed") return matchesSearch && progress === 100;
      if (activeTab === "in-progress") return matchesSearch && progress < 100;
      return matchesSearch;
    });
  }, [decks, searchQuery, activeTab]);

  // Real RTK Mutation handler with .unwrap()
  const handleCreateDeckSubmit = async (data: {
    name: string;
    description: string;
    category: ExamCategory;
    visibility: DeckVisibility;
  }) => {
    try {
      const newDeck = await createDeck(data).unwrap();
      setIsModalOpen(false);
      // Optional: navigate immediately to edit page to add flashcards
      if (newDeck?.id) {
        navigate(`/deck/edit/${newDeck.id}`);
      }
    } catch (err) {
      console.error("Failed to create deck:", err);
    }
  };

  const handleEditDeck = (deckId: string) => {
    navigate(`/deck/edit/${deckId}`);
  };

  return (
    <div className="deck-page font-inter">
      {/* Global Header Replacement */}
      <Header
        onProfileClick={() => console.log("Profile clicked")}
        onLogout={() => console.log("Logout clicked")}
        onSettingsClick={() => console.log("Settings clicked")}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col space-y-8">
        <DeckHeader onCreateClick={() => setIsModalOpen(true)} />

        <DeckSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <DeckListFeed
          decks={filteredDecks}
          isLoading={isLoading}
          isError={isError}
          onRefetch={refetch}
          onEditDeck={handleEditDeck}
        />
      </main>

      <footer className="deck-footer">
        &copy; {new Date().getFullYear()} Workspace System. All rights reserved.
      </footer>

      <CreateDeckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateDeck={handleCreateDeckSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
