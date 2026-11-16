import * as React from "react";
import {
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
  const [courses] = React.useState([
    {
      id: "crs-1",
      title: "Kỹ thuật phát triển web toàn diện",
      code: "CS-ENG-01",
      associatedDecks: 5,
      totalStudents: 142,
      status: "Published",
      updatedAt: "2 hours ago",
    },
    {
      id: "crs-2",
      title: "Kiến trúc hệ thống nâng cao",
      code: "CS-ARCH-04",
      associatedDecks: 3,
      totalStudents: 89,
      status: "Published",
      updatedAt: "Yesterday",
    },
    {
      id: "crs-3",
      title: "Thiết kế hệ thống UI/UX",
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
    <div className="w-full space-y-8">
      {/* Header Action Dashboard Hub Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Danh sách khóa học
          </h1>
          <p className="text-xs text-foreground-subtle font-medium mt-0.5">
            Thiết lập thông tin khóa học, liên kết bộ thẻ và theo dõi số liệu đăng ký.
          </p>
        </div>

        <button
          type="button"
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo khóa học</span>
        </button>
      </div>

      {/* High-Density Analytics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-background-card border border-border/80 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wider">
              Khóa học đang hoạt động
            </p>
            <p className="text-xl font-black text-foreground mt-0.5">
              {courses.length}
            </p>
          </div>
        </div>

        <div className="bg-background-card border border-border/80 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wider">
              Các bộ thẻ được liên kết
            </p>
            <p className="text-xl font-black text-foreground mt-0.5">
              12 mảng dữ liệu
            </p>
          </div>
        </div>

        <div className="bg-background-card border border-border/80 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-foreground-subtle uppercase tracking-wider">
              Tổng số học viên đăng ký
            </p>
            <p className="text-xl font-black text-foreground mt-0.5">
              231 người dùng
            </p>
          </div>
        </div>
      </div>

      {/* Filter Control Utility Box */}
      <div className="bg-background-card border border-border/80 p-4 rounded-2xl shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
          <input
            type="text"
            placeholder="Tìm theo tên khóa học hoặc mã dữ liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border text-xs font-medium text-foreground focus:outline-none focus:border-brand transition-all"
          />
        </div>
      </div>

      {/* Main Course System Layout Table Data */}
      <div className="bg-background-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border text-[10px] font-bold text-foreground-subtle uppercase tracking-wider">
                <th className="px-6 py-4">Thông tin khóa học</th>
                <th className="px-6 py-4">Cấu trúc bộ thẻ</th>
                <th className="px-6 py-4">Số lượt đang sử dụng</th>
                <th className="px-6 py-4">Trạng thái triển khai</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/80 text-xs font-medium text-foreground-muted">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-background/50 transition-colors group"
                  >
                    {/* Title and Identification Code */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-background-hover group-hover:bg-pink-50 flex items-center justify-center text-foreground-subtle group-hover:text-brand transition-colors">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            {course.title}
                          </p>
                          <p className="text-[10px] text-foreground-subtle font-bold uppercase tracking-wider mt-0.5">
                            {course.code}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Associated Flashcard Decks Count */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-foreground">
                          {course.associatedDecks} Bộ thẻ
                        </span>
                        <span className="text-foreground-subtle font-normal">
                          trong mảng
                        </span>
                      </div>
                    </td>

                    {/* Total Enrolled Students Count */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-foreground">
                          {course.totalStudents} Học viên
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
                        <span>{course.status === "Published" ? "Đã xuất bản" : course.status === "Draft" ? "Bản nháp" : course.status}</span>
                      </span>
                    </td>

                    {/* Inline Actions Menu Trigger */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        className="w-7 h-7 inline-flex items-center justify-center text-foreground-subtle hover:text-foreground-muted hover:bg-background-hover rounded-lg transition-all cursor-pointer"
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
                    className="px-6 py-10 text-center font-semibold text-foreground-subtle"
                  >
                    Không tìm thấy khóa học phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
