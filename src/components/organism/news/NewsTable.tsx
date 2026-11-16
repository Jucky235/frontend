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
          <span>Đã đăng</span>
        </span>
      );
    case "DRAFT":
      return (
        <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md inline-flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Bản nháp</span>
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="bg-background-hover text-foreground-muted text-[10px] font-extrabold px-2.5 py-1 rounded-md inline-flex items-center space-x-1">
          <Archive className="w-3 h-3" />
          <span>Đã lưu trữ</span>
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
      <div className="bg-background-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/80 border-b border-border-subtle text-[11px] font-bold text-foreground-subtle uppercase tracking-wider">
                <th className="py-3.5 px-4">Bài viết</th>
                <th className="py-3.5 px-4">Danh mục</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Lượt xem</th>
                <th className="py-3.5 px-4">Ngày đăng</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs font-medium">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-foreground-subtle"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin text-brand" />
                      <span className="font-bold">
                        Đang tải tin tức...
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
                      className="hover:bg-background/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-background-hover flex items-center justify-center text-foreground-subtle shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <h2 className="font-extrabold text-foreground truncate">
                              {item.title}
                            </h2>
                            <p className="text-[10px] text-foreground-subtle truncate">
                              /{item.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-background-hover text-foreground-muted text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(item.status)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-foreground-muted">
                        {item.viewsCount}
                      </td>
                      <td className="py-3.5 px-4 text-foreground-subtle font-semibold">
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2 text-foreground-subtle">
                          <button
                            onClick={() => onEdit(item)}
                            disabled={isItemDeleting}
                            className="p-1.5 hover:text-brand hover:bg-pink-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Chỉnh sửa bài viết"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedForDelete(item)}
                            disabled={isItemDeleting}
                            className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Xóa bài viết"
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
                    className="py-12 text-center text-foreground-subtle font-bold"
                  >
                    Không tìm thấy bài viết.
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
        title="Xóa bài viết tin tức"
        variant="danger"
              confirmText="Xóa bài viết"
        cancelText="Hủy"
        isLoading={isDeletingCurrentItem}
        description={
          <span>
            Bạn có chắc muốn xóa{" "}
            <strong className="text-foreground">
              "{selectedForDelete?.title}"
            </strong>
            ? Thao tác này không thể hoàn tác.
          </span>
        }
      />
    </>
  );
};
