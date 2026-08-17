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
      className={`group bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 cursor-pointer ${
        post.isPinned
          ? "border-indigo-200 bg-indigo-50/20"
          : "border-neutral-200/80 hover:border-neutral-300"
      }`}
    >
      <div className="space-y-3">
        {/* Header Meta (Author, Category, Badges) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover border border-neutral-200"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-extrabold text-neutral-800">
                  {post.author.name}
                </span>
                {post.author.badge && (
                  <span className="bg-[#5A67FF] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                    {post.author.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-neutral-400 font-medium">
                {post.timestamp}
              </span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center space-x-2">
            {post.isPinned && (
              <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md flex items-center space-x-1">
                <Pin className="w-3 h-3 fill-current" />
                <span>Pinned</span>
              </span>
            )}
            {post.isSolved && (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                Solved
              </span>
            )}
          </div>
        </div>

        {/* Title & Excerpt */}
        <div className="space-y-1.5">
          <h2 className="text-base font-extrabold text-neutral-800 group-hover:text-[#5A67FF] transition-colors leading-snug">
            {post.title}
          </h2>
          <p className="text-xs text-neutral-500 font-medium line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Tags (Stops Event Propagation to Prevent Triggering Card Click) */}
        <div className="flex items-center space-x-2 pt-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md hover:bg-neutral-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Metrics */}
      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-400">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevents triggering card navigation
              onUpvote(post.id);
            }}
            className="flex items-center space-x-1.5 text-neutral-500 hover:text-[#5A67FF] transition-colors cursor-pointer active:scale-95"
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

        <span className="text-[11px] font-bold text-[#5A67FF]">
          {post.category}
        </span>
      </div>
    </article>
  );
};

export default ForumPostCard;
