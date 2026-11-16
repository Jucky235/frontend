import * as React from "react";
import { Search, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  setSearch,
  setSelectedCategory,
  setSelectedStatus,
  type NewsCategoryFilter,
  type NewsStatusFilter,
} from "@/redux/news/newsSlice";

interface NewsFilterBarProps {
  isFetching: boolean;
}

export const NewsFilterBar: React.FC<NewsFilterBarProps> = ({ isFetching }) => {
  const dispatch = useAppDispatch();
  const { search, selectedCategory, selectedStatus } = useAppSelector(
    (state) => state.news,
  );

  return (
    <div className="bg-background-card border border-border/80 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-foreground-subtle absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Tìm tiêu đề hoặc tóm tắt tin tức..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-9 pr-4 py-2 bg-background-hover border border-transparent rounded-xl text-xs font-medium text-foreground focus:outline-none focus:bg-background-card focus:border-brand transition-all"
        />
      </div>

      <div className="flex items-center space-x-3 w-full sm:w-auto">
        {isFetching && (
          <Loader2 className="w-4 h-4 text-brand animate-spin mr-1" />
        )}

        <select
          value={selectedCategory}
          onChange={(e) =>
            dispatch(setSelectedCategory(e.target.value as NewsCategoryFilter))
          }
          className="px-3 py-2 bg-background-hover border border-transparent rounded-xl text-xs font-bold text-foreground-muted focus:outline-none focus:bg-background-card focus:border-brand cursor-pointer"
        >
          <option value="ALL">Tất cả danh mục</option>
          <option value="GENERAL">Chung</option>
          <option value="EXAM_TIPS">Mẹo ôn thi</option>
          <option value="ANNOUNCEMENT">Thông báo</option>
          <option value="SYSTEM_UPDATE">Cập nhật hệ thống</option>
          <option value="FEATURED">Nổi bật</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) =>
            dispatch(setSelectedStatus(e.target.value as NewsStatusFilter))
          }
          className="px-3 py-2 bg-background-hover border border-transparent rounded-xl text-xs font-bold text-foreground-muted focus:outline-none focus:bg-background-card focus:border-brand cursor-pointer"
        >
          <option value="ALL">Mọi trạng thái</option>
          <option value="PUBLISHED">Đã đăng</option>
          <option value="DRAFT">Bản nháp</option>
          <option value="ARCHIVED">Đã lưu trữ</option>
        </select>
      </div>
    </div>
  );
};
