import * as React from "react";
import {
  LogOut,
  User,
  ArrowLeft,
  Award,
  CheckCircle2,
  XCircle,
  Timer,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ExamResultPage() {
  // Mock Exam Results Data Output
  const performanceSummary = {
    examTitle: "JavaScript Engine Architecture Certification",
    score: 84, // Out of 100
    passingScore: 80,
    timeTaken: "58 min 12 sec",
    totalQuestions: 50,
    correctAnswers: 42,
    incorrectAnswers: 8,
    status: "Passed",
    domains: [
      { name: "Memory Management & V8 Garbage Collection", percentage: 90 },
      { name: "Event Loop & Asynchronous Task Queues", percentage: 85 },
      { name: "Compilation & Runtime Optimizations", percentage: 75 },
    ],
  };

  // Mock Expanded State array for Question Review Breakdown List
  const [expandedQuestion, setExpandedQuestion] = React.useState<number | null>(
    null,
  );

  const mockQuestionsReview = [
    {
      id: 1,
      status: "correct",
      question:
        "Which component of the V8 engine is responsible for generating optimized machine code dynamically at runtime?",
      userAnswer: "TurboFan",
      correctAnswer: "TurboFan",
      explanation:
        "TurboFan is V8's optimization compiler. It takes the bytecode produced by Ignition and compiles it into highly optimized machine code based on profiling data collected during execution.",
    },
    {
      id: 2,
      status: "incorrect",
      question:
        "What type of reference scheduling does the V8 garbage collector use to identify unreachable memory allocation structures?",
      userAnswer: "Reference Counting",
      correctAnswer: "Generational Mark-and-Sweep",
      explanation:
        "V8 utilizes a generational stop-the-world/incremental mark-and-sweep garbage collection framework rather than reference counting, split into the New Space (Scavenger) and Old Space pointer trackers.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      {/* 1. Dynamic Top Navigation Hub Bar */}
      <header className="w-full bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Return to Test Hub</span>
          </button>
          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              J
            </div>
            <span className="font-bold text-lg text-neutral-800 tracking-tight">
              Report Card
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-red-500 transition-colors px-2 py-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Main Layout Container Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10 flex flex-col space-y-8">
        {/* Banner Scoreboard Panel Segment */}
        <section
          className={`w-full border rounded-3xl p-8 text-neutral-800 shadow-md relative overflow-hidden bg-white ${
            performanceSummary.score >= performanceSummary.passingScore
              ? "border-emerald-200/80"
              : "border-red-200/80"
          }`}
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  performanceSummary.score >= performanceSummary.passingScore
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                Assessment {performanceSummary.status}
              </span>
              <h1 className="text-xl md:text-2xl font-extrabold text-neutral-800 tracking-tight leading-tight max-w-xl">
                {performanceSummary.examTitle}
              </h1>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-neutral-500 pt-1">
                <span className="flex items-center space-x-1.5">
                  <Timer className="w-4 h-4" />
                  <span>Duration: {performanceSummary.timeTaken}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Award className="w-4 h-4" />
                  <span>
                    Requirement: {performanceSummary.passingScore}% minimum
                  </span>
                </span>
              </div>
            </div>

            {/* Giant Metric Ring Block Wrapper */}
            <div className="flex items-center space-x-4 self-center md:self-auto bg-neutral-50 border border-neutral-200/60 p-5 rounded-2xl min-w-[160px] justify-center shadow-xs">
              <div className="text-center">
                <p className="text-[28px] font-black tracking-tight text-neutral-800 leading-none">
                  {performanceSummary.score}%
                </p>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1.5">
                  Final Grade
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Section Grid split metrics & sub-domain analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Quick Itemized Metrics Box */}
          <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Metrics Output
            </h3>

            <div className="flex items-center justify-between p-2.5 hover:bg-neutral-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Correct Items</span>
              </div>
              <span className="text-sm font-extrabold text-neutral-800">
                {performanceSummary.correctAnswers}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 hover:bg-neutral-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-600">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Incorrect Items</span>
              </div>
              <span className="text-sm font-extrabold text-neutral-800">
                {performanceSummary.incorrectAnswers}
              </span>
            </div>

            <hr className="border-neutral-100" />

            <button
              type="button"
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs px-4 py-3 rounded-xl tracking-wide shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Practice</span>
            </button>
          </div>

          {/* Sub-Domain Target Array Competencies */}
          <div className="md:col-span-2 bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-xs space-y-5">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Knowledge Focus Areas
            </h3>

            <div className="space-y-4">
              {performanceSummary.domains.map((domain, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-neutral-700">
                    <span className="truncate max-w-[280px] sm:max-w-md">
                      {domain.name}
                    </span>
                    <span>{domain.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        domain.percentage >= 80
                          ? "bg-emerald-500"
                          : domain.percentage >= 70
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${domain.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Question-by-Question Itemized Evaluation Matrix Review */}
        <section className="space-y-4">
          <h2 className="text-base font-extrabold text-neutral-800 tracking-tight">
            Itemized Question Audit Log
          </h2>

          <div className="space-y-3">
            {mockQuestionsReview.map((item, index) => {
              const isOpen = expandedQuestion === index;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-xs transition-all"
                >
                  {/* Collapsible Header Row Triggers */}
                  <div
                    onClick={() => setExpandedQuestion(isOpen ? null : index)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50/60 transition-colors selection:bg-transparent"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="pt-0.5 flex-shrink-0">
                        {item.status === "correct" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-neutral-800 leading-snug">
                        Item #{item.id}: {item.question}
                      </p>
                    </div>

                    <div className="text-neutral-400 flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Audit Card Content */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-neutral-100 bg-neutral-50/40 space-y-4 text-xs font-medium">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                        <div className="p-3 bg-white border border-neutral-200/60 rounded-xl">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                            Your Selection
                          </p>
                          <p
                            className={`mt-1 font-bold ${item.status === "correct" ? "text-emerald-700" : "text-red-700"}`}
                          >
                            {item.userAnswer}
                          </p>
                        </div>

                        {item.status !== "correct" && (
                          <div className="p-3 bg-white border border-neutral-200/60 rounded-xl">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                              Correct Resolution
                            </p>
                            <p className="mt-1 font-bold text-emerald-700">
                              {item.correctAnswer}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Diagnostic Explanatory Text Segment */}
                      <div className="p-4 bg-indigo-50/50 border border-indigo-100/60 rounded-xl space-y-1">
                        <h4 className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                          Architectural Rationale
                        </h4>
                        <p className="text-neutral-600 leading-relaxed font-medium">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 4. Footer Baseline Component Group */}
      <footer className="w-full bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 font-medium">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>
    </div>
  );
}
