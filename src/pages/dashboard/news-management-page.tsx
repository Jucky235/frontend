import * as React from "react";
import { useAppSelector } from "@/redux/hook";
import {
  useGetNewsQuery,
  useCreateNewMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  type NewsData,
} from "@/redux/news/newsApiSlice";

import { NewsHeaderBanner } from "@/components/organism/news/NewsHeaderBanner";
import { NewsAnalyticsOverview } from "@/components/organism/news/NewsAnalyticsOverview";
import { NewsFilterBar } from "@/components/organism/news/NewsFilterBar";
import { NewsTable } from "@/components/organism/news/NewsTable";
import {
  NewsFormModal,
  type NewsFormData,
} from "@/components/organism/news/modals/NewsFormModal";

export default function NewsManagementPage() {
  const { page, limit, search, selectedCategory, selectedStatus } =
    useAppSelector((state) => state.news);

  // RTK Query Hooks
  const {
    data: newsResponse,
    isLoading,
    isFetching,
  } = useGetNewsQuery({
    page,
    limit,
    search: search.trim() ? search : undefined,
    category: selectedCategory !== "ALL" ? selectedCategory : undefined,
    status: selectedStatus !== "ALL" ? selectedStatus : undefined,
  });

  const [createNew, { isLoading: isCreating }] = useCreateNewMutation();
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const [deleteNews] = useDeleteNewsMutation();
  const [, setDeletingId] = React.useState<string | null>(null);

  const newsList = newsResponse?.data ?? [];
  const pagination = newsResponse?.pagination;

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingNews, setEditingNews] = React.useState<NewsData | null>(null);

  const handleOpenCreateModal = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: NewsData) => {
    setEditingNews(item);
    setIsModalOpen(true);
  };

  // Clean deletion handler
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteNews(id).unwrap();
      console.log("Deleted article ID:", id);
    } catch (error) {
      console.error("Failed to delete article:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (formData: NewsFormData) => {
    try {
      if (editingNews) {
        // Wired update mutation
        await updateNews({
          id: editingNews.id,
          data: {
            title: formData.title,
            summary: formData.summary || undefined,
            content: formData.content,
            category: formData.category,
            thumbnail: formData.thumbnail || undefined,
            status: formData.status === "ARCHIVED" ? "DRAFT" : formData.status,
          },
        }).unwrap();
      } else {
        await createNew({
          title: formData.title,
          summary: formData.summary || undefined,
          content: formData.content,
          category: formData.category,
          thumbnail: formData.thumbnail || undefined,
          status: formData.status === "ARCHIVED" ? "DRAFT" : formData.status,
        }).unwrap();
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create/edit news article:", error);
    }
  };

  return (
    <div className="w-full space-y-8">
      <NewsHeaderBanner onOpenCreateModal={handleOpenCreateModal} />

      <NewsAnalyticsOverview
        totalCount={pagination?.total ?? newsList.length}
        newsList={newsList}
      />

      <NewsFilterBar isFetching={isFetching} />

      <NewsTable
        newsList={newsList}
        isLoading={isLoading}
        pagination={pagination}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <NewsFormModal
        isOpen={isModalOpen}
        editingNews={editingNews}
        isSubmitting={isCreating || isUpdating}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
