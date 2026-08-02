// NewsPagination.tsx
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setPage } from "@/redux/news/newsSlice";

interface NewsPaginationProps {
  totalPages: number;
  currentPage: number;
}

export const NewsPagination: React.FC<NewsPaginationProps> = ({
  totalPages,
  currentPage,
}) => {
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.news.page);

  if (totalPages <= 1) return null;

  return (
    <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
      <span className="text-xs font-medium text-neutral-500">
        Page <span className="font-bold">{currentPage}</span> of{" "}
        <span className="font-bold">{totalPages}</span>
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
          disabled={page >= totalPages}
          onClick={() => dispatch(setPage(page + 1))}
          className="p-2 border border-neutral-200 rounded-lg bg-white hover:bg-neutral-50 disabled:opacity-40 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
