import * as React from "react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import ForumBanner from "@/components/organism/forum/ForumBanner";
import ForumSidebar from "@/components/organism/forum/ForumSidebar";
import ForumFilterBar from "@/components/organism/forum/ForumFilterBar";
import ForumPostCard, {
  type ForumPost as CardForumPost,
} from "@/components/organism/forum/ForumPostCard";
import {
  useGetAllPostsQuery,
  useGetAllCategoriesQuery,
  useVotePostMutation,
  useCreatePostMutation,
  type ForumPost as ApiForumPost,
  type CreatePostPayload,
} from "@/redux/forum/forumApiSlice";
import { Loader2, AlertCircle, MessageSquareX } from "lucide-react";
import CreatePostModal from "@/components/organism/forum/modal/CreatePostModal";

export default function ForumPage() {
  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"latest" | "popular">("latest");
  const [page, setPage] = React.useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Debounce search query to avoid firing API requests on every keystroke
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page on search change
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Map local sorting option to backend API sortBy expectation ("hot" | "top" | "new")
  const apiSortBy = sortBy === "popular" ? "top" : "new";

  // 1. Fetch Categories
  const { data: categories = [] } = useGetAllCategoriesQuery();

  // 2. Fetch Posts with Filters & Pagination
  const {
    data: postsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllPostsQuery({
    page,
    limit: 10,
    categoryId: selectedCategoryId === "all" ? undefined : selectedCategoryId,
    sortBy: apiSortBy,
    search: debouncedSearch.trim() || undefined,
  });

  console.log(postsData);

  // 3. Mutations
  const [votePost] = useVotePostMutation();
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();

  const handleVote = async (postId: string) => {
    try {
      await votePost({ postId, type: "UPVOTE" }).unwrap();
    } catch (err) {
      console.error("Failed to vote post:", err);
    }
  };

  const handleCreatePost = async (payload: CreatePostPayload) => {
    try {
      await createPost(payload).unwrap();
      setIsCreateModalOpen(false);
      refetch(); // Refresh post list to show the new discussion
    } catch (err) {
      console.error("Failed to create post:", err);
      // Re-throw so the modal form can display field or submission errors if needed
      throw err;
    }
  };

  // Convert backend ForumPost model to UI ForumPostCard adapter format
  const mapApiPostToCard = React.useCallback(
    (post: ApiForumPost): CardForumPost => ({
      id: post.id,
      title: post.title,
      excerpt: post.content,
      author: {
        name: post.author?.name || "Anonymous",
        avatar:
          post.author?.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        badge: post.author?.role?.name,
      },
      category: post.category?.name || "General",
      tags: [post.category?.name || "Topic"],
      upvotes: post.upvotesCount ?? 0,
      replies: post.commentsCount ?? 0,
      views: 0,
      timestamp: new Date(post.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }),
    [],
  );

  const posts = postsData?.data || [];
  const pagination = postsData?.pagination;

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <ForumBanner onNewDiscussionClick={() => setIsCreateModalOpen(true)} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <ForumSidebar
            categories={categories}
            selectedCategory={selectedCategoryId}
            onSelectCategory={(id) => {
              setSelectedCategoryId(id);
              setPage(1);
            }}
          />

          <section className="lg:col-span-3 space-y-6">
            <ForumFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={(sort) => {
                setSortBy(sort);
                setPage(1);
              }}
            />

            {/* State: Loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
                <Loader2 className="w-8 h-8 text-[#5A67FF] animate-spin" />
                <p className="text-xs font-semibold text-neutral-500">
                  Loading discussions...
                </p>
              </div>
            )}

            {/* State: Error */}
            {isError && (
              <div className="flex flex-col items-center justify-center py-12 space-y-3 bg-red-50/50 rounded-2xl border border-red-200 text-center p-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <p className="text-sm font-bold text-neutral-800">
                  Failed to load discussions
                </p>
                <p className="text-xs text-neutral-500 max-w-xs">
                  There was a problem fetching the forum posts. Please check
                  your connection and try again.
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Retry
                </button>
              </div>
            )}

            {/* State: Empty */}
            {!isLoading && !isError && posts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 space-y-3 bg-white rounded-2xl border border-neutral-200/80 text-center p-6 shadow-xs">
                <MessageSquareX className="w-8 h-8 text-neutral-400" />
                <p className="text-sm font-bold text-neutral-700">
                  No discussions found
                </p>
                <p className="text-xs text-neutral-400">
                  Try adjusting your search query or switching categories.
                </p>
              </div>
            )}

            {/* State: Success / List */}
            {!isLoading && !isError && posts.length > 0 && (
              <div
                className={`space-y-4 ${
                  isFetching
                    ? "opacity-60 pointer-events-none transition-opacity"
                    : ""
                }`}
              >
                {posts.map((post) => (
                  <ForumPostCard
                    key={post.id}
                    post={mapApiPostToCard(post)}
                    onUpvote={(id) => handleVote(String(id))}
                  />
                ))}

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200 text-xs font-bold">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Previous
                    </button>
                    <span className="text-neutral-500">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage((prev) => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* Create Discussion Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        isSubmitting={isCreating}
        categories={categories}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
