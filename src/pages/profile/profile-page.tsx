import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Activity,
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  Brain,
  Camera,
  Check,
  ChevronRight,
  Flame,
  Gamepad2,
  Headphones,
  Home,
  Languages,
  LogOut,
  Map,
  MessageSquare,
  Mic,
  Moon,
  PenLine,
  Settings2,
  Share2,
  Sun,
  Target,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { logOut } from "@/redux/auth/authSlice";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/redux/user/userApiSlice";
import {
  selectUserId,
  selectUserProfile,
  setEditingProfile,
} from "@/redux/user/userSlice";
import {
  useGetUserRankingQuery,
  useGetUserSkillSummaryQuery,
} from "@/redux/analytics/analyticsApiSlice";
import ChangePasswordModal from "@/components/organism/profile/modals/ChangePasswordModal";

type HistoryEntry = {
  id?: string;
  examId?: string;
  examName?: string;
  score?: number | string;
  submittedAt?: string;
  createdAt?: string;
};

type NavigationItem = {
  label: string;
  icon: LucideIcon;
  to: string;
  active?: boolean;
  badge?: string;
};

const navigationGroups: { label: string; items: NavigationItem[] }[] = [
  {
    label: "Overview",
    items: [{ label: "Home", icon: Home, to: "/profile", active: true }, { label: "Progress", icon: Activity, to: "#progress" }],
  },
  {
    label: "Practice",
    items: [
      { label: "Dictation", icon: Headphones, to: "/test" },
      { label: "Shadowing", icon: Mic, to: "/chat" },
      { label: "Speaking", icon: MessageSquare, to: "/chat", badge: "AI" },
      { label: "Writing", icon: PenLine, to: "/test", badge: "AI" },
      { label: "Vocabulary", icon: BookOpen, to: "/flashcards-list" },
      { label: "Word games", icon: Gamepad2, to: "/flashcard/hub", badge: "NEW" },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "My exams", icon: BookMarked, to: "/test" },
      { label: "Learning roadmap", icon: Map, to: "/roadmap" },
      { label: "Community", icon: Share2, to: "/forum" },
    ],
  },
];

function getDateKey(value?: string | Date) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function CardHeading({ title, action, to }: { title: string; action?: string; to?: string }) {
  return <div className="mb-4 flex items-center justify-between gap-3">
    <h2 className="text-sm font-bold text-foreground sm:text-base">{title}</h2>
    {action && to && <Link to={to} className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-foreground-subtle transition hover:text-brand">{action}<ArrowRight className="h-3.5 w-3.5" /></Link>}
  </div>;
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const profile = useSelector(selectUserProfile);
  const userId = useSelector(selectUserId);
  const { isFetching: isProfileLoading } = useGetUserProfileQuery();
  const { data: skillSummary = [], isLoading: isSkillsLoading } = useGetUserSkillSummaryQuery(userId, { skip: !userId });
  const { data: rankingResponse = [], isLoading: isRankingLoading } = useGetUserRankingQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateUserProfileMutation();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [isPromoVisible, setIsPromoVisible] = React.useState(true);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = React.useState({ fullName: "", avatar: "" });

  React.useEffect(() => {
    if (!profile) return;
    setFormData({
      fullName: String(profile?.userInfo?.name || profile?.name || ""),
      avatar: String(profile?.userInfo?.avatarUrl || profile?.avatarUrl || ""),
    });
  }, [profile]);

  const userName = String(profile?.userInfo?.name || profile?.name || "Learner");
  const userEmail = String(profile?.userInfo?.email || profile?.email || "");
  const userAvatar = formData.avatar || String(profile?.userInfo?.avatarUrl || "");
  const history: HistoryEntry[] = Array.isArray(profile?.Examhistory) ? profile.Examhistory : [];
  const completedExams = history.length;
  const averageScore = completedExams
    ? Math.round(history.reduce((sum, entry) => sum + Number(entry.score || 0), 0) / completedExams)
    : 0;
  const practicedQuestions = skillSummary.reduce((sum, skill: any) => sum + Number(skill.total_questions || 0), 0);
  const skillCount = skillSummary.length;

  const weekDays = React.useMemo(() => {
    const today = new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - mondayOffset);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index);
      const count = history.filter((entry) => getDateKey(entry.submittedAt || entry.createdAt) === getDateKey(date)).length;
      return { date, count };
    });
  }, [history]);
  const activeDays = weekDays.filter((day) => day.count > 0).length;
  const recentHistory = [...history].slice(-7);
  const chartMax = Math.max(1, ...recentHistory.map((entry) => Number(entry.score || 0)));
  const ranking = React.useMemo(() => {
    const raw = rankingResponse as any;
    const rows = Array.isArray(raw) ? raw : raw?.data || raw?.rankings || [];
    return (Array.isArray(rows) ? rows : []).slice(0, 5).map((item: any, index: number) => ({
      id: String(item.user_id || item.userId || item.id || index),
      name: String(item.name || item.userInfo?.name || "Learner"),
      score: Number(item.social_score ?? item.score ?? 0),
      isCurrentUser: String(item.user_id || item.userId || item.id || "") === userId,
    }));
  }, [rankingResponse, userId]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "avatar_preset");
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/mxxbk0jh/image/upload", { method: "POST", body: uploadData });
      const result = await response.json();
      if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Avatar upload failed");
      setFormData((previous) => ({ ...previous, avatar: result.secure_url }));
      dispatch(setEditingProfile(true));
    } catch (error) {
      console.error("Avatar upload failed:", error);
      window.alert("Could not upload your profile photo. Please try again.");
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updateProfile({ name: formData.fullName, avatar: formData.avatar }).unwrap();
    } catch (error: any) {
      window.alert(error?.data?.error || "Could not update your profile.");
    }
  };

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  const isProfileUnchanged =
    userName === formData.fullName &&
    String(profile?.userInfo?.avatarUrl || profile?.avatarUrl || "") === formData.avatar;

  if (isProfileLoading && !profile) {
    return <div className="grid min-h-screen place-items-center bg-background text-sm font-semibold text-foreground-subtle">Loading your learning dashboard…</div>;
  }

  return <div className="min-h-screen bg-background text-foreground">
    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-background-card px-4 py-5 lg:flex">
      <Link to="/" className="mb-8 flex items-center gap-3 px-2" aria-label="S English home">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet-600 text-lg font-black text-white">S</span>
        <span className="text-sm font-black tracking-[0.12em]">S ENGLISH</span>
      </Link>
      <nav className="flex-1 space-y-6 overflow-y-auto">
        {navigationGroups.map((group) => <div key={group.label}>
          <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.16em] text-foreground-subtle">{group.label}</p>
          <div className="space-y-1">{group.items.map(({ label, icon: Icon, to, ...item }) => {
            const className = `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${item.active ? "bg-background-hover text-foreground" : "text-foreground-muted hover:bg-background-hover hover:text-foreground"}`;
            const contents = <><Icon className="h-4 w-4 shrink-0 text-foreground-subtle"/><span className="flex-1">{label}</span>{item.badge && <span className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-1.5 py-0.5 text-[8px] font-bold text-white">{item.badge}</span>}</>;
            return to.startsWith("#") ? <a key={label} href={to} className={className}>{contents}</a> : <Link key={label} to={to} className={className}>{contents}</Link>;
          })}</div>
        </div>)}
      </nav>
      <div className="space-y-3 border-t border-border pt-4">
        <Link to="/faq" className="flex items-center gap-2 rounded-lg border border-border bg-background-hover px-3 py-2.5 text-[10px] font-semibold text-foreground hover:border-brand/40"><Award className="h-4 w-4 text-brand"/>Plans & help</Link>
        <div className="flex items-center gap-2 rounded-xl border border-border p-2">
          <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Change profile photo" className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-brand/10 text-xs font-bold text-brand">
            {userAvatar ? <img src={userAvatar} alt="" className="h-full w-full object-cover"/> : userName.slice(0, 1).toUpperCase()}
          </button>
          <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-bold">{userName}</p><p className="truncate text-[9px] text-foreground-subtle">{userEmail || "Free account"}</p></div>
          <button type="button" onClick={toggleTheme} aria-label="Toggle color theme" title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} className="rounded p-1.5 text-foreground-subtle hover:bg-background-hover hover:text-brand">{theme === "dark" ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}</button>
          <button type="button" onClick={handleLogout} aria-label="Log out" className="rounded p-1.5 text-foreground-subtle hover:bg-background-hover hover:text-brand"><LogOut className="h-4 w-4"/></button>
        </div>
      </div>
    </aside>

    <div className="lg:pl-60">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-black tracking-[0.12em] lg:hidden"><span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-violet-600 text-white">S</span><span className="text-xs">S ENGLISH</span></Link>
          <div className="hidden text-xs text-foreground-subtle lg:block">Your learning space</div>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className="rounded-lg p-2 text-foreground-subtle hover:bg-background-hover hover:text-brand lg:hidden" aria-label="Toggle color theme">{theme === "dark" ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}</button>
            <Link to="/chat" className="hidden items-center gap-2 rounded-full border border-border bg-background-card px-3 py-1.5 text-[11px] font-semibold text-foreground-muted hover:border-brand/40 sm:flex"><MessageSquare className="h-3.5 w-3.5 text-brand"/>Community</Link>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-border bg-background-hover text-xs font-bold text-brand" aria-label="Change profile photo">
              {userAvatar ? <img src={userAvatar} alt="" className="h-full w-full object-cover"/> : userName.slice(0, 1).toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-7 px-4 py-6 sm:px-6 sm:py-8">
        {isPromoVisible && <div className="flex items-center gap-3 rounded-xl border border-border bg-background-card p-3 shadow-sm sm:px-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand"><Languages className="h-4 w-4"/></span>
          <div className="min-w-0 flex-1"><p className="text-xs font-bold">Practice anywhere with S English</p><p className="mt-0.5 text-[10px] text-foreground-subtle">Your learning progress stays together across devices.</p></div>
          <Link to="/test" className="hidden rounded-lg border border-border px-3 py-2 text-[10px] font-semibold hover:bg-background-hover sm:block">Start a lesson</Link>
          <button type="button" onClick={() => setIsPromoVisible(false)} aria-label="Dismiss message" className="rounded p-1 text-foreground-subtle hover:bg-background-hover"><X className="h-4 w-4"/></button>
        </div>}

        <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div><h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Welcome back, {userName}! <span aria-hidden="true">👋</span></h1><p className="mt-1 text-xs text-foreground-subtle">A little practice today moves your English forward.</p></div>
          <div className="flex flex-wrap gap-2"><Link to="/test" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-700"><Headphones className="h-3.5 w-3.5"/>Start practicing</Link><Link to="/forum" className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-[11px] font-semibold text-background shadow-sm transition hover:opacity-90"><MessageSquare className="h-3.5 w-3.5"/>Share feedback</Link></div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Learning statistics">
          {[
            { label: "Exams completed", value: completedExams, note: "Across your account", icon: BookOpen, tone: "text-orange-500 bg-orange-500/10" },
            { label: "Average exam score", value: averageScore, note: completedExams ? "From completed exams" : "Complete an exam to start", icon: Target, tone: "text-blue-500 bg-blue-500/10" },
            { label: "Questions practiced", value: practicedQuestions, note: "Across tracked skills", icon: BookMarked, tone: "text-emerald-600 bg-emerald-500/10" },
            { label: "Skills tracked", value: skillCount, note: "Your learning areas", icon: Award, tone: "text-violet-500 bg-violet-500/10" },
          ].map(({ label, value, note, icon: Icon, tone }) => <article key={label} className="flex items-center gap-3 rounded-xl border border-border bg-background-card p-4 shadow-sm">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}><Icon className="h-5 w-5"/></span>
            <div className="min-w-0"><p className="text-lg font-extrabold leading-5">{value}</p><p className="mt-1 text-[10px] font-semibold text-foreground-muted">{label}</p><p className="text-[9px] text-foreground-subtle">{note}</p></div>
          </article>)}
        </section>

        <section id="progress" className="grid items-start gap-4 xl:grid-cols-[1.08fr_.92fr]">
          <div className="space-y-4">
            <Link to="/flashcards-list" className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4 transition hover:border-emerald-500/50">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600"><Brain className="h-4 w-4"/></span><span className="min-w-0 flex-1"><b className="block text-xs">Ready for a quick review?</b><span className="mt-0.5 block text-[10px] text-foreground-subtle">Review vocabulary and keep useful words fresh.</span></span><span className="hidden rounded-md border border-border bg-background-card px-3 py-2 text-[10px] font-semibold sm:block">Review words</span><ChevronRight className="h-4 w-4 text-foreground-subtle sm:hidden"/>
            </Link>

            <section className="rounded-xl border border-border bg-background-card p-4 shadow-sm sm:p-5">
              <CardHeading title="Your practice activity" action="See roadmap" to="/roadmap"/>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] text-foreground-subtle"><span className="rounded-md bg-background-hover px-2.5 py-1.5 font-semibold text-foreground-muted">Exam results</span><span>Recent completed exams</span></div>
              {recentHistory.length ? <div className="relative h-48 w-full">
                <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-foreground-subtle"><div className="border-b border-dashed border-border pb-1">100%</div><div className="border-b border-dashed border-border pb-1">75%</div><div className="border-b border-dashed border-border pb-1">50%</div><div className="border-b border-dashed border-border pb-1">25%</div><div>0%</div></div>
                <svg viewBox="0 0 600 170" preserveAspectRatio="none" className="absolute inset-x-8 bottom-5 top-2 h-[calc(100%-28px)] w-[calc(100%-40px)] overflow-visible" role="img" aria-label="Recent exam scores">
                  <defs><linearGradient id="profile-score-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--brand-primary)" stopOpacity=".22"/><stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0"/></linearGradient></defs>
                  {(() => {
                    const points = recentHistory.map((entry, index) => {
                      const x = recentHistory.length === 1 ? 300 : (index / (recentHistory.length - 1)) * 600;
                      const score = Math.max(0, Number(entry.score || 0));
                      return { x, y: 160 - (score / chartMax) * 145, score };
                    });
                    const path = points.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
                    return <><path d={`${path} L600,170 L0,170 Z`} fill="url(#profile-score-fill)"/><path d={path} fill="none" stroke="var(--brand-primary)" strokeWidth="3" vectorEffect="non-scaling-stroke"/>{points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="4" fill="var(--brand-primary)" stroke="var(--bg-card)" strokeWidth="2"><title>{point.score}%</title></circle>)}</>;
                  })()}
                </svg>
                <div className="absolute inset-x-8 bottom-0 flex justify-between text-[9px] text-foreground-subtle">{recentHistory.map((entry, index) => <span key={entry.id || index} className="max-w-12 truncate">{entry.submittedAt ? new Date(entry.submittedAt).toLocaleDateString(undefined, { day: "numeric", month: "short" }) : `Exam ${index + 1}`}</span>)}</div>
              </div> : <div className="grid h-48 place-items-center rounded-lg bg-background/60 text-center"><div><Activity className="mx-auto h-7 w-7 text-foreground-subtle/60"/><p className="mt-2 text-xs font-semibold">Your activity will appear here</p><p className="mt-1 text-[10px] text-foreground-subtle">Complete an exam to start tracking progress.</p><Link to="/test" className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-brand">Browse exams <ArrowRight className="h-3 w-3"/></Link></div></div>}
            </section>

            <section className="rounded-xl border border-border bg-background-card p-4 shadow-sm sm:p-5">
              <CardHeading title="Skill progress" action="Open roadmap" to="/roadmap"/>
              {isSkillsLoading ? <p className="py-6 text-center text-xs text-foreground-subtle">Loading your skill data…</p> : skillSummary.length ? <div className="space-y-4">{skillSummary.slice(0, 5).map((skill: any) => {
                const accuracy = Math.max(0, Math.min(100, Number(skill.accuracy || 0)));
                return <div key={skill.skill_id || skill.skill_name}><div className="mb-1.5 flex justify-between gap-3 text-[11px]"><span className="truncate font-semibold">{skill.skill_name}</span><span className="shrink-0 text-foreground-subtle">{accuracy}% · {skill.total_questions || 0} questions</span></div><div className="h-2 overflow-hidden rounded-full bg-background-hover"><div className="h-full rounded-full bg-gradient-to-r from-brand to-violet-500 transition-all" style={{ width: `${accuracy}%` }}/></div></div>;
              })}</div> : <p className="py-6 text-center text-xs text-foreground-subtle">Practice a few questions to see your skill progress.</p>}
            </section>
          </div>

          <div className="space-y-4">
            <section className="rounded-xl border border-border bg-background-card p-4 shadow-sm sm:p-5">
              <CardHeading title="This week"/>
              <div className="flex items-center gap-2">{weekDays.map((day, index) => <div key={index} className="flex min-w-0 flex-1 flex-col items-center gap-2"><span className={`grid h-9 w-9 place-items-center rounded-full text-[10px] font-semibold ${day.count ? "bg-brand/10 text-brand" : "bg-background-hover text-foreground-subtle"}`} title={`${day.count} completed ${day.count === 1 ? "exam" : "exams"}`}>{day.date.toLocaleDateString(undefined, { weekday: "narrow" })}</span><span className="text-[9px] text-foreground-subtle">{day.count ? `${day.count} done` : day.date.toLocaleDateString(undefined, { weekday: "short" })}</span></div>)}</div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-background-hover/70 px-3 py-2.5"><div className="flex items-center gap-2"><Flame className="h-4 w-4 text-orange-500"/><span className="text-[11px] font-semibold">Practice days</span></div><span className="text-xs font-extrabold">{activeDays} / 7</span></div>
            </section>

            <section className="rounded-xl border border-border bg-background-card p-4 shadow-sm sm:p-5">
              <CardHeading title="Community leaderboard" action="View all" to="/ranking"/>
              <div className="mb-3 flex gap-2"><span className="rounded-md bg-foreground px-2.5 py-1 text-[9px] font-semibold text-background">Community score</span><span className="rounded-md bg-background-hover px-2.5 py-1 text-[9px] text-foreground-subtle">All time</span></div>
              {isRankingLoading ? <p className="py-5 text-center text-xs text-foreground-subtle">Loading leaderboard…</p> : ranking.length ? <div className="space-y-1.5">{ranking.slice(0, 4).map((person: any, index: number) => <div key={person.id} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 ${person.isCurrentUser ? "border border-brand/20 bg-brand/[0.04]" : ""}`}><span className="w-5 text-center text-[10px] font-bold text-foreground-subtle">{index + 1}</span><span className={`grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold ${person.isCurrentUser ? "bg-brand text-white" : "bg-background-hover text-foreground-muted"}`}>{person.name.slice(0, 1).toUpperCase()}</span><span className="min-w-0 flex-1 truncate text-[11px] font-semibold">{person.isCurrentUser ? "You" : person.name}</span><span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-600">{person.score.toLocaleString()} XP</span></div>)}</div> : <div className="py-5 text-center text-xs text-foreground-subtle">No leaderboard entries yet.</div>}
            </section>

            <section className="rounded-xl border border-border bg-background-card p-4 shadow-sm sm:p-5">
              <CardHeading title="Pick up where you left off" action="Browse exams" to="/test"/>
              {history.length ? <div className="flex items-center gap-3 rounded-lg bg-background-hover/70 p-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand"><BookOpen className="h-4 w-4"/></span><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-bold">{history[history.length - 1].examName || `Exam ${history[history.length - 1].examId || "practice"}`}</p><p className="mt-0.5 text-[9px] text-foreground-subtle">Last score: {Number(history[history.length - 1].score || 0)}</p></div><ChevronRight className="h-4 w-4 text-foreground-subtle"/></div> : <Link to="/test" className="flex items-center gap-3 rounded-lg bg-background-hover/70 p-3 hover:bg-brand/5"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand"><BookOpen className="h-4 w-4"/></span><span className="min-w-0 flex-1"><b className="block text-[11px]">Start your first exam</b><span className="text-[9px] text-foreground-subtle">Find a practice session that suits you.</span></span><ChevronRight className="h-4 w-4"/></Link>}
            </section>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background-card p-4 shadow-sm sm:p-5"><CardHeading title="Build your vocabulary" action="Open flashcards" to="/flashcards-list"/><p className="max-w-md text-xs leading-5 text-foreground-subtle">Save useful words and review them in short sessions so they stay ready when you need them.</p><div className="mt-4 flex gap-2"><Link to="/dictionary" className="rounded-lg bg-brand px-3 py-2 text-[10px] font-bold text-white hover:bg-brand-hover">Look up a word</Link><Link to="/flashcards-list" className="rounded-lg border border-border px-3 py-2 text-[10px] font-semibold hover:bg-background-hover">Review flashcards</Link></div></div>
          <div className="rounded-xl border border-border bg-background-card p-4 shadow-sm sm:p-5"><CardHeading title="Practice with AI" action="Open chat" to="/chat"/><p className="max-w-md text-xs leading-5 text-foreground-subtle">Try a conversation, ask for an explanation, or get help choosing what to practice next.</p><div className="mt-4 flex flex-wrap gap-2"><Link to="/chat" className="inline-flex items-center gap-2 rounded-lg bg-background-hover px-3 py-2 text-[10px] font-semibold hover:bg-brand/10 hover:text-brand"><MessageSquare className="h-3.5 w-3.5"/>Start a conversation</Link><Link to="/roadmap" className="inline-flex items-center gap-2 rounded-lg bg-background-hover px-3 py-2 text-[10px] font-semibold hover:bg-brand/10 hover:text-brand"><Map className="h-3.5 w-3.5"/>View your roadmap</Link></div></div>
        </section>

        <section id="account-settings" className="rounded-xl border border-border bg-background-card p-4 shadow-sm sm:p-5">
          <CardHeading title="Account settings"/>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-3"><button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploadingAvatar} className="grid h-14 w-14 place-items-center overflow-hidden rounded-full border border-border bg-brand/10 text-lg font-bold text-brand" aria-label="Upload profile photo">{userAvatar ? <img src={userAvatar} alt="Profile" className="h-full w-full object-cover"/> : userName.slice(0, 1).toUpperCase()}</button><span className="text-[10px] text-foreground-subtle">{isUploadingAvatar ? "Uploading photo…" : "Choose a profile photo"}</span></div>
              <div className="grid gap-3 sm:grid-cols-2"><label className="space-y-1.5 text-[10px] font-semibold text-foreground-muted">Name<input value={formData.fullName} onChange={(event) => setFormData((previous) => ({ ...previous, fullName: event.target.value }))} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-foreground outline-none focus:border-brand" required/></label><label className="space-y-1.5 text-[10px] font-semibold text-foreground-muted">Email<input value={userEmail} disabled className="mt-1 block w-full rounded-lg border border-border bg-background-hover px-3 py-2.5 text-xs text-foreground-subtle"/></label></div>
              <button type="submit" disabled={isSaving || isProfileUnchanged || isUploadingAvatar} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"><Check className="h-3.5 w-3.5"/>{isSaving ? "Saving…" : "Save profile"}</button>
            </form>
            <div className="flex flex-col items-start gap-2 border-t border-border pt-4 lg:min-w-48 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0"><button type="button" onClick={() => setIsPasswordModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-[10px] font-semibold hover:bg-background-hover"><Settings2 className="h-3.5 w-3.5"/>Change password</button><button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-[10px] font-semibold text-rose-600 hover:bg-rose-500/10"><LogOut className="h-3.5 w-3.5"/>Log out</button></div>
          </div>
        </section>
      </main>
    </div>

    <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
  </div>;
}
