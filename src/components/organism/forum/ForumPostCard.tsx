import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ThumbsUp, MessageCircle, Eye, Pin } from "lucide-react";

export interface ForumPost {
  id: string | number;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
  };
  category: string;
  tags: string[];
  upvotes: number;
  replies: number;
  views: number;
  timestamp: string;
  isPinned?: boolean;
  isSolved?: boolean;
}

interface ForumPostCardProps {
  post: ForumPost;
  onUpvote: (id: string | number) => void;
  onPostClick?: (id: string | number) => void;
}

export const ForumPostCard: React.FC<ForumPostCardProps> = ({
  post,
  onUpvote,
  onPostClick,
}) => {
  const navigate = useNavigate();

  // Primary navigation handler
  const handleCardNavigate = () => {
    if (onPostClick) {
      onPostClick(post.id);
    } else {
      navigate(`/forum/${post.id}`);
    }
  };

  return (
    <article
      onClick={handleCardNavigate}
      className={`group bg-background-card border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer ${
        post.isPinned
          ? "border-primary/30 bg-primary/5"
          : "border-border/80 hover:border-border"
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-extrabold text-foreground">
                  {post.author.name}
                </span>
                {post.author.badge && (
                  <span className="bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    {post.author.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-foreground-subtle font-medium">
                {post.timestamp}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {post.isPinned && (
              <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-md flex items-center space-x-1">
                <Pin className="w-3 h-3 fill-current" />
                <span>Pinned</span>
              </span>
            )}
            {post.isSolved && (
              <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                Solved
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h2>
          <p className="text-xs text-foreground-muted font-medium line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-[10px] font-bold text-foreground-subtle bg-background-hover px-2.5 py-1 rounded-md hover:bg-background-subtle-hover transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-semibold text-foreground-subtle">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(post.id);
            }}
            className="flex items-center space-x-1.5 text-foreground-muted hover:text-primary transition-colors cursor-pointer active:scale-95"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="font-bold">{post.upvotes}</span>
          </button>

          <div className="flex items-center space-x-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{post.replies} replies</span>
          </div>

          <div className="flex items-center space-x-1.5 hidden sm:flex">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.views} views</span>
          </div>
        </div>

        <span className="text-[11px] font-bold text-primary">
          {post.category}
        </span>
      </div>
    </article>
  );
};

export default ForumPostCard;
