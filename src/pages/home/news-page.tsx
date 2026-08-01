import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ArrowRight,
  Sparkles,
  Search,
  BookOpen,
  Loader2,
  Eye,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import { useGetNewsQuery, type NewsData } from "@/redux/news/newsApiSlice";

const CATEGORIES = [
  { label: "All", value: "ALL" },
  { label: "Updates", value: "SYSTEM_UPDATE" },
  { label: "Exams", value: "EXAM_TIPS" },
  { label: "Community", value: "ANNOUNCEMENT" },
  { label: "Tips", value: "GENERAL" },
  { label: "Featured", value: "FEATURED" },
];

export default function NewsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch published news articles dynamically from backend API
  const {
    data: newsResponse,
    isLoading,
    isError,
  } = useGetNewsQuery({
    page: 1,
    limit: 20,
    search: searchQuery.trim() ? searchQuery : undefined,
  });

  const allArticles: NewsData[] = newsResponse?.data ?? [];

  // Filter only published articles for end users
  const publishedArticles = allArticles.filter(
    (item) => item.status === "PUBLISHED",
  );

  // Identify featured article (fallback to first article if no explicitly marked featured post exists)
  const featuredArticle =
    publishedArticles.find((item) => item.category === "FEATURED") ||
    publishedArticles[0];

  // Filter remaining articles by category and ensure featured article isn't duplicated in grid
  const filteredArticles = publishedArticles.filter((article) => {
    const matchesCategory =
      selectedCategory === "ALL" || article.category === selectedCategory;

    return matchesCategory && article.id !== featuredArticle?.id;
  });

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between select-none">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Title Header Block */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-[#5A67FF] text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Latest Updates & Articles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 tracking-tight">
            News & Announcement Center
          </h1>
          <p className="text-sm text-neutral-500 max-w-2xl font-medium leading-relaxed">
            Stay tuned with our latest product releases, exam preparation
            guides, community highlights, and study strategies.
          </p>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#5A67FF]" />
            <p className="text-xs font-bold">Loading news & articles...</p>
          </div>
        )}

        {/* Error Fallback */}
        {isError && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-700 text-xs font-bold">
            Failed to load news articles. Please check your network connection
            or backend server.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Featured Article Banner */}
            {featuredArticle && (
              <section
                onClick={() => navigate(`/news/${featuredArticle.id}`)}
                className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-56 md:h-full relative overflow-hidden bg-neutral-100">
                    {featuredArticle.thumbnail ? (
                      <img
                        src={featuredArticle.thumbnail}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-xs font-bold">
                        <span className="bg-[#5A67FF]/10 text-[#5A67FF] px-2.5 py-1 rounded-full">
                          {featuredArticle.category}
                        </span>
                        <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Featured Post</span>
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-800 tracking-tight leading-snug group-hover:text-[#5A67FF] transition-colors">
                        {featuredArticle.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                        {featuredArticle.summary || featuredArticle.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-semibold">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {featuredArticle.publishedAt
                              ? new Date(
                                  featuredArticle.publishedAt,
                                ).toLocaleDateString()
                              : "Recently"}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{featuredArticle.viewsCount} views</span>
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/news/${featuredArticle.id}`);
                        }}
                        className="text-[#5A67FF] font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Filter Controls & Search Bar */}
            <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              {/* Category Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat.value
                        ? "bg-[#5A67FF] text-white shadow-xs"
                        : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200/80 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] transition-colors"
                />
              </div>
            </section>

            {/* Articles Grid */}
            <section className="space-y-6">
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => navigate(`/news/${article.id}`)}
                      className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        {/* Card Thumbnail */}
                        <div className="h-44 w-full overflow-hidden bg-neutral-100 relative">
                          {article.thumbnail ? (
                            <img
                              src={article.thumbnail}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                              <BookOpen className="w-8 h-8" />
                            </div>
                          )}
                          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#5A67FF] text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-xs">
                            {article.category}
                          </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-2.5">
                          <h3 className="text-base font-extrabold text-neutral-800 line-clamp-2 group-hover:text-[#5A67FF] transition-colors leading-snug">
                            {article.title}
                          </h3>
                          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-medium">
                            {article.summary || article.content}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-5 pb-5 pt-2 flex items-center justify-between text-[11px] font-semibold text-neutral-400 border-t border-neutral-50/80 mt-2">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {article.publishedAt
                              ? new Date(
                                  article.publishedAt,
                                ).toLocaleDateString()
                              : "Recently"}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{article.viewsCount} views</span>
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center space-y-3">
                  <BookOpen className="w-8 h-8 text-neutral-300 mx-auto" />
                  <h3 className="text-base font-bold text-neutral-700">
                    No articles found
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Try adjusting your search query or selecting a different
                    category.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Newsletter CTA Subscription */}
        <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 z-10 max-w-md">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Stay ahead of product updates
            </h3>
            <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium">
              Get key announcements, test preparation tips, and weekly learning
              insights delivered right to your inbox.
            </p>
          </div>

          <div className="z-10 w-full md:w-auto flex items-center space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 text-white placeholder-white/60 border border-white/20 text-xs px-4 py-3 rounded-xl focus:outline-none focus:bg-white/20 transition-all w-full md:w-64"
            />
            <button className="bg-white text-[#5A67FF] hover:bg-neutral-100 text-xs font-bold px-5 py-3 rounded-xl transition-all shrink-0 cursor-pointer active:scale-95 shadow-md">
              Subscribe
            </button>
          </div>

          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500 rounded-full opacity-30 blur-2xl pointer-events-none" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
