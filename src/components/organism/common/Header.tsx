import { useEffect, useRef, useMemo, useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import Dropdown, {
  DropdownProvider,
  type DropdownItem,
} from "@/components/organism/common/Dropdown";
import { useGetUserProfileQuery } from "@/redux/user/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import { selectUserId, selectUserProfile } from "@/redux/user/userSlice";
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
import i18n from "@/lib/i18n";

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
    title: "Tin tức & cập nhật",
    description: "Đọc thông báo và tin tức giáo dục mới nhất",
    path: "/news",
    category: "Trang chủ",
    icon: <BookOpen className="w-4 h-4 text-brand" />,
  },
  {
    title: "Nhóm học tập",
    description: "Cùng học và trao đổi với bạn bè",
    path: "/teams",
    category: "Trang chủ",
    icon: <FileText className="w-4 h-4 text-brand" />,
  },
  {
    title: "Danh sách bài thi",
    description: "Khám phá và làm các bài thi tiếng Anh",
    path: "/test",
    category: "Bài thi",
    icon: <BookOpen className="w-4 h-4 text-brand" />,
  },
  {
    title: "Danh sách khóa học",
    description: "Khám phá đề thi thử và khóa học có lộ trình",
    path: "/exams/mock",
    category: "Bài thi",
    icon: <FileText className="w-4 h-4 text-brand" />,
  },
  {
    title: "Danh sách thẻ ghi nhớ",
    description: "Luyện từ vựng với các bộ thẻ ghi nhớ",
    path: "/flashcards-list",
    category: "Bài thi",
    icon: <FileText className="w-4 h-4 text-brand" />,
  },
  {
    title: "Bảng xếp hạng toàn cầu",
    description: "Xem thứ hạng của bạn cùng học viên khắp thế giới",
    path: "/rankings/global",
    category: "Xếp hạng",
    icon: <Award className="w-4 h-4 text-brand" />,
  },
  {
    title: "Giải đấu tháng",
    description: "Tham gia giải đấu trên bảng xếp hạng tháng này",
    path: "/rankings/monthly",
    category: "Xếp hạng",
    icon: <Award className="w-4 h-4 text-brand" />,
  },
  {
    title: "Diễn đàn",
    description: "Thảo luận và chia sẻ mẹo học cùng cộng đồng",
    path: "/forum",
    category: "Cộng đồng",
    icon: <Users className="w-4 h-4 text-brand" />,
  },
  {
    title: "Trò chuyện",
    description: "Trò chuyện trực tiếp với học viên khác",
    path: "/chat",
    category: "Cộng đồng",
    icon: <MessageSquare className="w-4 h-4 text-brand" />,
  },
  {
    title: "Câu hỏi thường gặp",
    description: "Tìm câu trả lời cho những thắc mắc phổ biến",
    path: "/faq",
    category: "Trợ giúp",
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
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const profile = useSelector(selectUserProfile);
  const userId = useSelector(selectUserId);
  const userName =
    profile?.userInfo?.name ||
    profile?.userInfo?.full_name ||
    profile?.userInfo?.username ||
    "";
  const userAvatarUrl = profile?.userInfo?.avatarUrl;

  const { isFetching: _isProfileLoading } = useGetUserProfileQuery();

  const searchQuery = useSelector(selectSearchQuery);
  const isSearchModalOpen = useSelector(selectIsSearchModalOpen);
  const recentSearches = useSelector(selectRecentSearches);
  const lastRecommendation = useSelector(selectLastRecommendation);

  const [searchRoute, { isLoading: isSearching }] = useSearchRouteMutation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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

  const defaultNavItems: NavItem[] = [
    {
      label: "Trang chủ",
      children: [
        {
          label: "Tin tức",
          icon: <BookOpen className="w-3.5 h-3.5" />,
          onClick: () => navigate("/news"),
        },
        {
          label: "Nhóm học tập",
          icon: <FileText className="w-3.5 h-3.5" />,
          onClick: () => navigate("/teams"),
        },
      ],
      active: true,
      href: "/",
    },
    {
      label: "Bài thi",
      children: [
        {
          label: "Danh sách bài thi",
          icon: <BookOpen className="w-3.5 h-3.5" />,
          onClick: () => navigate("/test"),
        },
        {
          label: "Danh sách khóa học",
          icon: <FileText className="w-3.5 h-3.5" />,
          onClick: () => navigate("/exams/mock"),
        },
        {
          label: "Danh sách thẻ ghi nhớ",
          icon: <FileText className="w-3.5 h-3.5" />,
          onClick: () => navigate("/flashcards-list"),
        },
      ],
    },
    {
      label: "Xếp hạng",
      children: [
        {
          label: "Bảng xếp hạng toàn cầu",
          icon: <Award className="w-3.5 h-3.5" />,
          onClick: () => navigate("/rankings/global"),
        },
        {
          label: "Giải đấu tháng",
          icon: <Award className="w-3.5 h-3.5" />,
          onClick: () => navigate("/rankings/monthly"),
        },
      ],
    },
    {
      label: "Cộng đồng",
      children: [
        {
          label: "Diễn đàn",
          icon: <Users className="w-3.5 h-3.5" />,
          onClick: () => navigate("/forum"),
        },
        {
          label: "Trò chuyện",
          icon: <MessageSquare className="w-3.5 h-3.5" />,
          onClick: () => navigate("/chat"),
        },
      ],
    },
    {
      label: "Trợ giúp",
      children: [
        {
          label: "Câu hỏi thường gặp",
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          onClick: () => navigate("/faq"),
        },
        {
          label: "Báo cáo",
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          onClick: () => navigate("/help/faq"),
        },
        {
          label: "Quy định",
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          onClick: () => navigate("/help/faq"),
        },
      ],
    },
  ];

  const activeNavItems = navItems || defaultNavItems;

  const profileMenuItems: DropdownItem[] = [
    {
      label: "Hồ sơ của tôi",
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
      label: "Cài đặt",
      icon: <Settings className="w-3.5 h-3.5" />,
      onClick: onSettingsClick ?? (() => undefined),
    },
    {
      label: "Đăng xuất",
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
      label: "Tiếng Việt",
      icon: <Languages className="w-3.5 h-3.5" />,
      onClick: () => { i18n.changeLanguage("vi"); onLanguageSelect?.("vi"); },
    },
  ];

  const userInitials = getInitials(userName);

  return (
    <DropdownProvider>
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background-card/95 text-foreground shadow-sm shadow-black/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              aria-label="Trang chủ S English"
              className="group flex items-center gap-2.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 text-lg font-black tracking-tight text-white shadow-md shadow-pink-950/25 transition-transform group-hover:scale-105">
                S
              </span>
              <span className="hidden text-sm font-extrabold tracking-tight text-foreground sm:inline">
                S <span className="text-brand">English</span>
              </span>
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
                aria-label="Tìm kiếm"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-[10px] opacity-75 font-normal">
                  Điều hướng nhanh...
                </span>
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              type="button"
              className="lg:hidden rounded-lg p-2 text-foreground-subtle hover:bg-background-hover hover:text-foreground"
              aria-label={isMobileNavOpen ? "Đóng điều hướng" : "Mở điều hướng"}
              aria-expanded={isMobileNavOpen}
              onClick={() => setIsMobileNavOpen((open) => !open)}
            >
              {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button
              onClick={() => dispatch(toggleSearchModal())}
              className="lg:hidden text-foreground-subtle hover:text-foreground transition-colors p-1.5"
              aria-label="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 text-foreground-subtle transition-colors hover:text-brand md:hidden"
              aria-label="Đổi giao diện"
              title={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="hidden md:flex items-center space-x-3 text-foreground-subtle">
              <button className="p-1 transition-colors hover:text-brand">
                <Heart className="w-4 h-4 fill-current stroke-none" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="hover:text-foreground transition-colors p-1"
                aria-label="Đổi giao diện"
                title={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
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

            <div className="hidden sm:flex items-center space-x-3 bg-background-hover border border-border/80 rounded-full px-3.5 py-1 text-xs font-bold text-foreground">
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

            {/* User Profile Trigger with Cloudinary Avatar support */}
            <Dropdown
              align="right"
              width="w-48"
              items={profileMenuItems}
              trigger={
                <div className="relative w-9 h-9 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-bold text-xs tracking-wider border-2 border-border hover:opacity-90 transition-all shadow-xs shrink-0 cursor-pointer select-none overflow-hidden">
                  {userAvatarUrl ? (
                    <img
                      src={userAvatarUrl}
                      alt={userName || "Avatar"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userInitials
                  )}
                </div>
              }
            />
          </div>
        </div>
        {isMobileNavOpen && (
          <nav className="lg:hidden border-t border-border bg-background-card px-4 py-3 shadow-lg">
            <div className="mx-auto max-w-7xl space-y-1">
              {activeNavItems.map((item) => (
                <div key={item.label} className="rounded-lg px-3 py-2">
                  {item.href ? (
                    <Link to={item.href} onClick={() => setIsMobileNavOpen(false)} className="block text-sm font-bold text-foreground">{item.label}</Link>
                  ) : (
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-foreground-subtle">{item.label}</p>
                  )}
                  {item.children?.map((child) => (
                    <button key={child.label} type="button" onClick={() => { child.onClick(); setIsMobileNavOpen(false); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-foreground hover:bg-background-hover">
                      {child.icon}<span>{child.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </nav>
        )}
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
                placeholder="Nhập để lọc hoặc nhấn Enter để tìm kiếm bằng AI..."
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
                      <span>Lựa chọn gần đây</span>
                      <button
                        onClick={() => dispatch(clearRecentSearches())}
                        className="hover:text-foreground transition-colors"
                      >
                        Xóa
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
                      Gợi ý điều hướng AI
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand/10 text-brand font-bold">
                      {Math.round(lastRecommendation.confidence * 100)}% khớp
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
                        <span>Đi ngay</span>
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
                      Không tìm thấy lựa chọn phù hợp. Nhấn Enter để tìm bằng AI.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-background-hover border-t border-border flex items-center justify-between text-[11px] text-foreground-subtle">
              <span>Chọn mục bất kỳ để mở ngay</span>
              <button
                onClick={() => dispatch(setSearchModalOpen(false))}
                className="hover:text-foreground transition-colors font-bold"
              >
                Nhấn Esc để đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </DropdownProvider>
  );
}
