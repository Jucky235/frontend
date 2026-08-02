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
    <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
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

      <div className="flex items-center space-x-3 w-full sm:w-auto">
        {isFetching && (
          <Loader2 className="w-4 h-4 text-[#5A67FF] animate-spin mr-1" />
        )}

        <select
          value={selectedCategory}
          onChange={(e) =>
            dispatch(setSelectedCategory(e.target.value as NewsCategoryFilter))
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
  );
};
