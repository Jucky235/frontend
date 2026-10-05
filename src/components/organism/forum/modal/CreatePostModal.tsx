import * as React from "react";
import {
  X,
  Send,
  Loader2,
  Paperclip,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  useGetAllCategoriesQuery,
  useCreatePostMutation,
} from "@/redux/forum/forumApiSlice";

interface CreatePostModalProps {
  isOpen: boolean;
  isSubmitting?: boolean;
  categories?: { id: string; name: string }[];
  onClose: () => void;
  onSubmit?: (payload: {
    title: string;
    slug: string;
    content: string;
    categoryId: string;
    attachments?: string[];
  }) => Promise<void> | void;
  onSuccess?: () => void;
}

// Helper to convert title into a URL-friendly slug
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove Vietnamese diacritics
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  isSubmitting = false,
  categories = [],
  onClose,
  onSubmit,
  onSuccess,
}) => {
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [content, setContent] = React.useState("");
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const [attachmentInput, setAttachmentInput] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const { data: fetchedCategories = [] } = useGetAllCategoriesQuery();
  const categoryOptions = categories.length > 0 ? categories : fetchedCategories;

  // Auto-generate slug when title changes (if user hasn't manually edited slug)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleAddAttachment = () => {
    if (
      attachmentInput.trim() &&
      !attachments.includes(attachmentInput.trim())
    ) {
      setAttachments([...attachments, attachmentInput.trim()]);
      setAttachmentInput("");
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Please enter a title.");
      return;
    }
    if (!categoryId) {
      setErrorMsg("Please select a category.");
      return;
    }
    if (!content.trim()) {
      setErrorMsg("Please write some content for your post.");
      return;
    }

    try {
      await onSubmit?.({
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        content: content.trim(),
        categoryId,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      // Reset Form State
      setTitle("");
      setSlug("");
      setCategoryId("");
      setContent("");
      setAttachments([]);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error("Failed to create post:", err);
      setErrorMsg(
        err?.data?.message || "Failed to create post. Please try again.",
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-background-card rounded-3xl border border-border/80 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-background-hover/70">
          <h2 className="text-base font-extrabold text-foreground">
            Create New Discussion
          </h2>
          <button
            onClick={onClose}
            className="text-foreground-subtle hover:text-foreground p-1.5 rounded-xl hover:bg-background-hover transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          {errorMsg && (
            <div className="flex items-center space-x-2 text-xs font-bold text-red-600 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="What's on your mind?"
                value={title}
                onChange={handleTitleChange}
                className="w-full px-3.5 py-2.5 bg-background-hover border border-border rounded-xl text-xs font-medium text-foreground placeholder:text-foreground-subtle focus:bg-background-card focus:border-primary focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2.5 bg-background-hover border border-border rounded-xl text-xs font-medium text-foreground focus:bg-background-card focus:border-primary focus:outline-none transition-all cursor-pointer"
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground-subtle">
              Post Slug
            </label>
            <input
              type="text"
              placeholder="post-url-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2 bg-background-hover border border-border rounded-xl text-xs font-mono text-foreground-muted focus:bg-background-card focus:border-primary focus:outline-none transition-all"
            />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-foreground uppercase tracking-wider">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              placeholder="Write your discussion details, questions, or notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 bg-background-hover border border-border rounded-xl text-xs font-medium text-foreground placeholder:text-foreground-subtle focus:bg-background-card focus:border-primary focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Attachments Section */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center space-x-1.5">
              <Paperclip className="w-3.5 h-3.5 text-foreground-subtle" />
              <span>Attachments (URL Links)</span>
            </label>

            <div className="flex space-x-2">
              <input
                type="url"
                placeholder="https://example.com/file.pdf"
                value={attachmentInput}
                onChange={(e) => setAttachmentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAttachment();
                  }
                }}
                className="flex-1 px-3.5 py-2 bg-background-hover border border-border rounded-xl text-xs text-foreground placeholder:text-foreground-subtle focus:bg-background-card focus:border-primary focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-3 py-2 bg-background-hover hover:bg-background-subtle-hover text-foreground rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {attachments.length > 0 && (
              <ul className="space-y-1.5 pt-1">
                {attachments.map((url, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between text-xs bg-background-hover px-3 py-1.5 rounded-lg border border-border-subtle"
                  >
                    <span className="truncate max-w-md font-mono text-foreground-muted">
                      {url}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-foreground-subtle hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border-subtle bg-background-hover/70 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground-muted hover:bg-background-hover transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-xs font-bold text-primary-foreground transition-all flex items-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Publish Post</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
