import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  CheckSquare,
  Square,
  Plus,
  HelpCircle,
  Filter,
  Layers,
  Hash,
} from "lucide-react";
import {
  useGetQuestionsQuery,
  type Question,
} from "@/redux/question/questionApiSlice";

export interface ExamPart {
  partNumber: number;
  title?: string;
}

export interface SelectedQuestionPayload {
  questionId: number;
  partNumber: number;
  question: Question;
}

export interface AddQuestionToExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestions: (selectedQuestions: SelectedQuestionPayload[]) => void;
  alreadySelectedIds?: number[];
  /** Dynamic exam parts passed from parent exam state */
  examParts?: ExamPart[];
}

export const AddQuestionToExamModal: React.FC<AddQuestionToExamModalProps> = ({
  isOpen,
  onClose,
  onAddQuestions,
  alreadySelectedIds = [],
  examParts = [],
}) => {
  // Fetch questions when modal is active
  const {
    data: questionsResponse,
    isLoading,
    isError,
  } = useGetQuestionsQuery({ limit: 1000 }, { skip: !isOpen });

  // Handle both array response and paginated { items: Question[] } response
  const questions: Question[] = useMemo(() => {
    if (!questionsResponse) return [];
    if (Array.isArray(questionsResponse)) return questionsResponse;
    return questionsResponse.items || [];
  }, [questionsResponse]);

  // Extract available part numbers (fallback to [1, 2, 3, 4, 5, 6, 7] if empty)
  const availableParts = useMemo(() => {
    if (examParts && examParts.length > 0) {
      return examParts.map((p) => p.partNumber);
    }
    return [1, 2, 3, 4, 5, 6, 7];
  }, [examParts]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [fromId, setFromId] = useState<string>("");
  const [toId, setToId] = useState<string>("");
  const [targetPart, setTargetPart] = useState<number>(availableParts[0] ?? 1);
  const [selectedMap, setSelectedMap] = useState<Record<number, number>>({});

  // Reset or update target part when available parts change or modal opens
  useEffect(() => {
    if (isOpen && availableParts.length > 0) {
      setTargetPart(availableParts[0]);
    }
  }, [isOpen, availableParts]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const alreadySelectedSet = useMemo(
    () => new Set(alreadySelectedIds),
    [alreadySelectedIds],
  );

  const categories = useMemo(() => {
    const set = new Set(questions.map((q) => q.category).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [questions]);

  // Filtered and sorted by numeric ID (ascending)
  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const minId = fromId !== "" ? Number(fromId) : null;
    const maxId = toId !== "" ? Number(toId) : null;

    return questions
      .filter((q) => {
        // Search filter (ID or Content)
        const contentMatch = (q.content || "").toLowerCase().includes(query);
        const idMatch = String(q.id ?? "")
          .toLowerCase()
          .includes(query);
        const matchesSearch = !query || contentMatch || idMatch;

        // Category filter
        const matchesCategory =
          categoryFilter === "ALL" || q.category === categoryFilter;

        // ID Range filter
        const matchesFromId =
          minId === null || (q.id !== undefined && q.id >= minId);
        const matchesToId =
          maxId === null || (q.id !== undefined && q.id <= maxId);

        return matchesSearch && matchesCategory && matchesFromId && matchesToId;
      })
      .sort((a, b) => a.id - b.id);
  }, [questions, searchQuery, categoryFilter, fromId, toId]);

  if (!isOpen) return null;

  const handleToggleSelect = (q: Question) => {
    if (alreadySelectedSet.has(q.id)) return;

    setSelectedMap((prev) => {
      const next = { ...prev };
      if (next[q.id] !== undefined) {
        delete next[q.id];
      } else {
        next[q.id] = targetPart;
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const selectable = filteredQuestions.filter(
      (q) => !alreadySelectedSet.has(q.id),
    );
    const allSelected = selectable.every(
      (q) => selectedMap[q.id] !== undefined,
    );

    if (allSelected) {
      setSelectedMap((prev) => {
        const next = { ...prev };
        selectable.forEach((q) => delete next[q.id]);
        return next;
      });
    } else {
      setSelectedMap((prev) => {
        const next = { ...prev };
        selectable.forEach((q) => {
          next[q.id] = targetPart;
        });
        return next;
      });
    }
  };

  const handleBatchPartChange = (partNum: number) => {
    setTargetPart(partNum);
    setSelectedMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((idKey) => {
        const numericId = Number(idKey);
        next[numericId] = partNum;
      });
      return next;
    });
  };

  const handleSingleItemPartChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    questionId: number,
  ) => {
    e.stopPropagation();
    const newPart = Number(e.target.value);
    setSelectedMap((prev) => ({
      ...prev,
      [questionId]: newPart,
    }));
  };

  const handleConfirmAdd = () => {
    const payload: SelectedQuestionPayload[] = [];
    questions.forEach((q) => {
      if (selectedMap[q.id] !== undefined) {
        payload.push({
          questionId: q.id,
          partNumber: selectedMap[q.id],
          question: q,
        });
      }
    });

    onAddQuestions(payload);
    setSelectedMap({});
    onClose();
  };

  const selectedCount = Object.keys(selectedMap).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex w-full max-w-4xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-white">
                Thêm câu hỏi vào đề thi
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Lựa chọn danh sách câu hỏi và chọn Part để chèn vào.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Control Toolbar */}
        <div className="border-b border-neutral-200 bg-neutral-50/50 p-4 space-y-3 dark:border-neutral-700 dark:bg-neutral-800/50">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Bar */}
            <div className="relative md:col-span-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo ID hoặc nội dung..."
                className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-4 py-2 text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
            </div>

            {/* ID Range Filter (From ID -> To ID) */}
            <div className="md:col-span-4 flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 dark:border-neutral-700 dark:bg-neutral-900">
              <Hash className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 shrink-0">
                ID:
              </span>
              <input
                type="number"
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                placeholder="Từ ID"
                className="w-full rounded-lg bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-neutral-800 dark:text-white"
              />
              <span className="text-xs text-neutral-400 font-bold">-</span>
              <input
                type="number"
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                placeholder="Đến ID"
                className="w-full rounded-lg bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-neutral-800 dark:text-white"
              />
              {(fromId || toId) && (
                <button
                  type="button"
                  onClick={() => {
                    setFromId("");
                    setToId("");
                  }}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
                  title="Xóa lọc ID"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative md:col-span-4">
              <div className="flex items-center rounded-xl border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900">
                <Filter className="mr-2 h-3.5 w-3.5 text-neutral-400 shrink-0" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium text-neutral-700 dark:text-neutral-200 focus:outline-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      className="dark:bg-neutral-800"
                    >
                      {cat === "ALL" ? "Tất cả danh mục" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Target Exam Part Selector */}
            <div className="relative md:col-span-7">
              <div className="flex items-center rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 dark:border-indigo-800 dark:bg-indigo-950/40">
                <Layers className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="mr-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200 shrink-0">
                  Chèn vào Part:
                </span>
                <select
                  value={targetPart}
                  onChange={(e) =>
                    handleBatchPartChange(Number(e.target.value))
                  }
                  className="w-full bg-transparent text-xs font-bold text-indigo-700 dark:text-indigo-300 focus:outline-none cursor-pointer"
                >
                  {availableParts.map((num) => {
                    const partDetail = examParts?.find(
                      (p) => p.partNumber === num,
                    );
                    const label = partDetail?.title
                      ? `Part ${num} - ${partDetail.title}`
                      : `Part ${num}`;
                    return (
                      <option
                        key={num}
                        value={num}
                        className="dark:bg-neutral-800 font-medium"
                      >
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Table Toolbar Info & Select All */}
            <div className="md:col-span-5 flex items-center justify-between md:justify-end gap-3 text-xs px-1">
              <button
                type="button"
                onClick={handleSelectAll}
                className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5 transition-colors"
              >
                Chọn tất cả ({filteredQuestions.length})
              </button>
              <span className="text-neutral-500 dark:text-neutral-400">
                Đã chọn:{" "}
                <strong className="text-indigo-600 dark:text-indigo-400">
                  {selectedCount}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[50vh]">
          {isLoading ? (
            <div className="flex py-12 justify-center items-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : isError ? (
            <div className="py-10 text-center text-xs text-rose-500 font-semibold">
              Không thể tải danh sách câu hỏi. Vui lòng thử lại sau.
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Không tìm thấy câu hỏi nào phù hợp.
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isAlreadyAdded = alreadySelectedSet.has(q.id);
              const isSelected = selectedMap[q.id] !== undefined;

              return (
                <div
                  key={q.id}
                  onClick={() => handleToggleSelect(q)}
                  className={`flex items-start gap-3.5 rounded-xl border p-3.5 transition-all cursor-pointer ${
                    isAlreadyAdded
                      ? "opacity-50 bg-neutral-100 border-neutral-200 cursor-not-allowed dark:bg-neutral-800/40 dark:border-neutral-700"
                      : isSelected
                        ? "border-indigo-500 bg-indigo-50/40 dark:border-indigo-600 dark:bg-indigo-950/20 shadow-xs"
                        : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
                  }`}
                >
                  <div className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400">
                    {isAlreadyAdded ? (
                      <CheckSquare className="h-5 w-5 text-neutral-400" />
                    ) : isSelected ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5 text-neutral-300 dark:text-neutral-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                        #{q.id}
                      </span>
                      {q.category && (
                        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                          {q.category}
                        </span>
                      )}
                      {isAlreadyAdded && (
                        <span className="text-[10px] italic text-neutral-400 font-medium">
                          (Đã có trong đề)
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 line-clamp-2">
                      {q.content}
                    </p>
                  </div>

                  {/* Per-item Part selection dropdown */}
                  {isSelected && (
                    <div
                      className="shrink-0 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={selectedMap[q.id]}
                        onChange={(e) => handleSingleItemPartChange(e, q.id)}
                        className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs focus:outline-none cursor-pointer transition-colors"
                      >
                        {availableParts.map((num) => (
                          <option
                            key={num}
                            value={num}
                            className="bg-white text-neutral-800 dark:bg-neutral-800 dark:text-white"
                          >
                            Part {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={handleConfirmAdd}
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Plus className="h-4 w-4" />
            Xác nhận thêm ({selectedCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionToExamModal;
