import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useGetNewsByIdQuery,
  useUpdateNewsMutation,
  type CreateNewsPayload,
} from "@/redux/news/newsApiSlice"; // Adjust path as needed

interface UpdateNewsModalProps {
  newsId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

type FormInputs = CreateNewsPayload;

export const UpdateNewsModal: React.FC<UpdateNewsModalProps> = ({
  newsId,
  isOpen,
  onClose,
}) => {
  // Fetch existing article details when modal is open and has an ID
  const { data: newsData, isLoading: isFetching } = useGetNewsByIdQuery(
    newsId!,
    { skip: !newsId || !isOpen },
  );

  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  // Populate form with existing article data once fetched
  useEffect(() => {
    if (newsData?.data) {
      const article = newsData.data;
      reset({
        title: article.title,
        summary: article.summary || "",
        content: article.content,
        category: article.category,
        thumbnail: article.thumbnail || "",
        status: article.status === "ARCHIVED" ? "DRAFT" : article.status,
        tagIds: article.tags?.map((tag) => String(tag.id)) || [],
      });
    }
  }, [newsData, reset]);

  if (!isOpen || !newsId) return null;

  const onSubmit = async (formData: FormInputs) => {
    try {
      await updateNews({
        id: newsId,
        data: formData,
      }).unwrap();

      onClose();
    } catch (error) {
      console.error("Failed to update news article:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit News Article
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            type="button"
          >
            ✕
          </button>
        </div>

        {isFetching ? (
          <div className="flex h-48 items-center justify-center">
            <span className="text-gray-500">Loading article details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="GENERAL">General</option>
                  <option value="EXAM_TIPS">Exam Tips</option>
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="SYSTEM_UPDATE">System Update</option>
                  <option value="FEATURED">Featured</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Thumbnail Image URL
              </label>
              <input
                type="text"
                {...register("thumbnail")}
                placeholder="https://example.com/image.png"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Summary
              </label>
              <textarea
                rows={2}
                {...register("summary")}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                {...register("content", { required: "Content is required" })}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.content && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
