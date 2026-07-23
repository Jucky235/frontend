import * as React from "react";
import {
  LogOut,
  User,
  ArrowLeft,
  Plus,
  Search,
  BookOpen,
  Layers,
  Users,
  GraduationCap,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function CourseManagementPage() {
  // Mock Data Array for Assigned System Courses
  const [courses, setCourses] = React.useState([
    {
      id: "crs-1",
      title: "Full-Stack Web Engineering",
      code: "CS-ENG-01",
      associatedDecks: 5,
      totalStudents: 142,
      status: "Published",
      updatedAt: "2 hours ago",
    },
    {
      id: "crs-2",
      title: "Advanced Systems Architecture",
      code: "CS-ARCH-04",
      associatedDecks: 3,
      totalStudents: 89,
      status: "Published",
      updatedAt: "Yesterday",
    },
    {
      id: "crs-3",
      title: "UI/UX Design Systems Blueprint",
      code: "CS-DSGN-02",
      associatedDecks: 4,
      totalStudents: 0,
      status: "Draft",
      updatedAt: "3 days ago",
    },
  ]);

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()),
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
              J
            </div>
            <span className="font-bold text-lg text-neutral-800 tracking-tight">
              Admin Hub
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
        {/* Header Action Dashboard Hub Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-800 tracking-tight">
              Course Curations
            </h1>
            <p className="text-xs text-neutral-400 font-medium mt-0.5">
              Construct course parameters, map flashcard collection arrays, and
              inspect enrollment metrics.
            </p>
          </div>

          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>

        {/* 3. High-Density Analytics Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5A67FF]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Active Courses
              </p>
              <p className="text-xl font-black text-neutral-800 mt-0.5">
                {courses.length}
              </p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Mapped Card Decks
              </p>
              <p className="text-xl font-black text-neutral-800 mt-0.5">
                12 Arrays
              </p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Total Enrolled
              </p>
              <p className="text-xl font-black text-neutral-800 mt-0.5">
                231 Users
              </p>
            </div>
          </div>
        </div>

        {/* 4. Filter Control Utility Box */}
        <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by course title or database code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] transition-all"
            />
          </div>
        </div>

        {/* 5. Main Course System Layout Table Data */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Course Parameters</th>
                  <th className="px-6 py-4">Deck Frameworks</th>
                  <th className="px-6 py-4">Active Seats</th>
                  <th className="px-6 py-4">Deploy Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80 text-xs font-medium text-neutral-700">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="hover:bg-neutral-50/50 transition-colors group"
                    >
                      {/* Title and Identification Code */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-indigo-50 flex items-center justify-center text-neutral-500 group-hover:text-[#5A67FF] transition-colors">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-neutral-800">
                              {course.title}
                            </p>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                              {course.code}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Associated Flashcard Decks Count */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-neutral-800">
                            {course.associatedDecks} Decks
                          </span>
                          <span className="text-neutral-400 font-normal">
                            in array
                          </span>
                        </div>
                      </td>

                      {/* Total Enrolled Students Count */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-neutral-800">
                            {course.totalStudents} Students
                          </span>
                        </div>
                      </td>

                      {/* Deployment Status Indicator */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            course.status === "Published"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}
                        >
                          {course.status === "Published" ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                          )}
                          <span>{course.status}</span>
                        </span>
                      </td>

                      {/* Inline Actions Menu Trigger */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          className="w-7 h-7 inline-flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center font-semibold text-neutral-400"
                    >
                      No matching course curations found in current dataset
                      arrays.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 4. Footer Baseline Component Group */}
      <footer className="w-full bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 font-medium">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>
    </div>
  );
}
