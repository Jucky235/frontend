import * as React from "react";
import {
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  Image as ImageIcon,
} from "lucide-react";

interface Question {
  id: number;
  questionText: string;
  imageUrl?: string; // Optional layout picture
  audioUrl?: string; // Optional layout audio source
  options: { key: "A" | "B" | "C" | "D"; text: string }[];
  correctAnswer: "A" | "B" | "C" | "D";
}

export default function TestPage() {
  const sampleQuestions: Question[] = [
    {
      id: 1,
      questionText:
        "Identify the user interface view element shown in this reference frame screenshot:",
      imageUrl:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60", // Replace with your image link
      options: [
        { key: "A", text: "Floating Notch Input Label" },
        { key: "B", text: "Standard Grid Framework Matrix" },
        { key: "C", text: "Absolute Segmented Drawer Bar" },
        { key: "D", text: "Native Browser Window Canvas" },
      ],
      correctAnswer: "A",
    },
    {
      id: 2,
      questionText:
        "Listen to the pronunciation audio cue. Which translation best fits what you hear?",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Replace with your audio file (.mp3) link
      options: [
        { key: "A", text: "Đăng nhập hệ thống (System Login)" },
        { key: "B", text: "Danh sách đề thi (Exam Sheet Menu)" },
        { key: "C", text: "Quên mật khẩu (Forgot Password)" },
        { key: "D", text: "Tài khoản cá nhân (Personal Profile)" },
      ],
      correctAnswer: "B",
    },
  ];

  // Component State Arrays
  const [selections, setSelections] = React.useState<
    Record<number, "A" | "B" | "C" | "D">
  >({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);

  // Audio Player State Hooks
  const [playingAudioId, setPlayingAudioId] = React.useState<number | null>(
    null,
  );
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Audio Playback Engine Handler
  const handleToggleAudio = (questionId: number, url: string) => {
    if (playingAudioId === questionId) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setPlayingAudioId(questionId);

      // Reset tracker state automatically when audio track finishes running
      audioRef.current.onended = () => {
        setPlayingAudioId(null);
      };
    }
  };

  // Clean up audio playback loop if user leaves page
  React.useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handleSelectOption = (
    questionId: number,
    optionKey: "A" | "B" | "C" | "D",
  ) => {
    if (isSubmitted) return;
    setSelections({ ...selections, [questionId]: optionKey });
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    let finalScore = 0;
    sampleQuestions.forEach((q) => {
      if (selections[q.id] === q.correctAnswer) finalScore += 1;
    });
    setScore(finalScore);
    setIsSubmitted(true);
  };

  const handleResetExam = () => {
    setSelections({});
    setIsSubmitted(false);
    setScore(0);
    audioRef.current?.pause();
    setPlayingAudioId(null);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header Block Row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center space-x-1 text-sm font-semibold text-neutral-500 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 bg-neutral-200/60 px-3 py-1 rounded-md">
            Multimedia Exam
          </span>
        </div>

        {/* Evaluation Feedback Score Card Banner */}
        {isSubmitted && (
          <div className="w-full bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-neutral-800 text-lg">
                  Test Evaluation Complete!
                </h3>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  You answered {score} out of {sampleQuestions.length} questions
                  correctly.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="bg-neutral-50 px-5 py-2.5 rounded-xl border border-neutral-200 text-center flex-1 sm:flex-initial">
                <span className="text-xs font-bold text-neutral-400 block uppercase tracking-wider">
                  Score
                </span>
                <span className="text-xl font-black text-neutral-800">
                  {Math.round((score / sampleQuestions.length) * 100)}%
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

        {/* Media Exam Form Card Set */}
        <form onSubmit={handleSubmitExam} className="space-y-6">
          {sampleQuestions.map((q, qIdx) => {
            const userSelection = selections[q.id];
            const isCurrentAudioPlaying = playingAudioId === q.id;

            return (
              <div
                key={q.id}
                className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5"
              >
                {/* 1. Question Title String */}
                <div className="flex items-start space-x-3">
                  <span className="text-sm font-black text-indigo-500 bg-indigo-50 w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h2 className="text-base font-bold text-neutral-800 leading-snug">
                    {q.questionText}
                  </h2>
                </div>

                {/* 2. OPTIONAL RESOURCE: Picture Box Component */}
                {q.imageUrl && (
                  <div className="relative w-full max-h-64 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center group">
                    <img
                      src={q.imageUrl}
                      alt="Question Context Visual"
                      className="w-full h-full object-cover max-h-64"
                    />
                    <div className="absolute top-3 left-3 bg-neutral-900/70 backdrop-blur-md px-2.5 py-1 rounded-md text-white text-[10px] font-bold tracking-wider uppercase flex items-center space-x-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>Visual Reference</span>
                    </div>
                  </div>
                )}

                {/* 3. OPTIONAL RESOURCE: Interactive Audio Controller Layer */}
                {q.audioUrl && (
                  <div className="w-full bg-indigo-50/50 border border-indigo-100/80 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#5A67FF] text-white rounded-lg flex items-center justify-center shadow-xs">
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-neutral-800 block">
                          Listening Comprehension
                        </span>
                        <span className="text-[11px] text-neutral-500 font-medium">
                          Click play to listen to item sound bite
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleAudio(q.id, q.audioUrl!)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
                        isCurrentAudioPlaying
                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                          : "bg-[#5A67FF] hover:bg-indigo-600 text-white"
                      }`}
                    >
                      {isCurrentAudioPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 4. Selection Buttons Array (A, B, C, D) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt) => {
                    const isSelected = userSelection === opt.key;
                    const isCorrect = q.correctAnswer === opt.key;

                    let optionStyle =
                      "border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300";
                    let badgeStyle =
                      "bg-neutral-100 text-neutral-600 border-neutral-300";

                    if (!isSubmitted) {
                      if (isSelected) {
                        optionStyle =
                          "border-[#5A67FF] bg-indigo-50/40 shadow-xs";
                        badgeStyle = "bg-[#5A67FF] text-white border-[#5A67FF]";
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
                        optionStyle = "border-neutral-200 bg-white opacity-60";
                      }
                    }

                    return (
                      <button
                        type="button"
                        key={opt.key}
                        onClick={() => handleSelectOption(q.id, opt.key)}
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
                          {opt.key}
                        </span>
                        <span className="leading-tight">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Bottom Action Form Trigger Button */}
          {!isSubmitted && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={
                  Object.keys(selections).length < sampleQuestions.length
                }
                className="w-full bg-[#5A67FF] hover:bg-indigo-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-xl tracking-wide transition-all shadow-md cursor-pointer"
              >
                Submit Exam Sheet ({Object.keys(selections).length}/
                {sampleQuestions.length})
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
