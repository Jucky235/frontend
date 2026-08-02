// NewsTable.tsx
import * as React from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  Archive,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import type { NewsData } from "@/redux/news/newsApiSlice";
import { NewsPagination } from "./NewsPagination";
import ConfirmModal from "@/components/organism/common/ConfirmModal";

interface NewsTableProps {
  newsList: NewsData[];
  isLoading: boolean;
  deletingId?: string | null;
  pagination?: {
    page: number;
    totalPages: number;
  };
  onEdit: (item: NewsData) => void;
  onDelete: (id: string) => void | Promise<void>;
}

const renderStatusBadge = (status: NewsData["status"]) => {
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

export const NewsTable: React.FC<NewsTableProps> = ({
  newsList,
  isLoading,
  deletingId,
  pagination,
  onEdit,
  onDelete,
}) => {
  const [selectedForDelete, setSelectedForDelete] =
    React.useState<NewsData | null>(null);

  // Clear modal state once deletion succeeds or completing state resets
  React.useEffect(() => {
    if (!deletingId && selectedForDelete) {
      setSelectedForDelete(null);
    }
  }, [deletingId]);

  const handleConfirmDelete = async () => {
    if (!selectedForDelete) return;
    try {
      await onDelete(selectedForDelete.id);
    } finally {
      setSelectedForDelete(null);
    }
  };

  const isDeletingCurrentItem =
    Boolean(deletingId) && deletingId === selectedForDelete?.id;

  return (
    <>
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
              ) : newsList.length > 0 ? (
                newsList.map((item) => {
                  const isItemDeleting = deletingId === item.id;

                  return (
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
                        {renderStatusBadge(item.status)}
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
                            onClick={() => onEdit(item)}
                            disabled={isItemDeleting}
                            className="p-1.5 hover:text-[#5A67FF] hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Edit Article"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedForDelete(item)}
                            disabled={isItemDeleting}
                            className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Article"
                          >
                            {isItemDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

        {pagination && (
          <NewsPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(selectedForDelete)}
        onClose={() => setSelectedForDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete News Article"
        variant="danger"
        confirmText="Delete Article"
        cancelText="Cancel"
        isLoading={isDeletingCurrentItem}
        description={
          <span>
            Are you sure you want to delete{" "}
            <strong className="text-neutral-800">
              "{selectedForDelete?.title}"
            </strong>
            ? This action cannot be undone.
          </span>
        }
      />
    </>
  );
};
