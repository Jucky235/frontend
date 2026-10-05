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
  Check,
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
  const [copied, setCopied] = React.useState(false);

  // Scroll to top on article navigation
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [resolvedArticleId]);

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
    limit: 6,
  });

  const article: NewsData | undefined = articleResponse?.data;

  // Calculate estimated reading time dynamically
  const readingTime = React.useMemo(() => {
    if (!article?.content) return 1;
    const words = article.content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [article?.content]);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          url: window.location.href,
        });
      } catch (err) {
        // Ignore cancellation errors
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background font-inter flex flex-col justify-between text-foreground">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground text-xs font-bold transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to News Center</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-brand/10 border-brand/20 text-brand"
                  : "bg-background-card border-border text-muted-foreground hover:bg-background-hover"
              }`}
              title={isBookmarked ? "Remove bookmark" : "Save article"}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-background-card border border-border text-muted-foreground hover:bg-background-hover transition-all cursor-pointer"
              title="Share article"
            >
              {copied ? (
                <Check className="w-4 h-4 text-status-success" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
            <p className="text-xs font-bold">Loading article content...</p>
          </div>
        )}

        {(isError || (!isLoading && resolvedArticleId && !article)) && (
          <div className="bg-status-danger-bg border border-status-danger/20 rounded-2xl p-8 text-center space-y-3 text-status-danger">
            <h3 className="text-sm font-extrabold">Article Not Found</h3>
            <p className="text-xs font-medium">
              We couldn't load this news article or it may have been removed.
            </p>
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 bg-status-danger text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to News</span>
            </button>
          </div>
        )}

        {!isLoading && article && (
          <article className="space-y-8">
            <div className="space-y-5">
              <div className="flex items-center flex-wrap gap-2">
                <span className="bg-brand/10 text-brand text-[11px] font-extrabold px-3 py-1 rounded-full border border-brand/20">
                  {article.category}
                </span>
                {article.category === "FEATURED" && (
                  <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-amber-200 dark:border-amber-900/50">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-snug">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-border text-xs text-muted-foreground font-semibold">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-foreground font-bold">Admin Desk</span>
                  </div>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Recently"}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{readingTime} min read</span>
                  </span>
                </div>

                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{article.viewsCount} views</span>
                </span>
              </div>
            </div>

            {article.thumbnail && (
              <div className="w-full h-64 sm:h-[420px] rounded-[28px] overflow-hidden bg-background-hover border border-border shadow-sm">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {article.summary && (
              <div className="bg-brand/5 border-l-4 border-brand p-4 sm:p-5 rounded-r-2xl text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed italic">
                “{article.summary}”
              </div>
            )}

            <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
              {article.content?.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="pt-4 border-t border-border flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-background-hover border border-border text-muted-foreground text-[11px] font-bold px-3 py-1.5 rounded-full"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-background-card border border-border rounded-[22px] p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      hasLiked
                        ? "bg-brand text-white"
                        : "bg-background-hover text-muted-foreground hover:bg-brand/10 hover:text-brand"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{likes} Helpful</span>
                  </button>
                </div>

                <p className="text-xs text-muted-foreground font-medium text-center sm:text-right">
                  Found this update useful? Share it with your study group!
                </p>
              </div>
            </div>
          </article>
        )}

        {relatedArticles.length > 0 && (
          <section className="pt-10 space-y-5 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-foreground tracking-tight">
                Related Updates & News
              </h3>
              <button
                onClick={handleBack}
                className="text-brand text-xs font-bold hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedArticles.map((relItem) => (
                <article
                  key={relItem.id}
                  onClick={() => navigate(`/news/${relItem.id}`)}
                  className="bg-background-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="h-32 w-full overflow-hidden bg-background-hover relative">
                      {relItem.thumbnail ? (
                        <img
                          src={relItem.thumbnail}
                          alt={relItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <BookOpen className="w-6 h-6" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 bg-background/80 backdrop-blur-md text-brand text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                        {relItem.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h4 className="text-xs font-extrabold text-foreground line-clamp-2 group-hover:text-brand transition-colors leading-snug">
                        {relItem.title}
                      </h4>
                    </div>
                  </div>

                  <div className="px-4 pb-4 text-[10px] text-muted-foreground font-semibold flex items-center justify-between">
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
