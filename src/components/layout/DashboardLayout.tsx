import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  FileSpreadsheet,
  HelpCircle,
  Newspaper,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const DASHBOARD_ITEMS: SidebarItem[] = [
  {
    label: "User Management",
    path: "/dashboard/user",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Course Management",
    path: "/dashboard/course",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    label: "Exams Management",
    path: "/dashboard/exam",
    icon: <FileSpreadsheet className="w-5 h-5" />,
  },
  {
    label: "Question Management",
    path: "/dashboard/question",
    icon: <HelpCircle className="w-5 h-5" />,
  },
  {
    label: "News Management",
    path: "/dashboard/news",
    icon: <Newspaper className="w-5 h-5" />,
  },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`relative flex flex-col h-screen sticky top-0 bg-background-card border-r border-border transition-all duration-300 z-30 ${
          isCollapsed ? "w-24" : "w-80"
        }`}
      >
        {/* Sidebar Header / Logo (Fixed at Top) */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-border shrink-0">
          {!isCollapsed && (
            <Link
              to="/"
              className="flex items-center space-x-3 font-black text-base tracking-tighter"
            >
              <div className="w-10 h-10 rounded-xl bg-brand text-brand-foreground flex items-center justify-center shadow-xs">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-foreground text-sm font-extrabold">
                Admin Console
              </span>
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl bg-background-hover text-foreground-subtle hover:text-foreground transition-colors mx-auto"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Cards (Scrollable Area) */}
        <div className="flex-1 py-6 px-4 space-y-3 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-[11px] font-extrabold uppercase text-foreground-subtle tracking-wider">
              Management
            </div>
          )}
          {DASHBOARD_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center p-3.5 rounded-2xl transition-all group relative border ${
                  isActive
                    ? "bg-brand text-brand-foreground border-brand shadow-lg shadow-brand/25 scale-[1.02]"
                    : "bg-background/60 hover:bg-background-hover border-border/60 hover:border-border text-foreground-subtle hover:text-foreground shadow-xs"
                } ${isCollapsed ? "justify-center p-4" : "space-x-3.5"}`}
                title={isCollapsed ? item.label : undefined}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-white/20 text-brand-foreground"
                      : "bg-background-hover text-foreground-subtle group-hover:text-foreground group-hover:bg-background"
                  }`}
                >
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <div className="flex flex-col text-left truncate">
                    <span
                      className={`text-xs font-black truncate tracking-tight ${
                        isActive ? "text-brand-foreground" : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`text-[10px] font-semibold truncate ${
                        isActive
                          ? "text-brand-foreground/80"
                          : "text-foreground-subtle"
                      }`}
                    >
                      Configure & view
                    </span>
                  </div>
                )}

                {/* Tooltip for collapsed view */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-background-card border border-border text-foreground text-xs font-bold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer / Back to App (Fixed Position at Bottom) */}
        <div className="p-4 border-t border-border shrink-0 bg-background-card sticky bottom-0 z-10">
          <button
            onClick={() => navigate("/")}
            className={`w-full flex items-center p-3.5 rounded-2xl border border-border/60 bg-background/60 text-foreground-subtle hover:bg-background-hover hover:text-foreground hover:border-border transition-all shadow-xs ${
              isCollapsed ? "justify-center p-4" : "space-x-3.5"
            }`}
            title="Exit to Main App"
          >
            <div className="w-10 h-10 rounded-xl bg-background-hover text-foreground-subtle flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col text-left truncate">
                <span className="text-xs font-black text-foreground truncate tracking-tight">
                  Exit Dashboard
                </span>
                <span className="text-[10px] font-semibold text-foreground-subtle truncate">
                  Return to client app
                </span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-background">
        <header className="h-20 border-b border-border bg-background-card px-8 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-base font-extrabold text-foreground capitalize">
            {location.pathname.split("/").pop()?.replace("-", " ") ||
              "Dashboard"}
          </h1>
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-brand/10 text-brand border border-brand/20">
            Admin Mode
          </span>
        </header>

        <div className="p-6 sm:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
