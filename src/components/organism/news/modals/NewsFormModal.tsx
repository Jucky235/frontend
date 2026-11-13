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
      <div className="bg-background-card border border-border/80 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="text-lg font-black text-foreground">
            {editingNews ? "Edit Article" : "Create New Article"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-foreground-subtle hover:text-foreground-muted rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-extrabold text-foreground-muted">
              Article Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Official TOEIC Pattern Updates 2026"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2.5 bg-background-hover border border-transparent rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:bg-background-card focus:border-brand transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-foreground-muted flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-foreground-subtle" />
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
              className="w-full px-4 py-2 bg-background-hover border border-transparent rounded-xl text-xs font-medium text-foreground-muted focus:outline-none focus:bg-background-card focus:border-brand transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-extrabold text-foreground-muted">
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
                className="w-full px-4 py-2.5 bg-background-hover border border-transparent rounded-xl font-bold text-foreground focus:outline-none focus:bg-background-card focus:border-brand"
              >
                <option value="GENERAL">General</option>
                <option value="EXAM_TIPS">Exam Tips</option>
                <option value="ANNOUNCEMENT">Announcement</option>
                <option value="SYSTEM_UPDATE">System Update</option>
                <option value="FEATURED">Featured</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-foreground-muted">
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
                className="w-full px-4 py-2.5 bg-background-hover border border-transparent rounded-xl font-bold text-foreground focus:outline-none focus:bg-background-card focus:border-brand"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-foreground-muted">
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
              className="w-full px-4 py-2.5 bg-background-hover border border-transparent rounded-xl text-xs font-medium text-foreground focus:outline-none focus:bg-background-card focus:border-brand"
            />
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-foreground-muted">
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
              className="w-full px-4 py-2.5 bg-background-hover border border-transparent rounded-xl text-xs font-medium text-foreground focus:outline-none focus:bg-background-card focus:border-brand"
            />
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-foreground-muted">
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
              className="w-full px-4 py-2.5 bg-background-hover border border-transparent rounded-xl text-xs font-medium text-foreground focus:outline-none focus:bg-background-card focus:border-brand"
            />
          </div>

          <div className="space-y-2">
            <label className="font-extrabold text-foreground-muted flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-foreground-subtle" />
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
              className="w-full px-4 py-2 bg-background-hover border border-transparent rounded-xl text-xs font-medium text-foreground focus:outline-none focus:bg-background-card focus:border-brand"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-pink-50 text-brand text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center space-x-1"
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

          <div className="pt-4 border-t border-border-subtle flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-background-hover hover:bg-border text-foreground-muted rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-brand-foreground rounded-xl font-bold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-60"
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
