import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Eye,
  Share2,
  Bookmark,
  Sparkles,
  BookOpen,
  ThumbsUp,
  User,
  Loader2,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import {
  useGetNewsByIdQuery,
  useGetNewsQuery,
  type NewsData,
} from "@/redux/news/newsApiSlice";

interface NewsContentPageProps {
  articleId?: string;
  onBack?: () => void;
}

export default function NewsContentPage({
  articleId: propArticleId,
  onBack: propOnBack,
}: NewsContentPageProps) {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Resolve article ID either from props or URL route parameters
  const resolvedArticleId = propArticleId || params.id;

  // Navigation back fallback
  const handleBack = propOnBack || (() => navigate("/news"));

  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [likes, setLikes] = React.useState(24);
  const [hasLiked, setHasLiked] = React.useState(false);

  // Fetch single article data dynamically
  const {
    data: articleResponse,
    isLoading,
    isError,
  } = useGetNewsByIdQuery(resolvedArticleId ?? "", {
    skip: !resolvedArticleId,
  });

  // Fetch recent news for "Related Articles" section
  const { data: relatedNewsResponse } = useGetNewsQuery({
    page: 1,
    limit: 4,
  });

  const article: NewsData | undefined = articleResponse?.data;

  const relatedArticles = (relatedNewsResponse?.data ?? [])
    .filter(
      (item) => item.id !== resolvedArticleId && item.status === "PUBLISHED",
    )
    .slice(0, 3);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between select-none">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-[#5A67FF] text-xs font-bold transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to News Center</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-indigo-50 border-indigo-200 text-[#5A67FF]"
                  : "bg-white border-neutral-200/80 text-neutral-500 hover:bg-neutral-100"
              }`}
              title="Save article"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article?.title,
                    url: window.location.href,
                  });
                }
              }}
              className="p-2 rounded-xl bg-white border border-neutral-200/80 text-neutral-500 hover:bg-neutral-100 text-xs font-bold transition-all cursor-pointer"
              title="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#5A67FF]" />
            <p className="text-xs font-bold">Loading article content...</p>
          </div>
        )}

        {/* Error State */}
        {(isError || (!isLoading && resolvedArticleId && !article)) && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3 text-rose-700">
            <h3 className="text-sm font-extrabold">Article Not Found</h3>
            <p className="text-xs font-medium">
              We couldn't load this news article or it may have been removed.
            </p>
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to News</span>
            </button>
          </div>
        )}

        {/* Main Article Content */}
        {!isLoading && article && (
          <article className="space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="bg-[#5A67FF]/10 text-[#5A67FF] text-xs font-extrabold px-3 py-1 rounded-full">
                  {article.category}
                </span>
                {article.category === "FEATURED" && (
                  <span className="text-amber-600 bg-amber-50 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-800 tracking-tight leading-snug">
                {article.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-neutral-200/80 text-xs text-neutral-500 font-semibold">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[#5A67FF] font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-neutral-700 font-bold">
                      Admin Desk
                    </span>
                  </div>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "Recently"}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>4 min read</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-neutral-400">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{article.viewsCount} views</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Image Banner */}
            {article.thumbnail && (
              <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Summary Highlight Box */}
            {article.summary && (
              <div className="bg-indigo-50/60 border-l-4 border-[#5A67FF] p-4 sm:p-5 rounded-r-2xl text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed italic">
                "{article.summary}"
              </div>
            )}

            {/* Article Body */}
            <div className="prose prose-neutral max-w-none text-neutral-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
              {article.content?.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags Section */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-4 border-t border-neutral-200/80 flex items-center space-x-2">
                <span className="text-xs font-bold text-neutral-400">
                  Tags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-neutral-100 text-neutral-600 text-[11px] font-bold px-2.5 py-1 rounded-lg"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback & Interaction Bar */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    hasLiked
                      ? "bg-[#5A67FF] text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{likes} Helpful</span>
                </button>
              </div>

              <p className="text-xs text-neutral-400 font-medium hidden sm:block">
                Found this update useful? Share it with your study group!
              </p>
            </div>
          </article>
        )}

        {/* Related Articles Grid */}
        {relatedArticles.length > 0 && (
          <section className="pt-10 space-y-5 border-t border-neutral-200/80">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-neutral-800 tracking-tight">
                Related Updates & News
              </h3>
              <button
                onClick={handleBack}
                className="text-[#5A67FF] text-xs font-bold hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedArticles.map((relItem) => (
                <article
                  key={relItem.id}
                  onClick={() => navigate(`/news/${relItem.id}`)}
                  className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="h-32 w-full overflow-hidden bg-neutral-100 relative">
                      {relItem.thumbnail ? (
                        <img
                          src={relItem.thumbnail}
                          alt={relItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                          <BookOpen className="w-6 h-6" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-[#5A67FF] text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                        {relItem.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h4 className="text-xs font-extrabold text-neutral-800 line-clamp-2 group-hover:text-[#5A67FF] transition-colors leading-snug">
                        {relItem.title}
                      </h4>
                    </div>
                  </div>

                  <div className="px-4 pb-4 text-[10px] text-neutral-400 font-semibold flex items-center justify-between">
                    <span>
                      {relItem.publishedAt
                        ? new Date(relItem.publishedAt).toLocaleDateString()
                        : "Recently"}
                    </span>
                    <span>{relItem.viewsCount} views</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
