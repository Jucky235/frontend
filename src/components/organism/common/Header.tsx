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
} from "lucide-react";
import Dropdown, {
  type DropdownItem,
} from "@/components/organism/common/Dropdown";

interface NavItem {
  label: string;
  href?: string;
  active?: boolean;
  children?: DropdownItem[]; // Sub-menu items for dropdown navigation
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

  // Default nav items using react-router-dom's navigate
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

  // Menu items for Profile Dropdown
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

  // Menu items for Language Dropdown
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
    <header className="w-full bg-white border-b border-neutral-200 text-neutral-800 shadow-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left Side: Logo & Navigation Links */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Link
            to="/"
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-base tracking-tighter shadow-sm hover:scale-105 transition-transform"
          >
            Eng
          </Link>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold lowercase tracking-wide">
            {activeNavItems.map((item, index) => {
              const hasDropdown = item.children && item.children.length > 0;

              return hasDropdown ? (
                /* Nav Item WITH Dropdown */
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
                          ? "text-[#5A67FF]"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="w-3 h-3 opacity-60" />
                      {item.active && (
                        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#5A67FF] rounded-full shadow-xs" />
                      )}
                    </button>
                  }
                />
              ) : (
                /* Nav Item WITHOUT Dropdown */
                <button
                  key={index}
                  type="button"
                  onClick={() => item.href && navigate(item.href)}
                  className={`relative py-5 transition-colors cursor-pointer ${
                    item.active
                      ? "text-[#5A67FF]"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {item.label}
                  {item.active && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#5A67FF] rounded-full shadow-xs" />
                  )}
                </button>
              );
            })}

            {/* Search Button */}
            <button
              onClick={onSearchClick}
              className="text-neutral-400 hover:text-neutral-700 transition-colors p-1"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </nav>
        </div>

        {/* Right Side: Socials, Pill Badge, Profile */}
        <div className="flex items-center space-x-4">
          {/* Utility / Social Icons */}
          <div className="hidden md:flex items-center space-x-3 text-neutral-400">
            <button className="hover:text-rose-500 transition-colors p-1">
              <Heart className="w-4 h-4 fill-current stroke-none" />
            </button>

            {/* Language Selector Dropdown */}
            <Dropdown
              align="right"
              width="w-36"
              items={languageMenuItems}
              trigger={
                <button
                  type="button"
                  className="hover:text-neutral-700 transition-colors p-1 flex items-center space-x-1"
                >
                  <Globe className="w-4 h-4" />
                </button>
              }
            />
          </div>

          {/* Chat & Notifications Pill Capsule */}
          <div className="flex items-center space-x-3 bg-neutral-100 border border-neutral-200/80 rounded-full px-3.5 py-1 text-xs font-bold text-neutral-700">
            <button className="flex items-center space-x-1.5 hover:text-[#5A67FF] transition-colors">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-400 fill-current" />
              <span>{chatCount}</span>
            </button>

            <span className="w-px h-3 bg-neutral-300" />

            <button className="flex items-center space-x-1.5 hover:text-[#5A67FF] transition-colors">
              <Bell className="w-3.5 h-3.5 text-neutral-400 fill-current" />
              <span className="text-[#5A67FF]">{notificationCount}</span>
            </button>
          </div>

          {/* User Profile Avatar Dropdown */}
          <Dropdown
            align="right"
            width="w-48"
            items={profileMenuItems}
            trigger={
              <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-100 hover:border-[#5A67FF] transition-all shadow-xs shrink-0 cursor-pointer">
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
