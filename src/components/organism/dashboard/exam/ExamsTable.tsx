import { useState, useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Archive,
  RefreshCw,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import Dropdown, {
  type DropdownItem,
} from "@/components/organism/common/Dropdown";
import AddQuestionToExamModal, {
  type SelectedQuestionPayload,
  type ExamPart,
} from "@/components/organism/dashboard/exam/modals/AddQuestionToExamModal";
import { type Exam, type ExamStatus } from "@/redux/exam/examApiSlice";

interface ExamsTableProps {
  exams: Exam[];
  isLoading: boolean;
  isError: boolean;
  onRefetch: () => void;
  onDelete: (id: string) => void;
  onEdit: (exam: Exam) => void;
  onView: (exam: Exam) => void;
  onAddQuestionsToExam?: (
    examId: string,
    questions: SelectedQuestionPayload[],
  ) => void;
}

export default function ExamsTable({
  exams,
  isLoading,
  isError,
  onRefetch,
  onDelete,
  onEdit,
  onView,
  onAddQuestionsToExam,
}: ExamsTableProps) {
  const [selectedExamForAdd, setSelectedExamForAdd] = useState<Exam | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getQuestionCount = (exam: Exam): number => {
    if (exam.questions && exam.questions.length > 0) {
      return exam.questions.length;
    }
    if (exam.parts && exam.parts.length > 0) {
      return exam.parts.reduce(
        (sum, part) => sum + (part.questions?.length || 0),
        0,
      );
    }
    return 0;
  };

  const renderStatusBadge = (status: ExamStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Active</span>
          </span>
        );
      case "INACTIVE":
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            <span>Inactive</span>
          </span>
        );
      case "OUTDATED":
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
            <Archive className="w-3 h-3 text-neutral-400" />
            <span>Outdated</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-500 border border-neutral-200">
            <HelpCircle className="w-3 h-3 text-neutral-400" />
            <span>{status}</span>
          </span>
        );
    }
  };

  const handleOpenAddQuestionsModal = (exam: Exam) => {
    setSelectedExamForAdd(exam);
    setIsAddModalOpen(true);
  };

  const handleCloseAddQuestionsModal = () => {
    setSelectedExamForAdd(null);
    setIsAddModalOpen(false);
  };

  const handleConfirmAddQuestions = (
    selectedQuestions: SelectedQuestionPayload[],
  ) => {
    if (selectedExamForAdd && onAddQuestionsToExam) {
      onAddQuestionsToExam(selectedExamForAdd.id, selectedQuestions);
    }
    handleCloseAddQuestionsModal();
  };

  // Derive target parts for the selected exam (Defaults to Part 1 for single-part exams)
  const examPartsForModal: ExamPart[] = useMemo(() => {
    if (!selectedExamForAdd) return [];

    if (selectedExamForAdd.parts && selectedExamForAdd.parts.length > 0) {
      return selectedExamForAdd.parts.map((p, idx) => ({
        partNumber: p.partNumber ?? idx + 1,
        title: p.title || p.name,
      }));
    }

    return [];
  }, [selectedExamForAdd]);
  // Extract existing question IDs across single-part and multi-part exams
  const alreadySelectedQuestionIds: string[] = useMemo(() => {
    if (!selectedExamForAdd) return [];

    const directQs =
      selectedExamForAdd.questions
        ?.map((q: any) => q.id || q.questionId)
        .filter(Boolean) || [];

    const partQs =
      selectedExamForAdd.parts
        ?.flatMap((part: any) => part.questions || [])
        .map((q: any) => q.id || q.questionId)
        .filter(Boolean) || [];

    return Array.from(new Set([...directQs, ...partQs])) as string[];
  }, [selectedExamForAdd]);

  if (isLoading) {
    return (
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center text-xs font-semibold text-neutral-400 space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
        <p>Loading exams from server...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center text-xs font-semibold text-rose-500 space-y-3">
        <p>Failed to load exams list.</p>
        <button
          type="button"
          onClick={onRefetch}
          className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors font-bold cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Exam Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Duration & Qs</th>
                <th className="py-3.5 px-4">Parts</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs font-medium text-neutral-700">
              {exams.length > 0 ? (
                exams.map((exam) => {
                  const totalQs = getQuestionCount(exam);
                  const partCount = exam.parts?.length ?? 0;

                  const rowActions: DropdownItem[] = [
                    {
                      label: "View Details",
                      icon: <Eye className="w-3.5 h-3.5" />,
                      onClick: () => onView(exam),
                    },
                    {
                      label: "Edit Exam",
                      icon: <Edit className="w-3.5 h-3.5" />,
                      onClick: () => onEdit(exam),
                    },
                    {
                      label: "Add Questions",
                      icon: <PlusCircle className="w-3.5 h-3.5" />,
                      onClick: () => handleOpenAddQuestionsModal(exam),
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 className="w-3.5 h-3.5" />,
                      danger: true,
                      divider: true,
                      onClick: () => onDelete(exam.id),
                    },
                  ];

                  return (
                    <tr
                      key={exam.id}
                      className="hover:bg-neutral-50/80 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <p className="font-bold text-neutral-800 group-hover:text-indigo-600 transition-colors">
                            {exam.name}
                          </p>
                          <p className="text-[11px] font-mono text-neutral-400">
                            ID: {exam.id}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 font-semibold text-[11px]">
                          {exam.category}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-neutral-600">
                          <span className="font-bold">{exam.time} mins</span>
                          <span className="text-neutral-300 mx-1.5">•</span>
                          <span>{totalQs} Qs</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-neutral-800">
                          {partCount > 0 ? `${partCount} Parts` : "Single Part"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {renderStatusBadge(exam.status)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Dropdown
                          align="right"
                          width="w-44"
                          items={rowActions}
                          trigger={
                            <button
                              type="button"
                              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-neutral-400 font-semibold"
                  >
                    No exams match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Question Modal Integration */}
      {isAddModalOpen && selectedExamForAdd && (
        <AddQuestionToExamModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddQuestionsModal}
          onAddQuestions={handleConfirmAddQuestions}
          alreadySelectedIds={alreadySelectedQuestionIds}
          examParts={examPartsForModal}
        />
      )}
    </>
  );
}
