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
  onDelete: (id: string | number) => void;
  onEdit: (exam: Exam) => void;
  onView: (exam: Exam) => void;
  onAddQuestionsToExam?: (
    examId: string | number,
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
          <span className="examstable-badge variant-success">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active</span>
          </span>
        );
      case "INACTIVE":
        return (
          <span className="examstable-badge variant-warning">
            <AlertCircle className="w-3 h-3" />
            <span>Inactive</span>
          </span>
        );
      case "OUTDATED":
        return (
          <span className="examstable-badge variant-neutral">
            <Archive className="w-3 h-3" />
            <span>Outdated</span>
          </span>
        );
      default:
        return (
          <span className="examstable-badge variant-neutral">
            <HelpCircle className="w-3 h-3" />
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
  const alreadySelectedQuestionIds: number[] = useMemo(() => {
    if (!selectedExamForAdd) return [];

    const directQs =
      selectedExamForAdd.questions
        ?.map((q: any) => (typeof q.id === "number" ? q.id : Number(q.id ?? q.questionId)))
        .filter((id): id is number => Number.isFinite(id)) || [];

    const partQs =
      selectedExamForAdd.parts
        ?.flatMap((part: any) => part.questions || [])
        .map((q: any) => (typeof q.id === "number" ? q.id : Number(q.id ?? q.questionId)))
        .filter((id): id is number => Number.isFinite(id)) || [];

    return Array.from(new Set([...directQs, ...partQs]));
  }, [selectedExamForAdd]);

  if (isLoading) {
    return (
      <div className="examstable-state-panel">
        <RefreshCw className="examstable-state-spinner w-6 h-6 animate-spin" />
        <p>Loading exams from server...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="examstable-state-panel">
        <p className="examstable-state-error-text">
          Failed to load exams list.
        </p>
        <button
          type="button"
          onClick={onRefetch}
          className="examstable-state-retry-btn cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="examstable-wrapper">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="examstable-head-row">
                <th className="examstable-head-cell">Exam Name</th>
                <th className="examstable-head-cell">Category</th>
                <th className="examstable-head-cell">Duration & Qs</th>
                <th className="examstable-head-cell">Parts</th>
                <th className="examstable-head-cell">Status</th>
                <th className="examstable-head-cell text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="examstable-body text-xs font-medium">
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
                    <tr key={exam.id} className="examstable-body-row group">
                      <td className="examstable-cell">
                        <div className="space-y-0.5">
                          <p className="examstable-name">{exam.name}</p>
                          <p className="examstable-id">ID: {exam.id}</p>
                        </div>
                      </td>

                      <td className="examstable-cell">
                        <span className="examstable-category-badge">
                          {exam.category}
                        </span>
                      </td>

                      <td className="examstable-cell">
                        <div className="examstable-duration">
                          <span className="examstable-duration-strong">
                            {exam.time} mins
                          </span>
                          <span className="examstable-duration-divider">•</span>
                          <span>{totalQs} Qs</span>
                        </div>
                      </td>

                      <td className="examstable-cell">
                        <span className="examstable-parts">
                          {partCount > 0 ? `${partCount} Parts` : "Single Part"}
                        </span>
                      </td>

                      <td className="examstable-cell">
                        {renderStatusBadge(exam.status)}
                      </td>

                      <td className="examstable-cell text-right">
                        <Dropdown
                          align="right"
                          width="w-44"
                          items={rowActions}
                          trigger={
                            <button
                              type="button"
                              className="examstable-row-menu-btn cursor-pointer"
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
                  <td colSpan={6} className="examstable-empty-cell">
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
