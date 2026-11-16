import * as React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Timer,
  FileText,
  Award,
  ArrowRight,
  HelpCircle,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetExamsQuery } from "@/redux/exam/examApiSlice";
import Header from "@/components/organism/common/Header";

interface ExamListPageProps {
  pageSize?: number; // Optional custom page size, defaults to 6 items per page
}

export default function ExamListPage({ pageSize = 6 }: ExamListPageProps) {
  const { data: exams = [], isLoading, isError, error } = useGetExamsQuery();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Map API fields ('name' and 'time') to match the UI layout safely
  const filteredExams = React.useMemo(() => {
    return exams.filter(
      (exam) =>
        exam.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.category?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [exams, searchQuery]);

  // Reset to page 1 whenever search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate total pages & guard against out-of-bounds page indices
  const totalPages = Math.ceil(filteredExams.length / pageSize) || 1;
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  // Get current slice of exams for pagination
  const paginatedExams = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredExams.slice(start, start + pageSize);
  }, [filteredExams, currentPage, pageSize]);

  return (
    <div className="study-page font-inter examlist-page">
      <Header />

      {/* 2. Main Layout Container Area */}
      <main className="examlist-main">
        <div>
          <h1 className="examlist-page-title">Chứng chỉ và bài thi</h1>
          <p className="examlist-page-subtitle">
            Đánh giá trình độ của bạn qua các bài thi và kỹ năng chuyên sâu.
          </p>
        </div>

        {/* 3. Search Filtration Box */}
        <div className="deck-filter-bar">
          <div className="relative w-full max-w-md">
            <Search className="deck-filter-search-icon w-4 h-4" />
            <input
              type="text"
              placeholder="Lọc bài thi theo tên hoặc từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading || isError}
              className="deck-filter-search-input disabled:opacity-50"
            />
          </div>
        </div>

        {/* 4. Dynamic Async Conditional Rendering Layout */}
        <div className="examlist-list">
          {isLoading && (
            <div className="examlist-loading-panel">
              <Loader2 className="examlist-loading-spinner w-8 h-8 animate-spin" />
              <span>Đang tải bài thi từ máy chủ...</span>
            </div>
          )}

          {isError && (
            <div className="examlist-error-panel">
              <AlertCircle className="examlist-error-icon w-5 h-5 mt-0.5" />
              <div className="space-y-1">
                <h4 className="examlist-error-title">
                  Không thể kết nối đến API Workspace
                </h4>
                <p className="examlist-error-desc">
                  {error && "status" in error
                    ? `Error Code: ${error.status}`
                    : "Unknown synchronization connection anomaly."}
                </p>
              </div>
            </div>
          )}

          {!isLoading &&
            !isError &&
            paginatedExams.length > 0 &&
            paginatedExams.map((exam) => {
              const isActive = exam.status === "ACTIVE";
              return (
                <div
                  key={exam.id}
                  className={`examlist-card group ${
                    isActive ? "is-active" : "is-inactive"
                  }`}
                >
                  <div className="examlist-card-main">
                    <div
                      className={`examlist-card-icon-wrapper ${
                        isActive ? "is-active" : "is-inactive"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="examlist-card-info">
                      <div className="examlist-card-header">
                        <h3
                          className={`examlist-card-title ${
                            isActive ? "is-active" : "is-inactive"
                          }`}
                        >
                          {exam.name}
                        </h3>

                        {!isActive && (
                          <span className="examlist-card-status-badge">
                            {exam.status}
                          </span>
                        )}
                      </div>

                      <p className="examlist-card-desc">
                        Danh mục: {exam.category} Mô-đun đánh giá.
                      </p>

                      <div className="examlist-card-meta">
                        <span className="examlist-card-meta-item">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{exam.questions?.length ?? 0} mục</span>
                        </span>
                        <span className="examlist-card-meta-item">
                          <Timer className="w-3.5 h-3.5" />
                          <span>{exam.time} phút</span>
                        </span>
                        <span className="examlist-card-meta-item">
                          <Award className="w-3.5 h-3.5" />
                          <span>Đánh giá tiêu chuẩn</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`examlist-card-actions ${
                      !isActive ? "has-divider" : ""
                    }`}
                  >
                    {!isActive ? (
                      <button
                        type="button"
                        disabled
                        className="examlist-btn-unavailable"
                      >
                        Không khả dụng
                      </button>
                    ) : (
                      <Link
                        to={`/test/${exam.id}`}
                        className="examlist-btn-begin cursor-pointer active:scale-95"
                      >
                        <span>Bắt đầu bài thi</span>
                        <ArrowRight className="examlist-btn-begin-arrow w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

          {!isLoading && !isError && filteredExams.length === 0 && (
            <div className="deck-feed-empty-panel">
              Không tìm thấy bài kiểm tra phù hợp với lựa chọn của bạn.
            </div>
          )}

          {/* 5. Pagination Footer Controls */}
          {!isLoading && !isError && filteredExams.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-4 pt-6 pb-2">
              <div className="text-sm text-foreground-subtle text-center">
                Đang hiển thị{" "}
                <span className="font-bold">
                  {(currentPage - 1) * pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-bold">
                  {Math.min(currentPage * pageSize, filteredExams.length)}
                </span>{" "}
                of <span className="font-bold">{filteredExams.length}</span>{" "}
                Bài thi
              </div>

              <div className="flex items-center space-x-1.5 flex-wrap justify-center">
                {/* Previous Page Arrow */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2.5 rounded-xl border border-border bg-background-card text-foreground hover:bg-background-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center font-medium text-sm"
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Numbered Page Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    const isActive = page === currentPage;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[42px] px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                          isActive
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-background-card border-border text-foreground hover:bg-background-hover"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  },
                )}

                {/* Next Page Arrow */}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2.5 rounded-xl border border-border bg-background-card text-foreground hover:bg-background-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center font-medium text-sm"
                  aria-label="Trang tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="deck-footer">
        &copy; 2026 Hệ thống Workspace. Bảo lưu mọi quyền.
      </footer>
    </div>
  );
}
