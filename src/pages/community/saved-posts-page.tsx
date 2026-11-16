import * as React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import {
  useGetSavedPostsQuery,
  useToggleSavePostMutation,
} from "@/redux/forum/forumApiSlice";
import { AlertCircle, Bookmark, Loader2, MessageCircle, Eye, ThumbsUp } from "lucide-react";

export default function SavedForumPostsPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError, isFetching, refetch } = useGetSavedPostsQuery({
    page,
    limit: 10,
  });
  const [toggleSavePost, { isLoading: isSaving }] = useToggleSavePostMutation();
  const posts = data?.data ?? [];
  const pagination = data?.pagination;

  const handleUnsave = async (postId: string) => {
    try {
      await toggleSavePost(postId).unwrap();
    } catch (error) {
      console.error("Failed to remove saved post:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background font-inter flex flex-col justify-between text-foreground">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Bài viết đã lưu</h1>
          <p className="mt-2 text-sm text-foreground-muted">Những cuộc thảo luận bạn đã đánh dấu để xem lại.</p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-20 text-foreground-subtle">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs font-semibold">Đang tải bài viết đã lưu...</p>
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <AlertCircle className="mx-auto mb-3 h-7 w-7 text-red-500" />
            <p className="text-sm font-bold">Không thể tải bài viết đã lưu</p>
            <button type="button" onClick={() => refetch()} className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white">Thử lại</button>
          </div>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <div className="rounded-2xl border border-border bg-background-card p-10 text-center">
            <Bookmark className="mx-auto mb-3 h-8 w-8 text-foreground-subtle" />
            <p className="text-sm font-bold">Bạn chưa lưu bài viết nào</p>
            <Link to="/forum" className="mt-4 inline-block text-xs font-bold text-primary hover:underline">Khám phá thảo luận</Link>
          </div>
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <div className={`space-y-4 ${isFetching ? "opacity-60" : ""}`}>
            {posts.map((post) => (
              <article key={post.id} className="rounded-2xl border border-border bg-background-card p-5 shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <Link to={`/forum/${post.id}`} className="min-w-0 flex-1 group">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-foreground-subtle">
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">{post.category.name}</span>
                      <span>Đã lưu {new Date(post.savedAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <h2 className="text-base font-extrabold leading-snug group-hover:text-primary">{post.title}</h2>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-foreground-muted">{post.content}</p>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleUnsave(post.id)}
                    disabled={isSaving}
                    className="shrink-0 rounded-xl border border-border px-3 py-2 text-xs font-bold text-foreground-muted transition hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                  >
                    Bỏ lưu
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border-subtle pt-3 text-[11px] font-semibold text-foreground-subtle">
                  <span>{post.author.name}</span>
                  <span className="inline-flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" />{post.upvotesCount}</span>
                  <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{post.commentsCount} phản hồi</span>
                  <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{post.viewsCount} lượt xem</span>
                </div>
              </article>
            ))}

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border pt-4 text-xs font-bold">
                <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-xl border border-border bg-background-card px-4 py-2 disabled:opacity-40">Trước</button>
                <span>Trang {pagination.page} / {pagination.totalPages}</span>
                <button type="button" disabled={page >= pagination.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-xl border border-border bg-background-card px-4 py-2 disabled:opacity-40">Tiếp</button>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
