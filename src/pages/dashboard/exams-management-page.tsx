import * as React from "react";
import { Plus, HelpCircle, FileSpreadsheet } from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import ExamsStatGrid from "@/components/organism/dashboard/exam/ExamsStatGrid";
import ExamsFilterBar, {
  type FilterStatus,
} from "@/components/organism/dashboard/exam/ExamsFilterBar";
import ExamsTable from "@/components/organism/dashboard/exam/ExamsTable";
import CreateSingleQuestionModal, {
  type CreateQuestionFormData,
} from "@/components/organism/dashboard/exam/modals/CreateSingleQuestionModal";
import ImportCsvModal from "@/components/organism/dashboard/exam/modals/ImportCsvModal";
import { useGetExamsQuery, type Exam } from "@/redux/exam/examApiSlice";
import { useCreateQuestionMutation } from "@/redux/question/questionApiSlice";

export default function ExamsManagementPage() {
  const { data: exams = [], isLoading, isError, refetch } = useGetExamsQuery();

  // RTK Query Mutation để thêm câu hỏi vào Database
  const [createQuestion] = useCreateQuestionMutation();

  // Filters state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<FilterStatus>("ALL");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");

  // Modals state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = React.useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const categories = React.useMemo(() => {
    const set = new Set(exams.map((e) => e.category));
    return ["ALL", ...Array.from(set)];
  }, [exams]);

  const filteredExams = React.useMemo(() => {
    return exams.filter((exam) => {
      const matchesSearch = exam.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || exam.status === statusFilter;
      const matchesCategory =
        categoryFilter === "ALL" || exam.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [exams, searchQuery, statusFilter, categoryFilter]);

  const stats = React.useMemo(() => {
    return {
      total: exams.length,
      active: exams.filter((e) => e.status === "ACTIVE").length,
      inactive: exams.filter((e) => e.status === "INACTIVE").length,
      outdated: exams.filter((e) => e.status === "OUTDATED").length,
    };
  }, [exams]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this exam?")) {
      console.log("Delete exam ID:", id);
      // Trigger RTK Query delete mutation here when added
    }
  };

  // Handler for creating a single question (Đã gắn API call)
  const handleCreateQuestion = async (data: CreateQuestionFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Single Question Payload:", data);

      // Gọi RTK Query mutation lưu câu hỏi xuống Database
      await createQuestion(data).unwrap();

      refetch();
    } catch (error) {
      console.error("Failed to create question:", error);
      // Re-throw để modal bắt lỗi và hiển thị error toast
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for bulk CSV import
  const handleImportCsv = async (questions: CreateQuestionFormData[]) => {
    setIsSubmitting(true);
    try {
      console.log("Bulk Imported Questions:", questions);
      // Trigger bulk upload mutation hoặc dispatch batch creation tại đây
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-800 tracking-tight">
              Exams Management
            </h1>
            <p className="text-xs text-neutral-500 font-medium mt-1">
              Create, organize, and monitor performance analytics across all
              examination suites.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setIsCsvModalOpen(true)}
              className="bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Import CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsQuestionModalOpen(true)}
              className="bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Add Question</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Open Create Exam Modal")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Exam</span>
            </button>
          </div>
        </div>

        <ExamsStatGrid stats={stats} />

        <ExamsFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categories={categories}
        />

        <ExamsTable
          exams={filteredExams}
          isLoading={isLoading}
          isError={isError}
          onRefetch={refetch}
          onDelete={handleDelete}
          onEdit={(exam: Exam) => alert(`Edit ${exam.name}`)}
          onView={(exam: Exam) => alert(`View ${exam.name}`)}
        />
      </main>

      {/* Modals */}
      <CreateSingleQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSubmit={handleCreateQuestion}
        isSubmitting={isSubmitting}
      />

      <ImportCsvModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onImport={handleImportCsv}
        isSubmitting={isSubmitting}
      />

      <Footer />
    </div>
  );
}
