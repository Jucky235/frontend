import * as React from "react";
import { Plus, Upload, Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/organism/common/Header";
import QuestionFilterBar from "@/components/organism/dashboard/question/QuestionFilterBar";
import QuestionList from "@/components/organism/dashboard/question/QuestionList";
import QuestionFormModal from "@/components/organism/dashboard/question/QuestionFormModal";
import ImportCsvModal from "@/components/organism/dashboard/exam/modals/ImportCsvModal";
import {
  type Question,
  type CreateQuestionPayload,
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "@/redux/question/questionApiSlice";

const DEFAULT_FORM_STATE: CreateQuestionPayload = {
  content: "",
  partNumber: 1,
  options: { A: "", B: "", C: "", D: "" },
  right_answer: "A",
  explanation: "",
};

export default function QuestionManagementPage() {
  // Query Filters & Search State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPartFilter, setSelectedPartFilter] = React.useState<
    number | "ALL"
  >("ALL");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // RTK Query Hooks
  const queryParams = React.useMemo(() => {
    return {
      search: searchQuery.trim() || undefined,
      partNumber: selectedPartFilter === "ALL" ? undefined : selectedPartFilter,
    };
  }, [searchQuery, selectedPartFilter]);

  const {
    data: questionsData,
    isLoading,
    isError,
    refetch,
  } = useGetQuestionsQuery(queryParams);

  const [createQuestion, { isLoading: isCreating }] =
    useCreateQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] =
    useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isImportCsvOpen, setIsImportCsvOpen] = React.useState(false);
  const [editingQuestion, setEditingQuestion] = React.useState<Question | null>(
    null,
  );

  // Form State
  const [formData, setFormData] =
    React.useState<CreateQuestionPayload>(DEFAULT_FORM_STATE);
  const [formError, setFormError] = React.useState("");

  // Keydown listener for Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isModalOpen) setIsModalOpen(false);
        if (isImportCsvOpen) setIsImportCsvOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, isImportCsvOpen]);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setFormData(DEFAULT_FORM_STATE);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      content: q.content,
      partNumber: q.partNumber || 1,
      options: {
        A: q.options?.A || "",
        B: q.options?.B || "",
        C: q.options?.C || "",
        D: q.options?.D || "",
      },
      right_answer: q.right_answer || "A",
      explanation: q.explanation || "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        setDeletingId(id);
        await deleteQuestion(id).unwrap();
      } catch (err) {
        console.error("Failed to delete question:", err);
        alert("Failed to delete question. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      setFormError("Question content is required.");
      return;
    }

    const { A, B, C, D } = formData.options;
    if (!A.trim() || !B.trim() || !C.trim() || !D.trim()) {
      setFormError("All 4 options (A, B, C, D) must be filled out.");
      return;
    }

    try {
      if (editingQuestion) {
        await updateQuestion({
          id: editingQuestion.id,
          data: formData,
        }).unwrap();
      } else {
        await createQuestion(formData).unwrap();
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Save failed:", err);
      setFormError(
        err?.data?.message || "An error occurred while saving the question.",
      );
    }
  };

  const handleCsvImportSuccess = () => {
    setIsImportCsvOpen(false);
    refetch(); // Refresh question list upon successful import
  };

  const questionsList = questionsData?.items || [];

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-sans p-4 sm:p-6 lg:p-8">
      <Header />
      <div className="max-w-7xl mx-auto space-y-6 mt-4">
        {/* --- Top Action Bar --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div>
            <h1 className="text-2xl font-black text-neutral-800 tracking-tight">
              Question Management
            </h1>
            <p className="text-sm font-medium text-neutral-500 mt-0.5">
              Create, edit, and organize exam questions by TOEIC/IELTS parts.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {/* Import CSV Button */}
            <button
              type="button"
              onClick={() => setIsImportCsvOpen(true)}
              className="flex items-center justify-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-sm px-4 py-2.5 rounded-xl border border-emerald-200 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 stroke-[2.5]" />
              <span>Import CSV</span>
            </button>

            {/* Add New Question Button */}
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="flex items-center justify-center space-x-2 bg-[#5A67FF] hover:bg-indigo-600 active:scale-95 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Question</span>
            </button>
          </div>
        </div>

        {/* --- Search & Filters Bar --- */}
        <QuestionFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPartFilter={selectedPartFilter}
          onPartFilterChange={setSelectedPartFilter}
        />

        {/* --- Main Content Area --- */}
        {isLoading ? (
          <div className="bg-white p-16 text-center rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#5A67FF] animate-spin" />
            <p className="text-sm font-semibold text-neutral-600">
              Loading questions...
            </p>
          </div>
        ) : isError ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-rose-200 shadow-xs space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <p className="text-base font-bold text-neutral-800">
              Failed to load questions
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <QuestionList
            questions={questionsList}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteQuestion}
          />
        )}

        {/* --- Form Modal --- */}
        <QuestionFormModal
          isOpen={isModalOpen}
          editingQuestion={editingQuestion}
          formData={formData}
          formError={formError}
          isSaving={isCreating || isUpdating}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveQuestion}
          onFormDataChange={setFormData}
          onClearError={() => setFormError("")}
        />

        {/* --- CSV Import Modal --- */}
        <ImportCsvModal
          isOpen={isImportCsvOpen}
          onClose={() => setIsImportCsvOpen(false)}
          onSuccess={handleCsvImportSuccess}
        />
      </div>
    </div>
  );
}
