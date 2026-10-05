import * as React from "react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import {
  useGetUserRankingQuery,
} from "@/redux/analytics/analyticsApiSlice";
import {
  Trophy,
  Crown,
  Medal,
  Flame,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Sparkles,
  Loader2,
  Inbox,
} from "lucide-react";

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  role?: string;
  points: number;
  examsCompleted: number;
  streakDays: number;
  trend: "up" | "down" | "same";
  trendAmount?: number;
}

export default function RankingPage() {
  const [timeRange, setTimeRange] = React.useState<"week" | "month" | "all">(
    "week",
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const {
    data: rawRankingResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserRankingQuery(timeRange as any);

  // Log nguyên bản response từ API mỗi khi data hoặc trạng thái thay đổi
  React.useEffect(() => {
    console.log(`[RankingPage] Fetch status:`, {
      isLoading,
      isError,
      timeRange,
    });

    if (rawRankingResponse) {
      console.log(`[RankingPage] API Raw Response:`, rawRankingResponse);
    }

    if (isError) {
      console.error(`[RankingPage] API Error:`, error);
    }
  }, [rawRankingResponse, isLoading, isError, error, timeRange]);

  const leaderboardData: LeaderboardUser[] = React.useMemo(() => {
    if (!rawRankingResponse) return [];

    const list = Array.isArray(rawRankingResponse)
      ? rawRankingResponse
      : (rawRankingResponse as any)?.data ||
        (rawRankingResponse as any)?.rankings ||
        (rawRankingResponse as any)?.items ||
        [];

    console.log(`[RankingPage] Parsed Array List:`, list);

    if (!Array.isArray(list)) {
      console.warn(
        `[RankingPage] Data bóc tách không phải là Array. Kiểm tra lại cấu trúc API response!`,
      );
      return [];
    }

    const mapped: LeaderboardUser[] = list.map((item: any, index: number) => {
      const isArrayItem = Array.isArray(item);

      const rawTrend = isArrayItem
        ? "same"
        : item.trend === "up"
          ? "up"
          : item.trend === "down"
            ? "down"
            : "same";

      return {
        rank: isArrayItem ? Number(item[0] ?? index + 1) : Number(item.rank ?? index + 1),
        id: String(isArrayItem ? item[1] : item.id || item.user_id || index),
        name: String(
          isArrayItem
            ? item[2]
            : item.name || item.full_name || item.username || `Học viên #${index + 1}`,
        ),
        avatar: String(
          isArrayItem
            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(String(item[2] ?? index))}&background=5A67FF&color=fff`
            : item.avatar || item.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(String(item.name || item.full_name || item.username || `Học viên #${index + 1}`))}&background=5A67FF&color=fff`,
        ),
        role: isArrayItem ? "Learner" : item.role || item.title || "Learner",
        points: Number(isArrayItem ? item[3] || 0 : item.points || item.total_points || 0),
        examsCompleted: Number(isArrayItem ? item[4] || 0 : item.exams_completed || item.examsCompleted || 0),
        streakDays: Number(isArrayItem ? item[5] || 0 : item.streak_days || item.streakDays || 0),
        trend: rawTrend as LeaderboardUser["trend"],
        trendAmount: Number(isArrayItem ? 0 : item.trend_amount || item.trendAmount || 0),
      };
    });
    console.log(`[RankingPage] Final Mapped Leaderboard Data:`, mapped);
    return mapped;
  }, [rawRankingResponse]);

  const currentUser: LeaderboardUser = React.useMemo(() => {
    const found = leaderboardData.find(
      (u) => u.name.includes("(You)") || u.id === "curr-user",
    );
    if (found) return found;

    return {
      rank: leaderboardData.length > 0 ? leaderboardData.length : "--",
      id: "curr-user",
      name: "Bạn (jucky)",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      role: "Pro Learner",
      points: 1450,
      examsCompleted: 18,
      streakDays: 6,
      trend: "up",
      trendAmount: 4,
    } as LeaderboardUser;
  }, [leaderboardData]);

  const filteredUsers = React.useMemo(() => {
    return leaderboardData.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
    );
  }, [leaderboardData, searchQuery]);

  const top3 = filteredUsers.slice(0, 3);
  const restUsers = filteredUsers.slice(3);

  return (
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 font-inter flex flex-col justify-between transition-colors duration-200">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700 dark:from-indigo-900 dark:via-indigo-800 dark:to-indigo-950 p-8 sm:p-10 text-white shadow-lg">
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="inline-flex items-center space-x-2 bg-white/10 dark:bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-100 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Community Leaderboard</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Bảng Xếp Hạng Học Viên
            </h1>
            <p className="text-sm text-indigo-100 dark:text-indigo-200 leading-relaxed font-medium">
              Vinh danh những học viên có thành tích xuất sắc, duy trì chuỗi học
              tập chăm chỉ và đạt điểm số cao nhất hệ thống.
            </p>
          </div>

          <Trophy className="absolute -right-6 -bottom-6 w-64 h-64 text-white/10 pointer-events-none transform -rotate-12" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm text-neutral-500 font-medium">
              Đang tải bảng xếp hạng...
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-6 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl text-center space-y-3">
            <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold">
              Không thể tải dữ liệu bảng xếp hạng từ hệ thống.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Content Section */}
        {!isLoading && !isError && (
          <>
            {/* Top 3 Podium Cards */}
            {top3.length >= 3 && !searchQuery && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-end">
                {/* Rank 2 - Silver */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center relative order-2 md:order-1 transition-colors">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs px-3 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                    <Medal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>TOP 2</span>
                  </div>
                  <img
                    src={top3[1].avatar}
                    alt={top3[1].name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-200 dark:ring-slate-700 mt-2 bg-slate-100"
                  />
                  <h3 className="font-extrabold text-neutral-800 dark:text-neutral-100 mt-3 text-base">
                    {top3[1].name}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-0.5 rounded-md mt-1 border border-slate-200 dark:border-slate-700">
                    {top3[1].role}
                  </span>
                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 w-full flex justify-around text-xs">
                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block font-medium text-[10px] uppercase">
                        Points
                      </span>
                      <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                        {top3[1].points.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block font-medium text-[10px] uppercase">
                        Streak
                      </span>
                      <span className="font-black text-amber-500 text-sm flex items-center justify-center space-x-0.5">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{top3[1].streakDays}d</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rank 1 - Gold */}
                <div className="bg-gradient-to-b from-amber-50/50 via-white to-white dark:from-amber-950/20 dark:via-neutral-900 dark:to-neutral-900 border-2 border-amber-300 dark:border-amber-500/50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center relative order-1 md:order-2 md:-translate-y-2 transition-colors">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 font-black text-xs px-4 py-1 rounded-full shadow-xs flex items-center space-x-1">
                    <Crown className="w-4 h-4 fill-amber-950" />
                    <span>CHAMPION</span>
                  </div>
                  <img
                    src={top3[0].avatar}
                    alt={top3[0].name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-md mt-2 bg-amber-50"
                  />
                  <h3 className="font-extrabold text-neutral-900 dark:text-white mt-3 text-lg">
                    {top3[0].name}
                  </h3>
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 px-2.5 py-0.5 rounded-md mt-1 border border-amber-200 dark:border-amber-700/50">
                    {top3[0].role}
                  </span>
                  <div className="mt-4 pt-4 border-t border-amber-100 dark:border-neutral-800 w-full flex justify-around text-xs">
                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block font-medium text-[10px] uppercase">
                        Points
                      </span>
                      <span className="font-black text-indigo-600 dark:text-indigo-400 text-base">
                        {top3[0].points.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block font-medium text-[10px] uppercase">
                        Streak
                      </span>
                      <span className="font-black text-amber-500 text-base flex items-center justify-center space-x-0.5">
                        <Flame className="w-4 h-4 fill-amber-500" />
                        <span>{top3[0].streakDays}d</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rank 3 - Bronze */}
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center relative order-3 transition-colors">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-700 dark:bg-amber-900/80 text-amber-50 font-black text-xs px-3 py-0.5 rounded-full shadow-xs flex items-center space-x-1">
                    <Medal className="w-3.5 h-3.5 text-amber-200" />
                    <span>TOP 3</span>
                  </div>
                  <img
                    src={top3[2].avatar}
                    alt={top3[2].name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-700/20 dark:ring-amber-900/40 mt-2 bg-amber-50"
                  />
                  <h3 className="font-extrabold text-neutral-800 dark:text-neutral-100 mt-3 text-base">
                    {top3[2].name}
                  </h3>
                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-md mt-1 border border-amber-200 dark:border-amber-900/60">
                    {top3[2].role}
                  </span>
                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 w-full flex justify-around text-xs">
                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block font-medium text-[10px] uppercase">
                        Points
                      </span>
                      <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                        {top3[2].points.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 dark:text-neutral-500 block font-medium text-[10px] uppercase">
                        Streak
                      </span>
                      <span className="font-black text-amber-500 text-sm flex items-center justify-center space-x-0.5">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{top3[2].streakDays}d</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Bar & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs transition-colors">
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl w-full sm:w-auto">
                {(["week", "month", "all"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTimeRange(type)}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      timeRange === type
                        ? "bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 shadow-xs"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                    }`}
                  >
                    {type === "week"
                      ? "Tuần này"
                      : type === "month"
                        ? "Tháng này"
                        : "Tất cả thời gian"}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm học viên..."
                  className="w-full bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700 pl-10 pr-4 py-2 rounded-xl text-xs text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-hidden focus:border-[#5A67FF] dark:focus:border-[#5A67FF] focus:bg-white dark:focus:bg-neutral-800 transition-all font-medium"
                />
              </div>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 ? (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-12 text-center flex flex-col items-center justify-center space-y-3">
                <Inbox className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
                <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                  Không tìm thấy dữ liệu xếp hạng phù hợp.
                </p>
              </div>
            ) : (
              /* Leaderboard Table */
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden transition-colors">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                        <th className="py-3.5 px-6 w-16 text-center">Hạng</th>
                        <th className="py-3.5 px-6">Học viên</th>
                        <th className="py-3.5 px-6 text-center">Xu hướng</th>
                        <th className="py-3.5 px-6 text-center">
                          Số đề đã thi
                        </th>
                        <th className="py-3.5 px-6 text-center">
                          Chuỗi học (Streak)
                        </th>
                        <th className="py-3.5 px-6 text-right">Tổng điểm</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {(searchQuery || top3.length < 3
                        ? filteredUsers
                        : restUsers
                      ).map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/50 transition-colors"
                        >
                          <td className="py-4 px-6 text-center font-black text-neutral-500 dark:text-neutral-400">
                            #{user.rank}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover shrink-0 bg-neutral-100"
                              />
                              <div>
                                <div className="font-bold text-neutral-800 dark:text-neutral-100 text-sm">
                                  {user.name}
                                </div>
                                {user.role && (
                                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold">
                                    {user.role}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              {user.trend === "up" && (
                                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />+
                                  {user.trendAmount}
                                </span>
                              )}
                              {user.trend === "down" && (
                                <span className="inline-flex items-center text-rose-500 dark:text-rose-400 font-bold text-[11px]">
                                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                                  -{user.trendAmount}
                                </span>
                              )}
                              {user.trend === "same" && (
                                <Minus className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-neutral-600 dark:text-neutral-400">
                            <span className="inline-flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                              <span>{user.examsCompleted} bài</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center font-bold text-amber-600 dark:text-amber-400">
                            <span className="inline-flex items-center space-x-1">
                              <Flame className="w-3.5 h-3.5 fill-amber-500" />
                              <span>{user.streakDays} ngày</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-black text-indigo-600 dark:text-indigo-400 text-sm">
                            {user.points.toLocaleString()} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Current User Rank Bar */}
        <div className="bg-indigo-900 dark:bg-indigo-950 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-700 dark:border-indigo-800 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-700 dark:bg-indigo-800 flex items-center justify-center font-black text-amber-300 text-sm">
              #{currentUser.rank}
            </div>
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-400 dark:ring-indigo-500"
              />
              <div>
                <h4 className="font-extrabold text-sm">{currentUser.name}</h4>
                <p className="text-xs text-indigo-200 dark:text-indigo-300">
                  Thứ hạng của bạn
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-indigo-800 dark:border-indigo-900 pt-3 sm:pt-0">
            <div className="text-center">
              <span className="text-indigo-300 block text-[10px] uppercase font-semibold">
                Đề đã giải
              </span>
              <span className="font-bold text-sm">
                {currentUser.examsCompleted}
              </span>
            </div>
            <div className="text-center">
              <span className="text-indigo-300 block text-[10px] uppercase font-semibold">
                Chuỗi học
              </span>
              <span className="font-bold text-sm text-amber-300 flex items-center justify-center space-x-0.5">
                <Flame className="w-3.5 h-3.5 fill-amber-300" />
                <span>{currentUser.streakDays}d</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-indigo-300 block text-[10px] uppercase font-semibold">
                Điểm tích lũy
              </span>
              <span className="font-black text-sm text-indigo-100">
                {currentUser.points.toLocaleString()} pts
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
