import { useState, useEffect, useRef, useMemo } from "react";
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
  Loader2,
  ArrowRight,
  Clock,
  Compass,
} from "lucide-react";
import Dropdown, {
  DropdownProvider,
  type DropdownItem,
} from "@/components/organism/common/Dropdown";
import { useGetUserProfileQuery } from "@/redux/user/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUserProfile } from "@/redux/user/userSlice";
import {
  selectSearchQuery,
  selectIsSearchModalOpen,
  selectRecentSearches,
  selectLastRecommendation,
  setSearchQuery,
  setSearchModalOpen,
  toggleSearchModal,
  setLastRecommendation,
  addRecentSearch,
  clearRecentSearches,
} from "@/redux/navigation/navigationSlice";
import { useSearchRouteMutation } from "@/redux/navigation/navigationApiSlice";

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
  onLogout?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLanguageSelect?: (lang: string) => void;
}

interface QuickRouteOption {
  title: string;
  description: string;
  path: string;
  category: string;
  icon: React.ReactNode;
}

const QUICK_ROUTES: QuickRouteOption[] = [
  {
    title: "News & Updates",
    description: "Read the latest announcements and educational news",
    path: "/news",
    category: "Home",
    icon: <BookOpen className="w-4 h-4 text-brand" />,
  },
  {
    title: "Teams",
    description: "Collaborate with your study groups and peers",
    path: "/teams",
    category: "Home",
    icon: <FileText className="w-4 h-4 text-brand" />,
  },
  {
    title: "Exam Listing",
    description: "Browse and take available English exams",
    path: "/test",
    category: "Exams",
    icon: <BookOpen className="w-4 h-4 text-brand" />,
  },
  {
    title: "Course Listing",
    description: "Explore mock exams and structured courses",
    path: "/exams/mock",
    category: "Exams",
    icon: <FileText className="w-4 h-4 text-brand" />,
  },
  {
    title: "Flashcard Listing",
    description: "Practice vocabulary with flashcard decks",
    path: "/flashcards-list",
    category: "Exams",
    icon: <FileText className="w-4 h-4 text-brand" />,
  },
  {
    title: "Global Leaderboard",
    description: "Check your rank against students worldwide",
    path: "/rankings/global",
    category: "Rankings",
    icon: <Award className="w-4 h-4 text-brand" />,
  },
  {
    title: "Monthly League",
    description: "Compete in this month's leaderboard league",
    path: "/rankings/monthly",
    category: "Rankings",
    icon: <Award className="w-4 h-4 text-brand" />,
  },
  {
    title: "Forums",
    description: "Discuss questions and share tips with the community",
    path: "/forum",
    category: "Community",
    icon: <Users className="w-4 h-4 text-brand" />,
  },
  {
    title: "Chat",
    description: "Chat live with other learners",
    path: "/chat",
    category: "Community",
    icon: <MessageSquare className="w-4 h-4 text-brand" />,
  },
  {
    title: "FAQ & Docs",
    description: "Find answers to frequently asked questions",
    path: "/faq",
    category: "Help",
    icon: <HelpCircle className="w-4 h-4 text-brand" />,
  },
];

function getInitials(name?: string): string {
  if (!name || !name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header({
  navItems,
  chatCount = 0,
  notificationCount = 13,
  onLogout,
  onProfileClick,
  onSettingsClick,
  onLanguageSelect,
}: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const profile = useSelector(selectUserProfile);
  const userId = profile?.id || profile?.user_id || "";
  const userName =
    profile?.name || profile?.full_name || profile?.username || "";

  const { isFetching: _isProfileLoading } = useGetUserProfileQuery();

  const searchQuery = useSelector(selectSearchQuery);
  const isSearchModalOpen = useSelector(selectIsSearchModalOpen);
  const recentSearches = useSelector(selectRecentSearches);
  const lastRecommendation = useSelector(selectLastRecommendation);

  const [searchRoute, { isLoading: isSearching }] = useSearchRouteMutation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchModalOpen]);

  const filteredQuickRoutes = useMemo(() => {
    if (!searchQuery.trim()) return QUICK_ROUTES;
    const q = searchQuery.toLowerCase();
    return QUICK_ROUTES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const handleRouteSelect = (path: string, title: string) => {
    dispatch(addRecentSearch(title));
    dispatch(setSearchModalOpen(false));
    navigate(path);
  };

  const handleAiSearchSubmit = async (queryText: string) => {
    if (!queryText.trim()) return;
    dispatch(addRecentSearch(queryText));
    try {
      const result = await searchRoute({ query: queryText }).unwrap();
      dispatch(setLastRecommendation(result));
    } catch (err) {
      console.error("Navigation Search Error:", err);
    }
  };

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
          onClick: () => navigate("/teams"),
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
          onClick: () => navigate("/flashcards-list"),
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
          onClick: () => navigate("/forum"),
        },
        {
          label: "Chat",
          icon: <MessageSquare className="w-3.5 h-3.5" />,
          onClick: () => navigate("/chat"),
        },
      ],
    },
    {
      label: "help",
      children: [
        {
          label: "FAQ & Docs",
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          onClick: () => navigate("/faq"),
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
      onClick: () => {
        if (!userId) {
          navigate("/login", { state: { from: "/profile" } });
        } else {
          onProfileClick ? onProfileClick() : navigate("/profile");
        }
      },
    },
    {
      label: "Settings",
      icon: <Settings className="w-3.5 h-3.5" />,
      onClick: onSettingsClick ?? (() => undefined),
    },
    {
      label: "Logout",
      icon: <LogOut className="w-3.5 h-3.5" />,
      danger: true,
      divider: true,
      onClick: () => {
        if (onLogout) {
          onLogout();
        }
        navigate("/login");
      },
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

  const userInitials = getInitials(userName);

  return (
    <DropdownProvider>
      <header className="w-full bg-background-card border-b border-border text-foreground shadow-xs sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
                onClick={() => dispatch(toggleSearchModal())}
                className="text-foreground-subtle hover:text-foreground transition-colors p-1 flex items-center space-x-1 bg-background-hover px-2 py-1 rounded-md border border-border"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-[10px] opacity-75 font-normal">
                  Quick Navigation...
                </span>
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleSearchModal())}
              className="lg:hidden text-foreground-subtle hover:text-foreground transition-colors p-1.5"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="hidden md:flex items-center space-x-3 text-foreground-subtle">
              <button className="hover:text-rose-500 transition-colors p-1">
                <Heart className="w-4 h-4 fill-current stroke-none" />
              </button>

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
                <div className="relative w-9 h-9 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-bold text-xs tracking-wider border-2 border-border hover:opacity-90 transition-all shadow-xs shrink-0 cursor-pointer select-none">
                  {userInitials}
                </div>
              }
            />
          </div>
        </div>
      </header>

      {/* Navigation Search & Options Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => dispatch(setSearchModalOpen(false))}
          />
          <div className="relative w-full max-w-xl bg-background-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10">
            <div className="p-4 border-b border-border flex items-center space-x-3 bg-background-hover/50">
              <Compass className="w-5 h-5 text-brand shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAiSearchSubmit(searchQuery);
                  }
                }}
                placeholder="Type to filter options or press Enter for AI search..."
                className="w-full bg-transparent border-none outline-none text-foreground text-sm placeholder:text-foreground-subtle"
              />
              {isSearching && (
                <Loader2 className="w-4 h-4 text-brand animate-spin shrink-0" />
              )}
            </div>

            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {recentSearches.length > 0 &&
                !searchQuery &&
                !lastRecommendation && (
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-foreground-subtle uppercase tracking-wider mb-2">
                      <span>Recent Selects</span>
                      <button
                        onClick={() => dispatch(clearRecentSearches())}
                        className="hover:text-foreground transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((item: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => dispatch(setSearchQuery(item))}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-background-hover text-xs text-foreground hover:bg-brand/10 hover:text-brand transition-colors"
                        >
                          <Clock className="w-3 h-3 opacity-60" />
                          <span>{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {lastRecommendation && (
                <div className="p-4 rounded-xl bg-brand/5 border border-brand/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand uppercase tracking-wider">
                      AI Navigation Match
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand/10 text-brand font-bold">
                      {Math.round(lastRecommendation.confidence * 100)}% Match
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {lastRecommendation.reasoning}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-brand/10">
                    <span className="text-xs text-foreground-subtle">
                      {lastRecommendation.suggestedAction}
                    </span>
                    {lastRecommendation.matchedPath && (
                      <button
                        onClick={() => {
                          navigate(lastRecommendation.matchedPath!);
                          dispatch(setSearchModalOpen(false));
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-brand text-brand-foreground text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        <span>Go Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div>
                <div className="text-[11px] font-bold text-foreground-subtle uppercase tracking-wider mb-2">
                  {searchQuery
                    ? "Matching Options"
                    : "Quick Navigation Options"}
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {filteredQuickRoutes.length > 0 ? (
                    filteredQuickRoutes.map((route, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          handleRouteSelect(route.path, route.title)
                        }
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-background-hover/60 hover:bg-brand/10 border border-border/50 hover:border-brand/30 transition-all text-left group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-background-card border border-border group-hover:border-brand/30 transition-colors">
                            {route.icon}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground group-hover:text-brand transition-colors">
                              {route.title}
                            </div>
                            <div className="text-[11px] text-foreground-subtle line-clamp-1">
                              {route.description}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-background-card border border-border text-foreground-subtle uppercase">
                          {route.category}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-foreground-subtle">
                      No matching option found. Press Enter to search with AI.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-background-hover border-t border-border flex items-center justify-between text-[11px] text-foreground-subtle">
              <span>Click any option to go instantly</span>
              <button
                onClick={() => dispatch(setSearchModalOpen(false))}
                className="hover:text-foreground transition-colors font-bold"
              >
                Esc to close
              </button>
            </div>
          </div>
        </div>
      )}
    </DropdownProvider>
  );
}
