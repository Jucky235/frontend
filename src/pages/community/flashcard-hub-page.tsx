import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Sparkles,
  Layers,
  Clock,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import { useGetPublicDecksQuery, type Deck } from "@/redux/flashcard/flashcardApiSlice";

interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  category: string;
  cardCount: number;
  masteryPercentage: number;
  lastStudied?: string;
  isFavorite?: boolean;
}

const DEFAULT_CATEGORY = "All";

export default function FlashcardHubPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(DEFAULT_CATEGORY);
  const [favoriteDeckIds, setFavoriteDeckIds] = React.useState<string[]>([]);

  const {
    data: publicDecks = [],
    isLoading,
    isError,
    refetch,
  } = useGetPublicDecksQuery();

  const decks = React.useMemo<FlashcardDeck[]>(() => {
    return publicDecks.map((deck: Deck) => ({
      id: deck.id,
      title: deck.name || "Untitled deck",
      description: deck.description || "No description provided.",
      category: deck.category || "TOEIC",
      cardCount: deck._count?.cards ?? deck.cards?.length ?? 0,
      masteryPercentage: 0,
      lastStudied: "Not studied yet",
      isFavorite: favoriteDeckIds.includes(deck.id),
    }));
  }, [favoriteDeckIds, publicDecks]);

  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(decks.map((deck) => deck.category)),
    );
    return [DEFAULT_CATEGORY, ...uniqueCategories];
  }, [decks]);

  const filteredDecks = React.useMemo(() => {
    return decks.filter((deck) => {
      const matchesSearch =
        deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deck.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === DEFAULT_CATEGORY || deck.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [decks, searchQuery, selectedCategory]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteDeckIds((prev) =>
      prev.includes(id) ? prev.filter((deckId) => deckId !== id) : [...prev, id],
    );
  };

  const renderState = () => {
    if (isLoading) {
      return (
        <div className="p-12 text-center rounded-2xl bg-background-card border border-border">
          <p className="text-sm font-semibold text-foreground">Đang tải bộ thẻ công khai...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="p-12 text-center rounded-2xl bg-background-card border border-border space-y-3">
          <Layers className="w-10 h-10 mx-auto text-foreground-subtle opacity-50" />
          <p className="text-sm font-semibold text-foreground">Không thể tải các bộ thẻ công khai</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-brand text-brand-foreground font-bold text-xs hover:opacity-95 transition-all"
          >
            Thử lại
          </button>
        </div>
      );
    }

    if (filteredDecks.length === 0) {
      return (
        <div className="p-12 text-center rounded-2xl bg-background-card border border-border space-y-3">
          <Layers className="w-10 h-10 mx-auto text-foreground-subtle opacity-50" />
          <p className="text-sm font-semibold text-foreground">
            Không tìm thấy bộ thẻ ghi nhớ
          </p>
          <p className="text-xs text-foreground-subtle">
            Hãy đổi từ khóa hoặc bộ lọc danh mục.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDecks.map((deck) => (
          <div
            key={deck.id}
            onClick={() => navigate(`/flashcards/${deck.id}`)}
            className="group relative bg-background-card border border-border rounded-2xl p-5 hover:border-brand/40 transition-all duration-300 shadow-xs flex flex-col justify-between cursor-pointer space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-1 rounded-md bg-background-hover text-[10px] font-bold text-foreground-subtle uppercase">
                  {deck.category}
                </span>
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(deck.id, e)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    deck.isFavorite
                      ? "text-rose-500 bg-rose-500/10"
                      : "text-foreground-subtle hover:text-foreground hover:bg-background-hover"
                  }`}
                  title="Đánh dấu bộ thẻ"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground group-hover:text-brand transition-colors line-clamp-1">
                  {deck.title}
                </h3>
                <p className="text-xs text-foreground-subtle line-clamp-2 leading-relaxed">
                  {deck.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-1.5 text-foreground-subtle">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{deck.cardCount} thẻ</span>
                </span>
                <span className="font-bold text-brand">
                  {deck.masteryPercentage}% thành thạo
                </span>
              </div>

              <div className="w-full h-1.5 bg-background-hover rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-500"
                  style={{ width: `${deck.masteryPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-foreground-subtle flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Đã học {deck.lastStudied}</span>
                </span>
                <span className="flex items-center space-x-1 text-xs font-bold text-brand group-hover:translate-x-1 transition-transform">
                  <span>Học ngay</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand/10 via-brand/5 to-transparent border border-border p-6 sm:p-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Học tập tương tác</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Trung tâm thẻ ghi nhớ
              </h1>
              <p className="text-sm sm:text-base text-foreground-subtle max-w-xl">
                Boost your long-term memory with spaced repetition decks. Review
                vocabulary, phrases, and exam concepts on the go.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate("/flashcards/create")}
                className="px-5 py-2.5 rounded-xl bg-brand text-brand-foreground font-bold text-xs sm:text-sm hover:opacity-95 transition-all shadow-xs flex items-center space-x-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo bộ thẻ mới</span>
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bộ thẻ ghi nhớ..."
              className="w-full bg-background-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-foreground-subtle outline-none focus:border-brand transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-brand text-brand-foreground shadow-xs"
                    : "bg-background-card border border-border text-foreground-subtle hover:text-foreground hover:bg-background-hover"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-subtle">
              Bộ thẻ hiện có ({filteredDecks.length})
            </h2>
          </div>

          {renderState()}
        </section>
      </main>

      <Footer />
    </div>
  );
}
