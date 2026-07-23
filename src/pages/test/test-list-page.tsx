import * as React from "react";
import { Link } from "react-router-dom"; // Added for routing
import {
  LogOut,
  User,
  ArrowLeft,
  Search,
  Timer,
  FileText,
  Award,
  ArrowRight,
  HelpCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useGetExamsQuery } from "@/redux/exam/examApiSlice";

export default function ExamListPage() {
  const { data: exams = [], isLoading, isError, error } = useGetExamsQuery();
  const [searchQuery, setSearchQuery] = React.useState("");

  // Map API fields ('name' and 'time') to match the UI layout safely
  const filteredExams = exams.filter(
    (exam) =>
      exam.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              T
            </div>
            <span className="font-bold text-lg text-neutral-800 tracking-tight">
              Test Hub
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
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-800 tracking-tight">
            Certifications & Exams
          </h1>
          <p className="text-xs text-neutral-400 font-medium mt-0.5">
            Validate your mastery levels across advanced architectural
            frameworks and runtime languages.
          </p>
        </div>

        {/* 3. Search Filtration Box */}
        <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter assessments by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading || isError}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* 4. Dynamic Async Conditional Rendering Layout */}
        <div className="space-y-4">
          {isLoading && (
            <div className="bg-white border border-neutral-200 p-16 rounded-2xl flex flex-col items-center justify-center space-y-3 text-neutral-500 shadow-xs">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="text-xs font-semibold">
                Retrieving assessments from server...
              </span>
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border border-red-200 p-8 rounded-2xl flex items-start space-x-3 text-red-800 shadow-xs">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold">
                  Failed to connect to Workspace API
                </h4>
                <p className="text-xs font-medium text-red-600/80">
                  {error && "status" in error
                    ? `Error Code: ${error.status}`
                    : "Unknown synchronization connection anomaly."}
                </p>
              </div>
            </div>
          )}

          {!isLoading &&
            !isError &&
            filteredExams.length > 0 &&
            filteredExams.map((exam) => {
              const isActive = exam.status === "ACTIVE";
              return (
                <div
                  key={exam.id}
                  className={`bg-white border p-6 rounded-2xl transition-all shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 group ${
                    !isActive
                      ? "border-neutral-200/60 opacity-60 bg-neutral-50/50"
                      : "border-neutral-200/80 hover:border-indigo-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-start space-x-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        !isActive
                          ? "bg-neutral-100 text-neutral-400"
                          : "bg-indigo-50 text-[#5A67FF] group-hover:bg-indigo-100"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-base font-bold tracking-tight leading-tight transition-colors ${
                            isActive
                              ? "text-neutral-800 group-hover:text-[#5A67FF]"
                              : "text-neutral-500"
                          }`}
                        >
                          {exam.name}
                        </h3>

                        {!isActive && (
                          <span className="bg-neutral-100 text-neutral-500 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md">
                            {exam.status}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-500 leading-relaxed font-medium max-w-2xl">
                        Category: {exam.category} Assessment Module.
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 text-[11px] font-semibold text-neutral-400">
                        <span className="flex items-center space-x-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{exam.questions?.length ?? 0} items</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Timer className="w-3.5 h-3.5" />
                          <span>{exam.time} min duration</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>Standard Rating</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end lg:border-t-0 border-t border-neutral-100 pt-4 lg:pt-0 flex-shrink-0">
                    {!isActive ? (
                      <button
                        type="button"
                        disabled
                        className="bg-neutral-100 text-neutral-400 border border-neutral-200 font-bold text-xs px-4 py-2.5 rounded-xl cursor-not-allowed"
                      >
                        Unavailable
                      </button>
                    ) : (
                      <Link
                        to={`/test/${exam.id}`}
                        className="group bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl tracking-wide shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95 select-none"
                      >
                        <span>Begin Exam</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}

          {!isLoading && !isError && filteredExams.length === 0 && (
            <div className="bg-white border border-dashed border-neutral-200 p-12 rounded-2xl text-center text-sm font-semibold text-neutral-400">
              No evaluation tests matched your parameters.
            </div>
          )}
        </div>
      </main>

      <footer className="w-full bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 font-medium">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>
    </div>
  );
}
