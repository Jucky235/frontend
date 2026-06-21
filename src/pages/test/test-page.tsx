import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import {
  startExam,
  selectAnswer,
  resetExamState,
} from "@/redux/exam/examSlice";
import { useGetExamByIdQuery } from "@/redux/exam/examApiSlice";
import {
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  Image as ImageIcon,
} from "lucide-react";

export default function TestPage() {
  const { id: routeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 🌟 INJECTED: Fallback to your specific exam ID if one isn't in the URL yet!
  const id = routeId || "f64a1834-f62c-474c-bf33-a13e992a137b";

  // 1. Fetch live data from backend
  const { data: exam, isLoading, error } = useGetExamByIdQuery(id);

  // 2. Fetch tracking metrics from Redux
  const selections = useAppSelector((state) => state.exam.userAnswers);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);

  // Audio Player State
  const [playingAudioId, setPlayingAudioId] = React.useState<string | null>(
    null,
  );
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Initialize slice when test loads
  React.useEffect(() => {
    if (id) {
      dispatch(startExam({ examId: id }));
    }
    return () => {
      dispatch(resetExamState());
      audioRef.current?.pause();
    };
  }, [id, dispatch]);

  const handleToggleAudio = (questionId: string, url: string) => {
    if (playingAudioId === questionId) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      audioRef.current?.pause();
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setPlayingAudioId(questionId);
      audioRef.current!.onended = () => setPlayingAudioId(null);
    }
  };

  const handleSelectOption = (questionId: string, optionKey: string) => {
    if (isSubmitted) return;
    dispatch(selectAnswer({ questionId, answer: optionKey }));
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam?.questions) return;

    let finalScore = 0;
    exam.questions.forEach((q) => {
      if (selections[q.id] === q.right_answer) finalScore += 1;
    });

    setScore(finalScore);
    setIsSubmitted(true);
    audioRef.current?.pause();
    setPlayingAudioId(null);
  };

  const handleResetExam = () => {
    dispatch(startExam({ examId: id }));
    setIsSubmitted(false);
    setScore(0);
    audioRef.current?.pause();
    setPlayingAudioId(null);
  };

  // --- LOADING & ERROR UI ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 text-neutral-500">
        <RefreshCw className="w-8 h-8 animate-spin text-[#5A67FF] mb-4" />
        <p className="font-medium animate-pulse">Loading your exam...</p>
      </div>
    );
  }

  if (error || !exam || !exam.questions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-rose-500 font-bold">
        Failed to load exam data. Make sure your backend is running!
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Block Row */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="flex items-center space-x-1 text-sm font-semibold text-neutral-500 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 bg-neutral-200/60 px-3 py-1 rounded-md">
            {exam.name} {/* Real dynamic title! */}
          </span>
        </div>

        {/* Evaluation Score Card */}
        {isSubmitted && (
          <div className="w-full bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-neutral-800 text-lg">
                  Test Complete!
                </h3>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  You answered {score} out of {exam.questions.length} correctly.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="bg-neutral-50 px-5 py-2.5 rounded-xl border border-neutral-200 text-center flex-1 sm:flex-initial">
                <span className="text-xs font-bold text-neutral-400 block uppercase tracking-wider">
                  Score
                </span>
                <span className="text-xl font-black text-neutral-800">
                  {Math.round((score / exam.questions.length) * 100)}%
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetExam}
                className="bg-neutral-900 hover:bg-neutral-800 text-white p-3.5 rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Real Dynamic Questions Map */}
        <form onSubmit={handleSubmitExam} className="space-y-6">
          {exam.questions.map((q, qIdx) => {
            const userSelection = selections[q.id];
            const isCurrentAudioPlaying = playingAudioId === q.id;

            return (
              <div
                key={q.id}
                className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5"
              >
                {/* 1. Question Title */}
                <div className="flex items-start space-x-3">
                  <span className="text-sm font-black text-indigo-500 bg-indigo-50 w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h2 className="text-base font-bold text-neutral-800 leading-snug">
                    {q.content}
                  </h2>
                </div>

                {/* Optional Media Handlers could go here (if you add imageUrl/audioUrl to schema later) */}

                {/* 2. Dynamic JSON Options Loop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Object.entries maps over your DB {"A": "since", "B": "during"} JSON block */}
                  {Object.entries(q.options as Record<string, string>).map(
                    ([optKey, optText]) => {
                      const isSelected = userSelection === optKey;
                      const isCorrect = q.right_answer === optKey;

                      // Styling Logic
                      let optionStyle =
                        "border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300";
                      let badgeStyle =
                        "bg-neutral-100 text-neutral-600 border-neutral-300";

                      if (!isSubmitted) {
                        if (isSelected) {
                          optionStyle =
                            "border-[#5A67FF] bg-indigo-50/40 shadow-xs";
                          badgeStyle =
                            "bg-[#5A67FF] text-white border-[#5A67FF]";
                        }
                      } else {
                        if (isCorrect) {
                          optionStyle =
                            "border-emerald-500 bg-emerald-50/30 text-emerald-900 shadow-xs";
                          badgeStyle =
                            "bg-emerald-500 text-white border-emerald-500";
                        } else if (isSelected && !isCorrect) {
                          optionStyle =
                            "border-rose-400 bg-rose-50/30 text-rose-900";
                          badgeStyle = "bg-rose-500 text-white border-rose-500";
                        } else {
                          optionStyle =
                            "border-neutral-200 bg-white opacity-60";
                        }
                      }

                      return (
                        <button
                          type="button"
                          key={optKey}
                          onClick={() => handleSelectOption(q.id, optKey)}
                          disabled={isSubmitted}
                          className={`border rounded-xl p-3.5 flex items-center space-x-3 text-left transition-all font-medium text-sm text-neutral-700 select-none ${
                            !isSubmitted
                              ? "cursor-pointer active:scale-[0.99]"
                              : "cursor-default"
                          } ${optionStyle}`}
                        >
                          <span
                            className={`w-6 h-6 text-xs font-bold border rounded-lg flex items-center justify-center shrink-0 tracking-tight transition-colors ${badgeStyle}`}
                          >
                            {optKey}
                          </span>
                          <span className="leading-tight">{optText}</span>
                        </button>
                      );
                    },
                  )}
                </div>

                {/* Explanation Block (Only shows after submitting) */}
                {isSubmitted && q.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 text-blue-800 text-sm rounded-xl border border-blue-100 font-medium">
                    <strong className="block mb-1 text-blue-900 uppercase text-xs tracking-wider">
                      Explanation
                    </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Action Button */}
          {!isSubmitted && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={
                  Object.keys(selections).length < exam.questions.length
                }
                className="w-full bg-[#5A67FF] hover:bg-indigo-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-xl tracking-wide transition-all shadow-md cursor-pointer"
              >
                Submit Exam ({Object.keys(selections).length}/
                {exam.questions.length})
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
