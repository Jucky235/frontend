import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import {
  useGetPostByIdQuery,
  useCreateCommentMutation,
  useVotePostMutation,
  useToggleSavePostMutation,
  type Comment as ApiComment,
} from "@/redux/forum/forumApiSlice";
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  Send,
  MoreHorizontal,
  CornerDownRight,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
  Paperclip,
} from "lucide-react";

export default function ForumPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State management for comments & replies
  const [commentText, setCommentText] = React.useState("");
  const [replyingToId, setReplyingToId] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");

  // RTK Query hooks
  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useGetPostByIdQuery(id ?? "", {
    skip: !id,
  });

  const [votePost, { isLoading: isVoting }] = useVotePostMutation();
  const [createComment, { isLoading: isCommenting }] =
    useCreateCommentMutation();
  const [toggleSavePost, { isLoading: isSaving }] = useToggleSavePostMutation();

  // Handlers
  const handleVote = async () => {
    if (!id) return;
    try {
      await votePost({ postId: id, type: "UPVOTE" }).unwrap();
    } catch (err) {
      console.error("Failed to vote:", err);
    }
  };

  const handleToggleSave = async () => {
    if (!id) return;
    try {
      await toggleSavePost(id).unwrap();
    } catch (err) {
      console.error("Failed to save post:", err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentText.trim()) return;

    try {
      await createComment({
        postId: id,
        content: commentText.trim(),
      }).unwrap();
      setCommentText("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handlePostReply = async (parentId: string) => {
    if (!id || !replyText.trim()) return;

    try {
      await createComment({
        postId: id,
        content: replyText.trim(),
        parentId,
      }).unwrap();
      setReplyText("");
      setReplyingToId(null);
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background font-inter flex flex-col justify-between text-foreground transition-colors">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/forum")}
            className="flex items-center space-x-2 text-xs font-bold text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discussions</span>
          </button>

          {post && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleToggleSave}
                disabled={isSaving}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  post.isSaved
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-background-card border-border text-foreground-muted hover:bg-background-hover"
                }`}
                title={post.isSaved ? "Saved" : "Save post"}
              >
                <Bookmark
                  className={`w-4 h-4 ${post.isSaved ? "fill-current" : ""}`}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
                className="p-2 rounded-xl bg-background-card border border-border text-foreground-muted hover:bg-background-hover transition-all cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-background-card rounded-2xl border border-border shadow-xs space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs font-semibold text-foreground-subtle">
              Loading discussion...
            </p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-16 bg-red-500/10 rounded-2xl border border-red-500/20 p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm font-bold text-foreground">
              Failed to load discussion
            </p>
            <p className="text-xs text-foreground-subtle max-w-xs">
              The post may have been removed or you don't have permission to
              view it.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && post && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <article className="bg-background-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-primary/10 text-primary font-bold text-[11px] uppercase px-2.5 py-1 rounded-lg tracking-wide border border-primary/20">
                    {post.category?.name || "General"}
                  </span>
                  <span className="bg-background-hover text-foreground-subtle font-semibold text-[11px] px-2 py-0.5 rounded-md border border-border-subtle">
                    #{post.category?.slug || "topic"}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug tracking-tight">
                  {post.title}
                </h1>

                <div className="flex items-center justify-between pt-2 pb-4 border-b border-border-subtle text-xs text-foreground-subtle font-medium">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        post.author?.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                      }
                      alt={post.author?.name || "User"}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-background-hover"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-foreground">
                          {post.author?.name || "Anonymous"}
                        </span>
                        {post.author?.role?.name && (
                          <span className="bg-primary text-primary-foreground font-bold text-[9px] uppercase px-1.5 py-0.2 rounded-md">
                            {post.author.role.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-foreground-subtle mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-semibold text-foreground-subtle">
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.commentsCount ?? 0}</span>
                    </span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-foreground-muted leading-relaxed space-y-4 whitespace-pre-line font-normal">
                  {post.content}
                </div>

                {post.attachments && post.attachments.length > 0 && (
                  <div className="pt-4 border-t border-border-subtle space-y-2">
                    <span className="text-xs font-bold text-foreground-subtle flex items-center space-x-1">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Attachments ({post.attachments.length})</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {post.attachments.map((fileUrl, index) => (
                        <a
                          key={index}
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors truncate max-w-xs border border-primary/20"
                        >
                          Attachment #{index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleVote}
                    disabled={isVoting}
                    className={`flex items-center space-x-2 px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95 ${
                      post.userVote === "UPVOTE"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background-hover hover:bg-primary/10 hover:text-primary text-foreground"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>
                      {post.userVote === "UPVOTE" ? "Upvoted" : "Upvote"} (
                      {post.upvotesCount ?? 0})
                    </span>
                  </button>

                  <button
                    type="button"
                    className="p-2 text-foreground-subtle hover:text-foreground rounded-lg hover:bg-background-hover cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </article>

              <div className="bg-background-card border border-border/80 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                  Join the Discussion
                </h3>
                <form onSubmit={handlePostComment} className="space-y-3">
                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a thoughtful comment..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background-hover text-xs font-medium text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isCommenting || !commentText.trim()}
                      className="bg-primary hover:bg-primary-hover disabled:bg-border text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
                    >
                      {isCommenting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Post Comment</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground tracking-tight">
                  Responses ({post.comments?.length ?? 0})
                </h3>

                {(!post.comments || post.comments.length === 0) && (
                  <div className="bg-background-card border border-border/80 rounded-2xl p-8 text-center text-xs text-foreground-subtle font-medium">
                    No comments yet. Be the first to start the conversation!
                  </div>
                )}

                {post.comments?.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    replyingToId={replyingToId}
                    replyText={replyText}
                    isCommenting={isCommenting}
                    onToggleReply={(cId) =>
                      setReplyingToId(replyingToId === cId ? null : cId)
                    }
                    onReplyTextChange={setReplyText}
                    onSubmitReply={handlePostReply}
                  />
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-background-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Forum Rules</span>
                </div>
                <ul className="text-xs text-foreground-muted space-y-2.5 font-medium leading-relaxed list-disc list-inside">
                  <li>Be respectful and supportive to other members.</li>
                  <li>Keep responses constructive and on-topic.</li>
                  <li>No spam, self-promotion, or duplicate posts.</li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

interface CommentCardProps {
  comment: ApiComment;
  replyingToId: string | null;
  replyText: string;
  isCommenting: boolean;
  onToggleReply: (commentId: string) => void;
  onReplyTextChange: (text: string) => void;
  onSubmitReply: (parentId: string) => void;
}

function CommentCard({
  comment,
  replyingToId,
  replyText,
  isCommenting,
  onToggleReply,
  onReplyTextChange,
  onSubmitReply,
}: CommentCardProps) {
  const isReplying = replyingToId === comment.id;

  return (
    <div className="bg-background-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <img
            src={
              comment.author?.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            }
            alt={comment.author?.name || "User"}
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-foreground">
                {comment.author?.name || "Anonymous"}
              </span>
              {comment.author?.role?.name && (
                <span className="bg-background-hover text-foreground-subtle font-bold text-[9px] px-1.5 py-0.2 rounded-md border border-border-subtle">
                  {comment.author.role.name}
                </span>
              )}
            </div>
            <span className="text-[10px] text-foreground-subtle">
              {new Date(comment.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleReply(comment.id)}
          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          {isReplying ? "Cancel" : "Reply"}
        </button>
      </div>

      <p className="text-xs text-foreground-muted leading-relaxed font-medium pl-10">
        {comment.content}
      </p>

      {isReplying && (
        <div className="ml-10 pt-2 space-y-2">
          <textarea
            rows={2}
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            placeholder={`Reply to ${comment.author?.name || "comment"}...`}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background-hover text-xs font-medium text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary resize-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isCommenting || !replyText.trim()}
              onClick={() => onSubmitReply(comment.id)}
              className="bg-primary hover:bg-primary-hover disabled:bg-border text-primary-foreground font-bold text-[11px] px-3.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
            >
              {isCommenting && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Send Reply</span>
            </button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-10 pt-3 space-y-3 border-t border-border-subtle">
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="flex items-start space-x-2.5 bg-background-hover p-3 rounded-xl border border-border-subtle"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-foreground-subtle flex-shrink-0 mt-1" />
              <div className="space-y-1 w-full">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-foreground">
                    {reply.author?.name || "Anonymous"}
                  </span>
                  <span className="text-[10px] text-foreground-subtle">
                    {new Date(reply.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p className="text-xs text-foreground-muted font-medium">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
