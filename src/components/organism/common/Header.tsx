import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  MessageSquare,
  Bell,
  Heart,
  Globe,
  User,
  Settings,
  LogOut,
  Languages,
  ChevronDown,
  BookOpen,
  Award,
  Users,
  FileText,
  HelpCircle,
  Sun,
  Moon,
} from "lucide-react";
import Dropdown, {
  type DropdownItem,
} from "@/components/organism/common/Dropdown";

interface NavItem {
  label: string;
  href?: string;
  active?: boolean;
  children?: DropdownItem[];
}

interface HeaderProps {
  navItems?: NavItem[];
  chatCount?: number;
  notificationCount?: number;
  avatarUrl?: string;
  onSearchClick?: () => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLanguageSelect?: (lang: string) => void;
}

export default function Header({
  navItems,
  chatCount = 0,
  notificationCount = 13,
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  onSearchClick,
  onLogout,
  onProfileClick,
  onSettingsClick,
  onLanguageSelect,
}: HeaderProps) {
  const navigate = useNavigate();

  // Quản lý trạng thái Theme (Light/Dark)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const defaultNavItems: NavItem[] = [
    {
      label: "home",
      children: [
        {
          label: "News",
          icon: <BookOpen className="w-3.5 h-3.5" />,
          onClick: () => navigate("/news"),
        },
        {
          label: "Teams",
          icon: <FileText className="w-3.5 h-3.5" />,
          onClick: () => navigate("/exams/mock"),
        },
      ],
      active: true,
      href: "/",
    },
    {
      label: "exams",
      children: [
        {
          label: "Exam Listing",
          icon: <BookOpen className="w-3.5 h-3.5" />,
          onClick: () => navigate("/test"),
        },
        {
          label: "Course Listing",
          icon: <FileText className="w-3.5 h-3.5" />,
          onClick: () => navigate("/exams/mock"),
        },
        {
          label: "Flashcard Listing",
          icon: <FileText className="w-3.5 h-3.5" />,
          onClick: () => navigate("/exams/mock"),
        },
      ],
    },
    {
      label: "rankings",
      children: [
        {
          label: "Global Leaderboard",
          icon: <Award className="w-3.5 h-3.5" />,
          onClick: () => navigate("/rankings/global"),
        },
        {
          label: "Monthly League",
          icon: <Award className="w-3.5 h-3.5" />,
          onClick: () => navigate("/rankings/monthly"),
        },
      ],
    },
    {
      label: "community",
      children: [
        {
          label: "Forums",
          icon: <Users className="w-3.5 h-3.5" />,
          onClick: () => navigate("/community/groups"),
        },
        {
          label: "Chat",
          icon: <MessageSquare className="w-3.5 h-3.5" />,
          onClick: () => navigate("/community/forum"),
        },
      ],
    },
    {
      label: "help",
      children: [
        {
          label: "FAQ & Docs",
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          onClick: () => navigate("/help/faq"),
        },
        {
          label: "Report",
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          onClick: () => navigate("/help/faq"),
        },
        {
          label: "Rules",
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          onClick: () => navigate("/help/faq"),
        },
      ],
    },
  ];

  const activeNavItems = navItems || defaultNavItems;

  const profileMenuItems: DropdownItem[] = [
    {
      label: "My Profile",
      icon: <User className="w-3.5 h-3.5" />,
      onClick: onProfileClick,
    },
    {
      label: "Settings",
      icon: <Settings className="w-3.5 h-3.5" />,
      onClick: onSettingsClick,
    },
    {
      label: "Logout",
      icon: <LogOut className="w-3.5 h-3.5" />,
      danger: true,
      divider: true,
      onClick: onLogout,
    },
  ];

  const languageMenuItems: DropdownItem[] = [
    {
      label: "English (US)",
      icon: <Languages className="w-3.5 h-3.5" />,
      onClick: () => onLanguageSelect?.("en"),
    },
    {
      label: "Español",
      icon: <Languages className="w-3.5 h-3.5" />,
      onClick: () => onLanguageSelect?.("es"),
    },
    {
      label: "日本語",
      icon: <Languages className="w-3.5 h-3.5" />,
      onClick: () => onLanguageSelect?.("ja"),
    },
  ];

  return (
    <header className="w-full bg-background-card border-b border-border text-foreground shadow-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left Side: Logo & Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="w-10 h-10 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-black text-base tracking-tighter shadow-sm hover:scale-105 transition-transform"
          >
            Eng
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold lowercase tracking-wide">
            {activeNavItems.map((item, index) => {
              const hasDropdown = item.children && item.children.length > 0;

              return hasDropdown ? (
                <Dropdown
                  key={index}
                  align="left"
                  width="w-44"
                  items={item.children!}
                  trigger={
                    <button
                      type="button"
                      className={`relative py-5 flex items-center space-x-1 transition-colors ${
                        item.active
                          ? "text-brand"
                          : "text-foreground-subtle hover:text-foreground"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-3 h-3 opacity-60" />
                      {item.active && (
                        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-brand rounded-full shadow-xs" />
                      )}
                    </button>
                  }
                />
              ) : (
                <button
                  key={index}
                  type="button"
                  onClick={() => item.href && navigate(item.href)}
                  className={`relative py-5 transition-colors cursor-pointer ${
                    item.active
                      ? "text-brand"
                      : "text-foreground-subtle hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {item.active && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-brand rounded-full shadow-xs" />
                  )}
                </button>
              );
            })}

            <button
              onClick={onSearchClick}
              className="text-foreground-subtle hover:text-foreground transition-colors p-1"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </nav>
        </div>

        {/* Right Side: Socials, Theme Toggle, Pill Badge, Profile */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3 text-foreground-subtle">
            <button className="hover:text-rose-500 transition-colors p-1">
              <Heart className="w-4 h-4 fill-current stroke-none" />
            </button>

            {/* Toggle Theme Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hover:text-foreground transition-colors p-1"
              aria-label="Toggle theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-foreground-subtle hover:-rotate-12 transition-transform" />
              )}
            </button>

            <Dropdown
              align="right"
              width="w-36"
              items={languageMenuItems}
              trigger={
                <button
                  type="button"
                  className="hover:text-foreground transition-colors p-1 flex items-center space-x-1"
                >
                  <Globe className="w-4 h-4" />
                </button>
              }
            />
          </div>

          <div className="flex items-center space-x-3 bg-background-hover border border-border/80 rounded-full px-3.5 py-1 text-xs font-bold text-foreground">
            <button className="flex items-center space-x-1.5 hover:text-brand transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-foreground-subtle fill-current" />
              <span>{chatCount}</span>
            </button>

            <span className="w-px h-3 bg-border" />

            <button className="flex items-center space-x-1.5 hover:text-brand transition-colors">
              <Bell className="w-3.5 h-3.5 text-foreground-subtle fill-current" />
              <span className="text-brand">{notificationCount}</span>
            </button>
          </div>

          <Dropdown
            align="right"
            width="w-48"
            items={profileMenuItems}
            trigger={
              <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-border hover:border-brand transition-all shadow-xs shrink-0 cursor-pointer">
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            }
          />
        </div>
      </div>
    </header>
  );
}
