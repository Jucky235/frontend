import * as React from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  Archive,
  X,
  Tag,
  Globe,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  setPage,
  setSearch,
  setSelectedCategory,
  setSelectedStatus,
  type NewsCategoryFilter,
  type NewsStatusFilter,
} from "@/redux//news/newsSlice";
import { useGetNewsQuery, type NewsData } from "@/redux/news/newsApiSlice";

export default function NewsManagementPage() {
  const dispatch = useAppDispatch();

  // 1. Redux UI State from newsSlice
  const { page, limit, search, selectedCategory, selectedStatus } =
    useAppSelector((state) => state.news);

  // 2. Fetch server data using RTK Query
  const {
    data: newsResponse,
    isLoading,
    isFetching,
  } = useGetNewsQuery({
    page,
    limit,
    search: search.trim() ? search : undefined,
  });

  const newsList = newsResponse?.data ?? [];
  const pagination = newsResponse?.pagination;

  // Local Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingNews, setEditingNews] = React.useState<NewsData | null>(null);

  // Form State
  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    thumbnail: "",
    category: "GENERAL" as NewsData["category"],
    status: "DRAFT" as NewsData["status"],
    tagInput: "",
    tags: [] as string[],
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && formData.tagInput.trim()) {
      e.preventDefault();
      const newTag = formData.tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
          tagInput: "",
        }));
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleOpenCreateModal = () => {
    setEditingNews(null);
    setFormData({
      title: "",
      slug: "",
      summary: "",
      content: "",
      thumbnail: "",
      category: "GENERAL",
      status: "DRAFT",
      tagInput: "",
      tags: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: NewsData) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      summary: item.summary || "",
      content: item.content,
      thumbnail: item.thumbnail || "",
      category: item.category,
      status: item.status,
      tagInput: "",
      tags: item.tags?.map((t) => t.tag.name) || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      // TODO: Connect to mutation when deleteNews endpoint is added to RTK Query
      console.log("Delete article ID:", id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to create/update mutations when added to newsApiSlice
    console.log("Submitting news payload:", formData);
    setIsModalOpen(false);
  };

  // Client-side filtering for category & status (when server filter params are omitted)
  const filteredNews = newsList.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "ALL" || item.status === selectedStatus;
    return matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: NewsData["status"]) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md inline-flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Published</span>
          </span>
        );
      case "DRAFT":
        return (
          <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md inline-flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Draft</span>
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="bg-neutral-100 text-neutral-600 text-[10px] font-extrabold px-2.5 py-1 rounded-md inline-flex items-center space-x-1">
            <Archive className="w-3 h-3" />
            <span>Archived</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between select-none">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-indigo-50 text-[#5A67FF] text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </div>
            <h1 className="text-2xl font-black text-neutral-800 tracking-tight">
              News & Announcements
            </h1>
            <p className="text-xs text-neutral-500 font-medium mt-1">
              Create, edit, and publish platform news and study tips for
              members.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="bg-[#5A67FF] hover:bg-indigo-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        </div>

        {/* Quick Analytics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs space-y-1">
            <div className="text-xs font-bold text-neutral-400">Total News</div>
            <div className="text-2xl font-black text-neutral-800">
              {pagination?.total ?? newsList.length}
            </div>
          </div>
          <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs space-y-1">
            <div className="text-xs font-bold text-neutral-400">Published</div>
            <div className="text-2xl font-black text-emerald-600">
              {newsList.filter((n) => n.status === "PUBLISHED").length}
            </div>
          </div>
          <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs space-y-1">
            <div className="text-xs font-bold text-neutral-400">Drafts</div>
            <div className="text-2xl font-black text-amber-500">
              {newsList.filter((n) => n.status === "DRAFT").length}
            </div>
          </div>
          <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs space-y-1">
            <div className="text-xs font-bold text-neutral-400">
              Total Views
            </div>
            <div className="text-2xl font-black text-[#5A67FF]">
              {newsList.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0)}
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news title or summary..."
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 border border-transparent rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:bg-white focus:border-[#5A67FF] transition-all"
            />
          </div>

          {/* Select Category & Status Filters */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {isFetching && (
              <Loader2 className="w-4 h-4 text-[#5A67FF] animate-spin mr-1" />
            )}

            <select
              value={selectedCategory}
              onChange={(e) =>
                dispatch(
                  setSelectedCategory(e.target.value as NewsCategoryFilter),
                )
              }
              className="px-3 py-2 bg-neutral-100 border border-transparent rounded-xl text-xs font-bold text-neutral-700 focus:outline-none focus:bg-white focus:border-[#5A67FF] cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="GENERAL">General</option>
              <option value="EXAM_TIPS">Exam Tips</option>
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="SYSTEM_UPDATE">System Update</option>
              <option value="FEATURED">Featured</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) =>
                dispatch(setSelectedStatus(e.target.value as NewsStatusFilter))
              }
              className="px-3 py-2 bg-neutral-100 border border-transparent rounded-xl text-xs font-bold text-neutral-700 focus:outline-none focus:bg-white focus:border-[#5A67FF] cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* News Table Data List */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4">Published Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs font-medium">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-neutral-400"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin text-[#5A67FF]" />
                        <span className="font-bold">
                          Loading news articles...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredNews.length > 0 ? (
                  filteredNews.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <h2 className="font-extrabold text-neutral-800 truncate">
                              {item.title}
                            </h2>
                            <p className="text-[10px] text-neutral-400 truncate">
                              /{item.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-neutral-100 text-neutral-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-neutral-600">
                        {item.viewsCount}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400 font-semibold">
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2 text-neutral-400">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 hover:text-[#5A67FF] hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-neutral-400 font-bold"
                    >
                      No articles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">
                Page <span className="font-bold">{pagination.page}</span> of{" "}
                <span className="font-bold">{pagination.totalPages}</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => dispatch(setPage(page - 1))}
                  className="p-2 border border-neutral-200 rounded-lg bg-white hover:bg-neutral-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => dispatch(setPage(page + 1))}
                  className="p-2 border border-neutral-200 rounded-lg bg-white hover:bg-neutral-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200/80 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-lg font-black text-neutral-800">
                {editingNews ? "Edit Article" : "Create New Article"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Title Input */}
              <div className="space-y-1">
                <label className="font-extrabold text-neutral-700">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Official TOEIC Pattern Updates 2026"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2.5 bg-neutral-100 border border-transparent rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:bg-white focus:border-[#5A67FF] transition-all"
                />
              </div>

              {/* Slug Preview */}
              <div className="space-y-1">
                <label className="font-extrabold text-neutral-700 flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-neutral-400" />
                  <span>URL Slug</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="article-url-slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-neutral-100 border border-transparent rounded-xl text-xs font-medium text-neutral-600 focus:outline-none focus:bg-white focus:border-[#5A67FF] transition-all"
                />
              </div>

              {/* Category & Status dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-extrabold text-neutral-700">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as NewsData["category"],
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-neutral-100 border border-transparent rounded-xl font-bold text-neutral-800 focus:outline-none focus:bg-white focus:border-[#5A67FF]"
                  >
                    <option value="GENERAL">General</option>
                    <option value="EXAM_TIPS">Exam Tips</option>
                    <option value="ANNOUNCEMENT">Announcement</option>
                    <option value="SYSTEM_UPDATE">System Update</option>
                    <option value="FEATURED">Featured</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-neutral-700">
                    Publish Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as NewsData["status"],
                      }))
                    }
                    className="w-full px-4 py-2.5 bg-neutral-100 border border-transparent rounded-xl font-bold text-neutral-800 focus:outline-none focus:bg-white focus:border-[#5A67FF]"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-1">
                <label className="font-extrabold text-neutral-700">
                  Cover Thumbnail URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 bg-neutral-100 border border-transparent rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:bg-white focus:border-[#5A67FF]"
                />
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <label className="font-extrabold text-neutral-700">
                  Summary / Preview Snippet
                </label>
                <textarea
                  rows={2}
                  placeholder="Short excerpt shown in post feed previews..."
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      summary: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 bg-neutral-100 border border-transparent rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:bg-white focus:border-[#5A67FF]"
                />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label className="font-extrabold text-neutral-700">
                  Full Content
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write complete article details here..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 bg-neutral-100 border border-transparent rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:bg-white focus:border-[#5A67FF]"
                />
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <label className="font-extrabold text-neutral-700 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Tags (Press Enter to Add)</span>
                </label>
                <input
                  type="text"
                  placeholder="Type a tag and press Enter..."
                  value={formData.tagInput}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tagInput: e.target.value,
                    }))
                  }
                  onKeyDown={handleAddTag}
                  className="w-full px-4 py-2 bg-neutral-100 border border-transparent rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:bg-white focus:border-[#5A67FF]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-indigo-50 text-[#5A67FF] text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center space-x-1"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#5A67FF] hover:bg-indigo-600 text-white rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  {editingNews ? "Save Changes" : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
