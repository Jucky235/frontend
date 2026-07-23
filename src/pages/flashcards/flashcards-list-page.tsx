import * as React from "react";
import {
  LogOut,
  User,
  ArrowLeft,
  Plus,
  Search,
  Play,
  Layers,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import CreateDeckModal from "@/components/organism/flashcards/modals/CreateDeckModal";
import {
  useGetDecksQuery,
  useCreateDeckMutation,
} from "@/redux/flashcard/flashcardApiSlice"; // Adjust path to match your store setup

export default function FlashcardsListPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

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
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      {/* Dynamic Top Navigation Hub Bar */}
      <header className="w-full bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              J
            </div>
            <span className="font-bold text-lg text-neutral-800 tracking-tight">
              Collections
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-red-500 transition-colors px-2 py-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col space-y-8">
        {/* Header Action Row */}
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
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Deck</span>
          </button>
        </div>

        {/* Search Bar & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto">
            {(["all", "in-progress", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-neutral-500 hover:bg-neutral-50"
                }`}
              >
                {tab.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Deck List Feed */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white border border-neutral-200 p-12 rounded-2xl flex items-center justify-center space-x-2 text-neutral-400 text-sm font-semibold">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              <span>Fetching study decks...</span>
            </div>
          ) : isError ? (
            <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center space-y-3">
              <p className="text-xs font-bold text-red-600">
                Failed to load deck collections.
              </p>
              <button
                onClick={() => refetch()}
                className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : filteredDecks.length > 0 ? (
            filteredDecks.map((deck: any) => {
              const title = deck.name || deck.title;
              const desc =
                deck.description || deck.desc || "No description provided.";
              const cardCount = deck.cardCount ?? deck._count?.flashcards ?? 0;
              const progress = deck.progress ?? 0;
              const tag = deck.category || deck.tag || "TOEIC";
              const lastStudied = deck.lastStudied || "Recently";

              return (
                <div
                  key={deck.id}
                  className="bg-white border border-neutral-200/80 hover:border-indigo-200 p-6 rounded-2xl transition-all shadow-xs hover:shadow-md group flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex flex-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-neutral-100 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                      <Layers className="w-6 h-6 text-indigo-600" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-neutral-800 group-hover:text-indigo-600 transition-colors leading-tight">
                          {title}
                        </h3>
                        <span className="bg-neutral-100 text-neutral-500 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md tracking-wide">
                          {tag}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed font-medium max-w-2xl">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-neutral-100 pt-4 md:pt-0">
                    <div className="flex items-center space-x-6">
                      <div className="text-left md:text-right min-w-[80px]">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          Progress
                        </p>
                        <div className="flex items-center md:justify-end space-x-1.5 mt-0.5">
                          {progress === 100 ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <span className="text-sm font-extrabold text-neutral-700">
                              {progress}%
                            </span>
                          )}
                          <span className="text-xs text-neutral-400 font-medium">
                            ({cardCount} cards)
                          </span>
                        </div>
                      </div>

                      <div className="hidden sm:block text-right min-w-[100px]">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-end space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Studied</span>
                        </p>
                        <p className="text-xs font-semibold text-neutral-600 mt-1">
                          {lastStudied}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="bg-neutral-50 group-hover:bg-indigo-600 text-neutral-600 group-hover:text-white border border-neutral-200 group-hover:border-indigo-600 p-3 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 flex-shrink-0"
                    >
                      <Play className="w-4 h-4 fill-current group-hover:fill-transparent" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-dashed border-neutral-200 p-12 rounded-2xl text-center text-sm font-semibold text-neutral-400">
              No matching collections found.
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 font-medium">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>

      {/* Modal */}
      <CreateDeckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateDeck={handleCreateDeckSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
