import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import {
  startExam,
  selectAnswer,
  resetExamState,
} from "@/redux/exam/examSlice";
import {
  useGetExamByIdQuery,
  useSubmitExamMutation,
  type ExamPart,
  type Question,
} from "@/redux/exam/examApiSlice";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
} from "lucide-react";

import { ExamHeader } from "@/components/organism/exam/ExamHeader";
import { ScoreCard } from "@/components/organism/exam/ScoreCard";
import { QuestionCard } from "@/components/organism/exam/QuestionCard";

export default function TestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: exam, isLoading, error } = useGetExamByIdQuery(id!);
  const [submitExam, { isLoading: isSubmitting }] = useSubmitExamMutation();

  const selections = useAppSelector((state) => state.exam.userAnswers);
  const [currentPartIndex, setCurrentPartIndex] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [startTime, setStartTime] = React.useState<string>(
    new Date().toISOString(),
  );

  // Timer state in seconds (defaulting to exam.time in minutes * 60)
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);

  const [playingAudioId, setPlayingAudioId] = React.useState<string | null>(
    null,
  );
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Reset exam on mount or ID change
  React.useEffect(() => {
    if (id) {
      dispatch(startExam({ examId: id }));
      setStartTime(new Date().toISOString());
    }
    return () => {
      dispatch(resetExamState());
      audioRef.current?.pause();
    };
  }, [id, dispatch]);

  // Initialize timer once exam data is loaded
  React.useEffect(() => {
    if (exam && exam.time) {
      setTimeLeft(exam.time * 60); // convert minutes to seconds
    }
  }, [exam]);

  // Handle countdown timer logic
  React.useEffect(() => {
    if (timeLeft === null || isSubmitted) return;

    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleToggleAudio = (questionId: string | number, url: string) => {
    if (playingAudioId === String(questionId)) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      audioRef.current?.pause();
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setPlayingAudioId(String(questionId));
      audioRef.current!.onended = () => setPlayingAudioId(null);
    }
  };

  const handleSelectOption = (questionId: string | number, optionKey: string) => {
    if (isSubmitted) return;
    dispatch(selectAnswer({ questionId: String(questionId), answer: optionKey }));
  };

  // Format seconds to HH:MM:SS or MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Group or retrieve structured exam parts with safe question unwrapping
  const partsList: ExamPart[] = React.useMemo(() => {
    if (!exam) return [];

    const normalizeQuestion = (qItem: any): Question => {
      const target = qItem.question ? qItem.question : qItem;
      return {
        id: target.id ?? qItem.questionId ?? qItem.id ?? 0,
        content: target.content || "",
        options: target.options || {},
        right_answer: target.right_answer || target.rightAnswer || "A",
        category: target.category || "TOEIC",
        partNumber: target.partNumber ?? qItem.partNumber ?? 1,
        explanation: target.explanation ?? qItem.explanation ?? null,
        imagePath: target.imagePath ?? qItem.imagePath ?? null,
        audioPath: target.audioPath ?? qItem.audioPath ?? null,
        topicNumber: target.topicNumber ?? null,
        createdAt: target.createdAt || new Date().toISOString(),
        updatedAt: target.updatedAt || new Date().toISOString(),
      };
    };

    const parts = exam.parts || [];
    const questions = exam.questions || [];

    if (parts && parts.length > 0) {
      return parts.map((part) => ({
        ...part,
        questions: (part.questions || []).map((q) => normalizeQuestion(q)),
      }));
    }

    if (questions && questions.length > 0) {
      const grouped = questions.reduce<Record<number, Question[]>>(
        (acc, qItem) => {
          const normalized = normalizeQuestion(qItem);
          const pNum = qItem.partNumber || 1;
          if (!acc[pNum]) acc[pNum] = [];
          acc[pNum].push(normalized);
          return acc;
        },
        {},
      );

      return Object.entries(grouped).map(([pNum, qList]) => ({
        id: `part-${pNum}`,
        examId: exam.id,
        partNumber: Number(pNum),
        name: `Part ${pNum}`,
        sortOrder: Number(pNum),
        questions: qList,
        createdAt: exam.createdAt,
        updatedAt: exam.updatedAt,
      }));
    }

    return [];
  }, [exam]);

  const handleSubmitExam = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!exam || isSubmitting) return;

    const allQuestions: Question[] = partsList.flatMap((p) => p.questions);

    try {
      await submitExam({
        examId: id!,
        answers: selections,
        startedAt: startTime,
        submittedAt: new Date().toISOString(),
      }).unwrap();

      let finalScore = 0;
      allQuestions.forEach((q) => {
        if (selections[q.id] === q.right_answer) finalScore += 1;
      });

      setScore(finalScore);
      setIsSubmitted(true);
      audioRef.current?.pause();
      setPlayingAudioId(null);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Đã xảy ra lỗi khi nộp bài lên hệ thống. Vui lòng thử lại!");
    }
  };

  const handleResetExam = () => {
    if (!id || !exam) return;
    dispatch(startExam({ examId: id }));
    setStartTime(new Date().toISOString());
    setIsSubmitted(false);
    setCurrentPartIndex(0);
    setScore(0);
    setTimeLeft(exam.time * 60);
    audioRef.current?.pause();
    setPlayingAudioId(null);
  };

  const scrollToQuestion = (questionId: string | number) => {
    const el = document.getElementById(`question-${String(questionId)}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 text-neutral-500">
        <RefreshCw className="w-8 h-8 animate-spin text-[#5A67FF] mb-4" />
        <p className="font-medium animate-pulse">Loading exam parts...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-rose-500 font-bold">
        Failed to load exam data.
      </div>
    );
  }

  const currentPart = partsList[currentPartIndex] || {
    name: "Part 1",
    questions: [],
  };

  const totalQuestions = partsList.reduce(
    (acc, p) => acc + (p.questions?.length || 0),
    0,
  );

  const answeredQuestionsCount = Object.keys(selections).length;

  const previousQuestionsCount = partsList
    .slice(0, currentPartIndex)
    .reduce((acc, p) => acc + (p.questions?.length || 0), 0);

  const isLowTime = timeLeft !== null && timeLeft <= 300; // Less than 5 mins

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ExamHeader examName={exam.name} onBack={() => navigate(-1)} />

        <div className="mt-6 flex flex-col lg:flex-row gap-8 items-start relative">
          {/* Main Question Area */}
          <main className="flex-1 w-full space-y-6">
            {isSubmitted && (
              <ScoreCard
                score={score}
                totalQuestions={totalQuestions}
                onReset={handleResetExam}
              />
            )}

            {/* Part Header & Instructions */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-neutral-800">
                  {currentPart.name || `Part ${currentPartIndex + 1}`}
                </h2>
                <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                  {currentPart.questions?.length || 0} Questions
                </span>
              </div>
              {currentPart.instructions && (
                <p className="text-sm text-neutral-600 italic bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  {currentPart.instructions}
                </p>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {(currentPart.questions || []).map(
                (q: Question, qIdx: number) => (
                  <div key={q.id} id={`question-${q.id}`}>
                    <QuestionCard
                      question={q}
                      index={previousQuestionsCount + qIdx}
                      userSelection={selections[q.id]}
                      isSubmitted={isSubmitted}
                      isSubmitting={isSubmitting}
                      playingAudioId={playingAudioId}
                      onToggleAudio={handleToggleAudio}
                      onSelectOption={handleSelectOption}
                    />
                  </div>
                ),
              )}
            </div>

            {/* Navigation Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <button
                type="button"
                disabled={currentPartIndex === 0}
                onClick={() => {
                  setCurrentPartIndex((prev) => prev - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Part</span>
              </button>

              {currentPartIndex < partsList.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPartIndex((prev) => prev + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex items-center space-x-1.5 px-5 py-2.5 bg-[#5A67FF] hover:bg-indigo-600 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <span>Next Part</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                !isSubmitted && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmitExam()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Exam ({answeredQuestionsCount}/{totalQuestions})
                      </>
                    )}
                  </button>
                )
              )}
            </div>
          </main>

          {/* Floating Right Sidebar (Sticky on desktop) */}
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-8 space-y-4">
            {/* Timer Card */}
            {timeLeft !== null && !isSubmitted && (
              <div
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all shadow-xs ${
                  isLowTime
                    ? "bg-rose-50 border-rose-200 text-rose-700 animate-pulse"
                    : "bg-white border-neutral-200 text-neutral-800"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#5A67FF]" />
                  <span className="font-bold text-sm">Time Remaining</span>
                </div>
                <span className="font-black text-lg tracking-wider font-mono">
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}

            {/* Sidebar Parts & Navigation Card */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-extrabold text-neutral-800 text-base">
                  Parts & Navigation
                </h3>
                <span className="text-xs font-bold text-[#5A67FF] bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {answeredQuestionsCount} / {totalQuestions} Done
                </span>
              </div>

              {/* Part Selector List */}
              <div className="space-y-2">
                {partsList.map((part, idx) => {
                  const partAnsweredCount = (part.questions || []).filter(
                    (q) => selections[q.id] !== undefined,
                  ).length;
                  const isPartComplete =
                    partAnsweredCount === (part.questions?.length || 0) &&
                    (part.questions?.length || 0) > 0;
                  const isActive = currentPartIndex === idx;

                  return (
                    <button
                      key={part.id || idx}
                      type="button"
                      onClick={() => setCurrentPartIndex(idx)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#5A67FF] text-white shadow-xs"
                          : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200/60"
                      }`}
                    >
                      <span>
                        {part.name || `Part ${part.partNumber || idx + 1}`}
                      </span>
                      {isPartComplete ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-400 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-md ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-neutral-200/60 text-neutral-600"
                          }`}
                        >
                          {partAnsweredCount}/{part.questions?.length || 0}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Part Question Grid */}
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                  Quick Jump (
                  {currentPart.name || `Part ${currentPartIndex + 1}`})
                </span>
                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                  {(currentPart.questions || []).map(
                    (q: Question, qIdx: number) => {
                      const globalIdx = previousQuestionsCount + qIdx + 1;
                      const isAnswered = selections[q.id] !== undefined;

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => scrollToQuestion(q.id)}
                          className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                            isAnswered
                              ? "bg-emerald-500 text-white shadow-2xs"
                              : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border border-neutral-200"
                          }`}
                        >
                          {globalIdx}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Global Submit CTA */}
              {!isSubmitted && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmitExam()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Exam"
                  )}
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
