import * as React from "react";
import type { NewsData } from "@/redux/news/newsApiSlice";

interface NewsAnalyticsOverviewProps {
  totalCount: number;
  newsList: NewsData[];
}

export const NewsAnalyticsOverview: React.FC<NewsAnalyticsOverviewProps> = ({
  totalCount,
  newsList,
}) => {
  const publishedCount = newsList.filter(
    (n) => n.status === "PUBLISHED",
  ).length;
  const draftCount = newsList.filter((n) => n.status === "DRAFT").length;
  const totalViews = newsList.reduce(
    (acc, curr) => acc + (curr.viewsCount || 0),
    0,
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs space-y-1">
        <div className="text-xs font-bold text-neutral-400">Total News</div>
        <div className="text-2xl font-black text-neutral-800">{totalCount}</div>
      </div>
      <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs space-y-1">
        <div className="text-xs font-bold text-neutral-400">Published</div>
        <div className="text-2xl font-black text-emerald-600">
          {publishedCount}
        </div>
      </div>
      <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs space-y-1">
        <div className="text-xs font-bold text-neutral-400">Drafts</div>
        <div className="text-2xl font-black text-amber-500">{draftCount}</div>
      </div>
      <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs space-y-1">
        <div className="text-xs font-bold text-neutral-400">Total Views</div>
        <div className="text-2xl font-black text-[#5A67FF]">{totalViews}</div>
      </div>
    </div>
  );
};
