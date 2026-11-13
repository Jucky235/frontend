import * as React from "react";
import { useNavigate } from "react-router-dom";
import DeckHeader from "@/components/organism/flashcards/DeckHeader";
import DeckSearchFilterBar, {
  type DeckFilterTab,
} from "@/components/organism/flashcards/DeckSearchFilterBar";
import DeckListFeed from "@/components/organism/flashcards/DeckListFeed";
import CreateDeckModal from "@/components/organism/flashcards/modals/CreateDeckModal";
import ImportDeckModal from "@/components/organism/flashcards/modals/ImportDeckModal";
import {
  useGetDeckByIdQuery,
  useGetDecksQuery,
  useCreateDeckMutation,
  useImportDeckFromCsvMutation,
  type Deck,
  type ExamCategory,
  type DeckVisibility,
} from "@/redux/flashcard/flashcardApiSlice";
import Header from "@/components/organism/common/Header";

export default function FlashcardsListPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<DeckFilterTab>("all");
  const [exportDeckId, setExportDeckId] = React.useState<string | null>(null);

  const { data: decks = [], isLoading, isError, refetch } = useGetDecksQuery();
  const [createDeck, { isLoading: isSubmitting }] = useCreateDeckMutation();
  const [importDeckFromCsv, { isLoading: isImportingDeck }] =
    useImportDeckFromCsvMutation();
  const { data: deckToExport } = useGetDeckByIdQuery(exportDeckId || "", {
    skip: !exportDeckId,
  });

  React.useEffect(() => {
    if (!exportDeckId || !deckToExport) return;

    const rows = (deckToExport?.cards ?? []).map((card) => ({
      frontContent: card.frontContent ?? "",
      backContent: card.backContent ?? "",
      explanation: card.explanation ?? "",
    }));

    console.log("Export deck content:", deckToExport);
    console.log("Export rows:", rows);

    const csvRows = [
      [
        "Deck Name",
        "Deck Description",
        "Front Content",
        "Back Content",
        "Explanation",
      ],
      ...rows.map((row) => [
        deckToExport?.name ?? "",
        deckToExport?.description ?? "",
        row.frontContent,
        row.backContent,
        row.explanation,
      ]),
    ];

    const csvString = csvRows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName =
      (deckToExport?.name || "deck")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "deck";

    link.href = url;
    link.download = `${safeName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExportDeckId(null);
  }, [deckToExport, exportDeckId]);

  const filteredDecks = React.useMemo(() => {
    return decks.filter((deck: Deck) => {
      const title = deck.name || "";
      const desc = deck.description || "";
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === "completed") return matchesSearch;
      if (activeTab === "in-progress") return matchesSearch;
      return matchesSearch;
    });
  }, [decks, searchQuery, activeTab]);

  const handleCreateDeckSubmit = async (data: {
    name: string;
    description: string;
    category: ExamCategory;
    visibility: DeckVisibility;
  }) => {
    try {
      const newDeck = await createDeck(data).unwrap();
      setIsModalOpen(false);

      if (newDeck?.id) {
        navigate(`/deck/edit/${newDeck.id}`);
      }
    } catch (err) {
      console.error("Failed to create deck:", err);
    }
  };

  const handleDeleteDeck = (deckId: string | number) => {
    console.log("Delete deck:", deckId);
  };

  const handleImportDeck = async (data: {
    name: string;
    description?: string;
    category?: "GENERAL" | "TOEIC";
    visibility?: "PRIVATE" | "PUBLIC";
    csv: string;
  }) => {
    try {
      await importDeckFromCsv({
        name: data.name,
        description: data.description,
        category: data.category ?? "TOEIC",
        visibility: data.visibility ?? "PRIVATE",
        csv: data.csv,
      }).unwrap();

      setIsImportModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Failed to import deck from CSV:", err);
      throw err;
    }
  };

  const handleExportDeck = (deckId: string | number) => {
    setExportDeckId(String(deckId));
  };

  const handleEditDeck = (deckId: string | number) => {
    navigate(`/deck/edit/${String(deckId)}`);
  };

  const handleImportDeckButtonClick = (deckId: string | number) => {
    setIsImportModalOpen(true);
  };

  return (
    <div className="deck-page font-inter">
      <Header
        onProfileClick={() => console.log("Profile clicked")}
        onLogout={() => console.log("Logout clicked")}
        onSettingsClick={() => console.log("Settings clicked")}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col space-y-8">
        <DeckHeader
          onCreateClick={() => setIsModalOpen(true)}
          onImportClick={() => setIsImportModalOpen(true)}
        />

        <DeckSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <DeckListFeed
          decks={filteredDecks as any}
          isLoading={isLoading}
          isError={isError}
          onRefetch={refetch}
          onStudyDeck={undefined}
          onEditDeck={handleEditDeck}
          onDeleteDeck={handleDeleteDeck}
          onImportDeck={undefined}
          onExportDeck={handleExportDeck}
        />
      </main>

      <ImportDeckModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportDeck={handleImportDeck}
        isSubmitting={isImportingDeck}
      />

      <CreateDeckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateDeck={handleCreateDeckSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
