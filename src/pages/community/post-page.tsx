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
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Back Button & Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/forum")}
            className="flex items-center space-x-2 text-xs font-bold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
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
                    ? "bg-indigo-50 border-indigo-200 text-[#5A67FF]"
                    : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
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
                className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-all cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* State: Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <Loader2 className="w-8 h-8 text-[#5A67FF] animate-spin" />
            <p className="text-xs font-semibold text-neutral-500">
              Loading discussion...
            </p>
          </div>
        )}

        {/* State: Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 rounded-2xl border border-red-200 p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm font-bold text-neutral-800">
              Failed to load discussion
            </p>
            <p className="text-xs text-neutral-500 max-w-xs">
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

        {/* State: Success */}
        {!isLoading && !isError && post && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Stream */}
            <div className="lg:col-span-3 space-y-6">
              {/* Primary Post Card */}
              <article className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                {/* Category & Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-indigo-50 text-[#5A67FF] font-bold text-[11px] uppercase px-2.5 py-1 rounded-lg tracking-wide">
                    {post.category?.name || "General"}
                  </span>
                  <span className="bg-neutral-100 text-neutral-500 font-semibold text-[11px] px-2 py-0.5 rounded-md">
                    #{post.category?.slug || "topic"}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 leading-snug tracking-tight">
                  {post.title}
                </h1>

                {/* Author & Meta */}
                <div className="flex items-center justify-between pt-2 pb-4 border-b border-neutral-100 text-xs text-neutral-500 font-medium">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        post.author?.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                      }
                      alt={post.author?.name || "User"}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-100"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-neutral-800">
                          {post.author?.name || "Anonymous"}
                        </span>
                        {post.author?.role?.name && (
                          <span className="bg-[#5A67FF] text-white font-bold text-[9px] uppercase px-1.5 py-0.2 rounded-md">
                            {post.author.role.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-neutral-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-xs font-semibold text-neutral-400">
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.commentsCount ?? 0}</span>
                    </span>
                  </div>
                </div>

                {/* Post Body Content */}
                <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-4 whitespace-pre-line font-normal">
                  {post.content}
                </div>

                {/* Attachments Section */}
                {post.attachments && post.attachments.length > 0 && (
                  <div className="pt-4 border-t border-neutral-100 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 flex items-center space-x-1">
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
                          className="text-xs font-semibold text-[#5A67FF] bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors truncate max-w-xs"
                        >
                          Attachment #{index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleVote}
                    disabled={isVoting}
                    className={`flex items-center space-x-2 px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95 ${
                      post.userVote === "UPVOTE"
                        ? "bg-[#5A67FF] text-white"
                        : "bg-neutral-100 hover:bg-indigo-50 hover:text-[#5A67FF] text-neutral-700"
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
                    className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </article>

              {/* Leave Comment Box */}
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
                  Join the Discussion
                </h3>
                <form onSubmit={handlePostComment} className="space-y-3">
                  <textarea
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a thoughtful comment..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] focus:ring-2 focus:ring-indigo-100 transition-all resize-none placeholder:text-neutral-400"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isCommenting || !commentText.trim()}
                      className="bg-[#5A67FF] hover:bg-indigo-600 disabled:bg-neutral-300 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
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

              {/* Comments Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-800 tracking-tight">
                  Responses ({post.comments?.length ?? 0})
                </h3>

                {(!post.comments || post.comments.length === 0) && (
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-8 text-center text-xs text-neutral-400 font-medium">
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

            {/* Right Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-neutral-800 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#5A67FF]" />
                  <span>Forum Rules</span>
                </div>
                <ul className="text-xs text-neutral-500 space-y-2.5 font-medium leading-relaxed list-disc list-inside">
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

// Subcomponent: Comment Card (Supports nested replies)
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
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs space-y-3">
      {/* Author Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <img
            src={
              comment.author?.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
            }
            alt={comment.author?.name || "User"}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-neutral-800">
                {comment.author?.name || "Anonymous"}
              </span>
              {comment.author?.role?.name && (
                <span className="bg-neutral-100 text-neutral-500 font-bold text-[9px] px-1.5 py-0.2 rounded-md">
                  {comment.author.role.name}
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-400">
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
          className="text-xs font-semibold text-[#5A67FF] hover:underline cursor-pointer"
        >
          {isReplying ? "Cancel" : "Reply"}
        </button>
      </div>

      {/* Content */}
      <p className="text-xs text-neutral-700 leading-relaxed font-medium pl-10">
        {comment.content}
      </p>

      {/* Reply Input Box */}
      {isReplying && (
        <div className="ml-10 pt-2 space-y-2">
          <textarea
            rows={2}
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            placeholder={`Reply to ${comment.author?.name || "comment"}...`}
            className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:border-[#5A67FF] resize-none"
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isCommenting || !replyText.trim()}
              onClick={() => onSubmitReply(comment.id)}
              className="bg-[#5A67FF] hover:bg-indigo-600 disabled:bg-neutral-300 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
            >
              {isCommenting && <Loader2 className="w-3 h-3 animate-spin" />}
              <span>Send Reply</span>
            </button>
          </div>
        </div>
      )}

      {/* Nested Replies Stream */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-10 pt-3 space-y-3 border-t border-neutral-100">
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="flex items-start space-x-2.5 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-1" />
              <div className="space-y-1 w-full">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-neutral-800">
                    {reply.author?.name || "Anonymous"}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {new Date(reply.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 font-medium">
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
