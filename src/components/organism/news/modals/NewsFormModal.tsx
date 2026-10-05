import * as React from "react";
import { X, Tag, Globe } from "lucide-react";
import type { NewsData } from "@/redux/news/newsApiSlice";

export interface NewsFormData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  category: NewsData["category"];
  status: NewsData["status"];
  tagInput: string;
  tags: string[];
}

interface NewsFormModalProps {
  isOpen: boolean;
  editingNews: NewsData | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (formData: NewsFormData) => Promise<void> | void;
}

export const NewsFormModal: React.FC<NewsFormModalProps> = ({
  isOpen,
  editingNews,
  isSubmitting = false,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState<NewsFormData>({
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

  React.useEffect(() => {
    if (editingNews) {
      setFormData({
        title: editingNews.title,
        slug: editingNews.slug,
        summary: editingNews.summary || "",
        content: editingNews.content,
        thumbnail: editingNews.thumbnail || "",
        category: editingNews.category,
        status: editingNews.status,
        tagInput: "",
        tags:
          editingNews.tags?.map((t: any) => t.tag?.name || t.name || t) || [],
      });
    } else {
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
    }
  }, [editingNews, isOpen]);

  if (!isOpen) return null;

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

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-neutral-200/80 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <h2 className="text-lg font-black text-neutral-800">
            {editingNews ? "Edit Article" : "Create New Article"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
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

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#5A67FF] hover:bg-indigo-600 text-white rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-60"
            >
              {isSubmitting
                ? editingNews
                  ? "Saving..."
                  : "Creating..."
                : editingNews
                  ? "Save Changes"
                  : "Create Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
