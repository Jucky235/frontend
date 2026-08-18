import * as React from "react";
import DeckHeader from "@/components/organism/flashcards/DeckHeader";
import DeckSearchFilterBar, {
  type DeckFilterTab,
} from "@/components/organism/flashcards/DeckSearchFilterBar";
import DeckListFeed from "@/components/organism/flashcards/DeckListFeed";
import CreateDeckModal from "@/components/organism/flashcards/modals/CreateDeckModal";
import {
  useGetDecksQuery,
  useCreateDeckMutation,
} from "@/redux/flashcard/flashcardApiSlice";
import Header from "@/components/organism/common/Header";

export default function FlashcardsListPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<DeckFilterTab>("all");
  // RTK Query Hooks
  const { data: decks = [], isLoading, isError, refetch } = useGetDecksQuery();
  const [createDeck, { isLoading: isSubmitting }] = useCreateDeckMutation();
  // Filter logic works directly on API response
  const filteredDecks = React.useMemo(() => {
    return decks.filter((deck: any) => {
      const title = deck.name || deck.title || "";
      const desc = deck.description || deck.desc || "";
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
    category: "TOEIC";
    visibility: "PRIVATE" | "PUBLIC";
  }) => {
    await createDeck(data).unwrap();
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
