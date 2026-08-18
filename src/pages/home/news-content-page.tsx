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
    <div className="min-h-screen w-full bg-background font-inter flex flex-col justify-between select-none text-foreground">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary text-xs font-bold transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to News Center</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-accent border-accent text-primary"
                  : "bg-card border-border text-muted-foreground hover:bg-muted"
              }`}
              title={isBookmarked ? "Remove bookmark" : "Save article"}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:bg-muted text-xs font-bold transition-all cursor-pointer"
              title="Share article"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-24 flex flex-col items-center justify-center space-y-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs font-bold">Loading article content...</p>
          </div>
        )}

        {/* Error State */}
        {(isError || (!isLoading && resolvedArticleId && !article)) && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center space-y-3 text-destructive">
            <h3 className="text-sm font-extrabold">Article Not Found</h3>
            <p className="text-xs font-medium">
              We couldn't load this news article or it may have been removed.
            </p>
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 bg-destructive text-destructive-foreground text-xs font-bold px-4 py-2 rounded-xl hover:bg-destructive/90 transition-colors cursor-pointer"
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
                <span className="bg-primary/10 text-primary text-xs font-extrabold px-3 py-1 rounded-full">
                  {article.category}
                </span>
                {article.category === "FEATURED" && (
                  <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-snug">
                {article.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-border text-xs text-muted-foreground font-semibold">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-foreground font-bold">
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
                    <span>{readingTime} min read</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{article.viewsCount} views</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Image Banner */}
            {article.thumbnail && (
              <div className="w-full h-64 sm:h-96 rounded-3xl overflow-hidden bg-muted border border-border shadow-xs">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Summary Highlight Box */}
            {article.summary && (
              <div className="bg-accent/50 border-l-4 border-primary p-4 sm:p-5 rounded-r-2xl text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed italic">
                "{article.summary}"
              </div>
            )}

            {/* Article Body */}
            <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
              {article.content?.split("\n\n").map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags Section */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-4 border-t border-border flex items-center space-x-2">
                <span className="text-xs font-bold text-muted-foreground">
                  Tags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-muted text-muted-foreground text-[11px] font-bold px-2.5 py-1 rounded-lg"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback & Interaction Bar */}
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    hasLiked
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{likes} Helpful</span>
                </button>
              </div>

              <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                Found this update useful? Share it with your study group!
              </p>
            </div>
          </article>
        )}

        {/* Related Articles Grid */}
        {relatedArticles.length > 0 && (
          <section className="pt-10 space-y-5 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-foreground tracking-tight">
                Related Updates & News
              </h3>
              <button
                onClick={handleBack}
                className="text-primary text-xs font-bold hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedArticles.map((relItem) => (
                <article
                  key={relItem.id}
                  onClick={() => navigate(`/news/${relItem.id}`)}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="h-32 w-full overflow-hidden bg-muted relative">
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
                      <span className="absolute top-2 left-2 bg-background/90 backdrop-blur-md text-primary text-[9px] font-extrabold px-2 py-0.5 rounded-md">
                        {relItem.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h4 className="text-xs font-extrabold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
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
