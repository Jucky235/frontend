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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import { useGetNewsQuery, type NewsData } from "@/redux/news/newsApiSlice";

const CATEGORIES = [
  { label: "Tất cả", value: "ALL" },
  { label: "Cập nhật", value: "SYSTEM_UPDATE" },
  { label: "Kỳ thi", value: "EXAM_TIPS" },
  { label: "Cộng đồng", value: "ANNOUNCEMENT" },
  { label: "Mẹo học", value: "GENERAL" },
  { label: "Nổi bật", value: "FEATURED" },
];

export default function NewsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [dateOrder, setDateOrder] = React.useState<"desc" | "asc">("desc");

  // Fetch published news articles dynamically from backend API
  const {
    data: newsResponse,
    isLoading,
    isError,
  } = useGetNewsQuery({
    page,
    limit: page === 1 ? 10 : 9,
    status: "PUBLISHED",
    search: searchQuery.trim() ? searchQuery : undefined,
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
  });

  const allArticles: NewsData[] = newsResponse?.data ?? [];

  // Filter only published articles for end users
  const publishedArticles = allArticles.filter(
    (item) => item.status === "PUBLISHED",
  );

  // Identify featured article (fallback to first article if no explicitly marked featured post exists)
  const featuredArticle = page === 1
    ? publishedArticles.find((item) => item.category === "FEATURED") || publishedArticles[0]
    : undefined;

  // Filter remaining articles by category and ensure featured article isn't duplicated in grid
  const filteredArticles = publishedArticles
    .filter((article) => article.id !== featuredArticle?.id)
    .sort((a, b) => {
      const difference = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return dateOrder === "asc" ? difference : -difference;
    });
  const totalArticles = newsResponse?.pagination.total ?? 0;
  const totalPages = totalArticles <= 10 ? 1 : 1 + Math.ceil((totalArticles - 10) / 9);

  const changeCategory = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  return (
    <div className="min-h-screen w-full bg-background dark:bg-background font-inter flex flex-col justify-between select-none transition-colors duration-200">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Title Header Block */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-pink-50 dark:bg-pink-950/50 border border-pink-100 dark:border-pink-800/50 text-brand dark:text-pink-400 text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tin tức và bài viết mới nhất</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground dark:text-neutral-100 tracking-tight">
            Trung tâm tin tức và thông báo
          </h1>
          <p className="text-sm text-foreground-subtle dark:text-foreground-subtle max-w-2xl font-medium leading-relaxed">
            Stay tuned with our latest product releases, exam preparation
            guides, community highlights, and study strategies.
          </p>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-foreground-subtle dark:text-foreground-subtle">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
            <p className="text-xs font-bold">Đang tải tin tức và bài viết...</p>
          </div>
        )}

        {/* Error Fallback */}
        {isError && (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 text-center text-rose-700 dark:text-rose-400 text-xs font-bold">
            Không thể tải tin tức. Vui lòng kiểm tra kết nối mạng hoặc máy chủ.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Featured Article Banner */}
            {featuredArticle && (
              <section
                onClick={() => navigate(`/news/${featuredArticle.id}`)}
                className="bg-background-card dark:bg-background-card border border-border/80 dark:border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-56 md:h-full relative overflow-hidden bg-background-hover dark:bg-background-hover">
                    {featuredArticle.thumbnail ? (
                      <img
                        src={featuredArticle.thumbnail}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-foreground-muted">
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-xs font-bold">
                        <span className="bg-background-card/10 text-brand dark:bg-background-card/20 dark:text-pink-400 px-2.5 py-1 rounded-full">
                          {featuredArticle.category}
                        </span>
                        <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full flex items-center space-x-1 border border-transparent dark:border-amber-900/30">
                          <Sparkles className="w-3 h-3" />
                          <span>Bài viết nổi bật</span>
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-extrabold text-foreground dark:text-neutral-100 tracking-tight leading-snug group-hover:text-brand dark:group-hover:text-pink-400 transition-colors">
                        {featuredArticle.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-foreground-muted dark:text-foreground-subtle line-clamp-3 leading-relaxed">
                        {featuredArticle.summary || featuredArticle.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border-subtle dark:border-border flex items-center justify-between text-xs text-foreground-subtle dark:text-foreground-subtle font-semibold">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {featuredArticle.publishedAt
                              ? new Date(
                                  featuredArticle.publishedAt,
                                ).toLocaleDateString()
                              : "Gần đây"}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{featuredArticle.viewsCount} lượt xem</span>
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/news/${featuredArticle.id}`);
                        }}
                        className="text-brand dark:text-pink-400 font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                      >
                        <span>Đọc bài viết</span>
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
                    onClick={() => changeCategory(cat.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat.value
                        ? "bg-brand text-brand-foreground shadow-xs"
                        : "bg-background-card dark:bg-background-card text-foreground-muted dark:text-neutral-300 border border-border/80 dark:border-border hover:bg-background-hover dark:hover:bg-background-hover"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="flex w-full shrink-0 flex-col gap-2 sm:w-64">
                <label className="sr-only" htmlFor="news-date-order">Sắp xếp theo ngày tạo</label>
                <select id="news-date-order" value={dateOrder} onChange={(event) => setDateOrder(event.target.value as "asc" | "desc")} className="w-full rounded-xl border border-border/80 bg-background-card px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-brand">
                  <option value="desc">Mới nhất</option>
                  <option value="asc">Cũ nhất</option>
                </select>
              <div className="relative">
                <Search className="w-4 h-4 text-foreground-subtle dark:text-foreground-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tin tức..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-4 py-2 bg-background-card dark:bg-background-card border border-border/80 dark:border-border rounded-xl text-xs font-medium text-foreground dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-brand dark:focus:border-pink-500 transition-colors"
                />
              </div>
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
                      className="bg-background-card dark:bg-background-card border border-border/80 dark:border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        {/* Card Thumbnail */}
                        <div className="h-44 w-full overflow-hidden bg-background-hover dark:bg-background-hover relative">
                          {article.thumbnail ? (
                            <img
                              src={article.thumbnail}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300 dark:text-foreground-muted">
                              <BookOpen className="w-8 h-8" />
                            </div>
                          )}
                          <span className="absolute top-3 left-3 bg-background-card/90 dark:bg-background-card/90 backdrop-blur-md text-brand dark:text-pink-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-xs border border-transparent dark:border-border">
                            {article.category}
                          </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-2.5">
                          <h3 className="text-base font-extrabold text-foreground dark:text-neutral-100 line-clamp-2 group-hover:text-brand dark:group-hover:text-pink-400 transition-colors leading-snug">
                            {article.title}
                          </h3>
                          <p className="text-xs text-foreground-subtle dark:text-foreground-subtle line-clamp-2 leading-relaxed font-medium">
                            {article.summary || article.content}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-5 pb-5 pt-2 flex items-center justify-between text-[11px] font-semibold text-foreground-subtle dark:text-foreground-subtle border-t border-border/80 dark:border-border mt-2">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {article.publishedAt
                              ? new Date(
                                  article.publishedAt,
                                ).toLocaleDateString()
                              : "Gần đây"}
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{article.viewsCount} lượt xem</span>
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="bg-background-card dark:bg-background-card border border-border/80 dark:border-border rounded-2xl p-12 text-center space-y-3">
                  <BookOpen className="w-8 h-8 text-neutral-300 dark:text-foreground-muted mx-auto" />
                  <h3 className="text-base font-bold text-foreground-muted dark:text-neutral-300">
                    Không tìm thấy bài viết
                  </h3>
                  <p className="text-xs text-foreground-subtle dark:text-foreground-subtle">
                    Hãy đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
                  </p>
                </div>
              )}
              {totalPages > 1 && (
                <nav aria-label="Phân trang tin tức" className="flex flex-wrap items-center justify-center gap-2 pt-4">
                  <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold disabled:opacity-40"><ChevronLeft className="h-4 w-4"/>Trước</button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} type="button" onClick={() => setPage(number)} aria-current={page === number ? "page" : undefined} className={`h-9 min-w-9 rounded-lg border px-3 text-xs font-bold ${page === number ? "border-brand bg-brand text-white" : "border-border bg-background-card text-foreground hover:bg-background-hover"}`}>{number}</button>)}
                  <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold disabled:opacity-40">Tiếp<ChevronRight className="h-4 w-4"/></button>
                </nav>
              )}
            </section>
          </>
        )}

        {/* Newsletter CTA Subscription */}
        <section className="w-full bg-gradient-to-br from-blue-600 to-pink-600 dark:from-pink-900 dark:to-blue-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-transparent dark:border-pink-800/40">
          <div className="space-y-2 z-10 max-w-md">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Luôn cập nhật tin tức sản phẩm
            </h3>
            <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium">
              Nhận thông báo quan trọng, mẹo ôn thi và nội dung học tập hàng tuần qua email.
            </p>
          </div>

          <div className="z-10 w-full md:w-auto flex items-center space-x-2">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="bg-background-card/10 dark:bg-black/20 text-white placeholder-white/60 border border-white/20 text-xs px-4 py-3 rounded-xl focus:outline-none focus:bg-background-card/20 transition-all w-full md:w-64"
            />
            <button className="bg-brand text-brand-foreground hover:bg-brand-hover text-xs font-bold px-5 py-3 rounded-xl transition-all shrink-0 cursor-pointer active:scale-95 shadow-md">
              Đăng ký nhận tin
            </button>
          </div>

          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pink-500 dark:bg-pink-700 rounded-full opacity-30 blur-2xl pointer-events-none" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
