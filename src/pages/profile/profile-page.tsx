import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Mail,
  Camera,
  Save,
  ArrowLeft,
  Award,
  BookOpen,
  Clock,
  Shield,
  KeyRound,
  Headphones,
  BookMarked,
  Mic,
  PenTool,
  Target,
  Map,
} from "lucide-react";

import { logOut } from "@/redux/auth/authSlice";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserHistoryQuery,
} from "@/redux/user/userApiSlice";
import { selectUserProfile, setEditingProfile } from "@/redux/user/userSlice";
import { useGetUserSkillSummaryQuery } from "@/redux/analytics/analyticsApiSlice";

import ChangePasswordModal from "@/components/organism/profile/modals/ChangePasswordModal";

// Radial Semi-Circle Meter Gauge Component
function SkillGaugeMeter({
  skill,
  accuracy,
  correct,
  total,
  icon,
  strokeColor,
}: {
  skill: string;
  accuracy: number;
  correct: number;
  total: number;
  icon: React.ReactNode;
  strokeColor: string;
}) {
  const [animatedAccuracy, setAnimatedAccuracy] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedAccuracy(accuracy);
    }, 150);
    return () => clearTimeout(timer);
  }, [accuracy]);

  // Convert 0-100 accuracy percentage into gauge angle (-90deg to +90deg)
  const needleRotation = -90 + (animatedAccuracy / 100) * 180;

  return (
    <div className="profile-card p-4 flex flex-col items-center justify-between text-center relative overflow-hidden group hover:border-brand/40 transition-all duration-300">
      <div className="flex items-center space-x-1.5 mb-1">
        <span className="p-1.5 rounded-lg bg-background-hover">{icon}</span>
        <span className="text-xs font-bold text-foreground tracking-tight">
          {skill}
        </span>
      </div>

      {/* SVG Semi-Circle Arc Meter */}
      <div className="relative w-32 h-16 my-1 flex justify-center items-end">
        <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
          {/* Background Track Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-neutral-200 dark:text-neutral-800"
          />

          {/* Active Filled Arc Segment */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 - (125.6 * animatedAccuracy) / 100}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Animated Gauge Pointer Needle */}
        <div
          className="absolute bottom-0 w-1 h-12 origin-bottom transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${needleRotation}deg)` }}
        >
          <div className="w-full h-10 bg-foreground rounded-t-full shadow-md" />
        </div>

        {/* Center Needle Pivot */}
        <div className="absolute bottom-[-4px] w-3.5 h-3.5 rounded-full bg-foreground border-2 border-background-card shadow-sm z-10" />
      </div>

      {/* Accuracy Output Readout */}
      <div className="mt-2 text-center">
        <p className="text-xl font-extrabold text-foreground tracking-tight">
          {animatedAccuracy}%
        </p>
        <p className="text-[11px] font-semibold text-foreground-subtle">
          {correct} / {total} correct
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);

  // Redux User Selectors & Profile Queries
  const profile = useSelector(selectUserProfile);
  const userId = profile?.id || profile?.user_id || "";

  const { isFetching: isProfileLoading } = useGetUserProfileQuery();
  const { data: history, isLoading: isHistoryLoading } =
    useGetUserHistoryQuery();

  // Fetch Real Skill Summary Data from Analytics API
  const { data: skillSummary, isLoading: isSkillsLoading } =
    useGetUserSkillSummaryQuery(userId, {
      skip: !userId, // Skip query if userId is not loaded yet
    });

  const [updateProfile, { isLoading: isSaving }] =
    useUpdateUserProfileMutation();

  const [formData, setFormData] = React.useState({
    fullName: "",
    notifications: true,
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.name || "",
        notifications: true,
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    dispatch(setEditingProfile(true));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, notifications: !prev.notifications }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: formData.fullName,
        phoneNumber: profile?.phoneNumber,
      }).unwrap();
    } catch (error: any) {
      alert(error?.data?.error || "Failed to update profile");
    }
  };

  const handleLogoutClick = () => {
    dispatch(logOut());
    navigate("/login");
  };

  const isUnchanged = profile?.name === formData.fullName;

  const totalSessions = history?.length || 0;
  const totalScore =
    history?.reduce((acc: number, current: any) => acc + current.score, 0) || 0;
  const averageScore =
    totalSessions > 0 ? (totalScore / totalSessions).toFixed(1) : "0";

  const stats = [
    {
      label: "Total Exams",
      value: totalSessions.toString(),
      icon: <BookOpen className="w-5 h-5 text-status-info" />,
    },
    {
      label: "Avg Score",
      value: `${averageScore}%`,
      icon: <Award className="w-5 h-5 text-brand" />,
    },
    {
      label: "Status",
      value: "Active",
      icon: <Clock className="w-5 h-5 text-status-success" />,
    },
  ];

  // Config mapping for skills with keyword fallback logic
  const skillConfigs = React.useMemo(
    () => [
      {
        name: "Listening",
        keywords: ["listening", "listening comprehension"],
        icon: <Headphones className="w-4 h-4 text-sky-500" />,
        strokeColor: "#0284c7",
      },
      {
        name: "Reading",
        keywords: ["reading", "reading comprehension"],
        icon: <BookMarked className="w-4 h-4 text-indigo-500" />,
        strokeColor: "#6366f1",
      },
      {
        name: "Vocabulary",
        keywords: ["vocabulary", "speaking"],
        icon: <Mic className="w-4 h-4 text-amber-500" />,
        strokeColor: "#f59e0b",
      },
      {
        name: "Grammar",
        keywords: ["grammar", "writing"],
        icon: <PenTool className="w-4 h-4 text-emerald-500" />,
        strokeColor: "#10b981",
      },
    ],
    [],
  );

  // Map real backend analytics data onto gauge items (Supporting Array Tuple & Object formats)
  const skillAccuracies = React.useMemo(() => {
    return skillConfigs.map((cfg) => {
      const match = skillSummary?.find((item: any) => {
        const rawSkillName = Array.isArray(item)
          ? item[2]
          : item?.skill_name || item?.skillName || item?.name || "";
        const cleanName = String(rawSkillName).toLowerCase();

        return cfg.keywords.some((kw) => cleanName.includes(kw));
      });

      const isArray = Array.isArray(match);

      const total = match
        ? isArray
          ? Number(match[4] || 0)
          : Number(match.total_questions ?? 0)
        : 0;

      const correct = match
        ? isArray
          ? Number(match[5] || 0)
          : Number(match.correct_questions ?? 0)
        : 0;

      let rawAccuracy = match
        ? isArray
          ? Number(match[7] || 0)
          : Number(match.accuracy || 0)
        : 0;

      if (rawAccuracy <= 1 && rawAccuracy > 0) {
        rawAccuracy = rawAccuracy * 100;
      }
      const accuracy = Math.round(rawAccuracy);

      return {
        skill: isArray && match[2] ? match[2] : cfg.name,
        accuracy,
        correct,
        total,
        icon: cfg.icon,
        strokeColor: cfg.strokeColor,
      };
    });
  }, [skillSummary, skillConfigs]);

  if (isProfileLoading || isHistoryLoading || isSkillsLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground-muted font-semibold">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* 1. Header Hub */}
      <header className="profile-header">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="profile-header-btn-back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="profile-header-avatar">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="font-bold text-lg text-foreground tracking-tight">
              Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button type="button" className="profile-header-btn-user">
            <User className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleLogoutClick}
            className="profile-header-btn-logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="profile-main space-y-8">
        {/* Banner Hero Section */}
        <section className="profile-banner">
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-banner-to rounded-full opacity-30 blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-background-card rounded-bl-full opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-inner">
                <User className="w-12 h-12 text-brand" />
                <button type="button" className="profile-avatar-overlay">
                  <Camera className="w-6 h-6 text-background-card" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pb-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {profile?.name}
                </h1>
                <span className="profile-badge-pro">PRO</span>
              </div>
              <p className="text-sm opacity-90 font-medium flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 opacity-80" />
                <span>{profile?.email}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Separated Skill Accuracy Section with Gauge Meters */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="profile-section-title flex items-center space-x-2">
              <Target className="w-4 h-4 text-brand" />
              <span>Skill Accuracy Gauge</span>
            </h2>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate("/roadmap")}
                className="px-3.5 py-1.5 rounded-xl bg-brand/10 border border-brand/20 text-brand font-bold hover:bg-brand/20 transition-all flex items-center space-x-2 text-xs"
              >
                <Map className="w-3.5 h-3.5" />
                <span>View Roadmap</span>
              </button>
              <span className="hidden sm:inline text-xs font-semibold text-foreground-subtle">
                Real-time Precision Analysis
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {skillAccuracies.map((item, idx) => (
              <SkillGaugeMeter key={idx} {...item} />
            ))}
          </div>
        </section>

        {/* Profile Split-Layout Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Learning Statistics */}
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-3">
              <h2 className="profile-section-title">Learning Statistics</h2>
              <div className="profile-card p-5 space-y-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="profile-stat-card">
                    <div className="profile-stat-icon-wrapper">{stat.icon}</div>
                    <div>
                      <p className="text-[11px] font-bold text-foreground-subtle uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-lg font-extrabold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Account Management Form */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="profile-section-title">Account Settings</h2>

            <form onSubmit={handleSave} className="profile-card">
              <div className="profile-form-grid">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="profile-form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="profile-form-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="profile-form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile?.email ?? ""}
                    onChange={handleInputChange}
                    className="profile-form-input"
                    required
                    disabled
                  />
                </div>
              </div>

              <hr className="border-border my-5" />

              <div className="space-y-0">
                <div className="profile-setting-row">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="profile-setting-icon">
                      <Shield className="w-5 h-5 text-brand" />
                    </div>
                    <div className="profile-setting-text">
                      <h4 className="text-sm font-bold text-foreground">
                        Email Notifications
                      </h4>
                      <p className="text-xs text-foreground-subtle">
                        Receive system performance metrics directly.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggle}
                    className={`profile-toggle-btn ${
                      formData.notifications ? "bg-brand" : "bg-background-hover"
                    }`}
                  >
                    <div
                      className={`profile-toggle-knob ${
                        formData.notifications ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="profile-setting-row">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="profile-setting-icon">
                      <KeyRound className="w-5 h-5 text-brand" />
                    </div>
                    <div className="profile-setting-text">
                      <h4 className="text-sm font-bold text-foreground">
                        Account Password
                      </h4>
                      <p className="text-xs text-foreground-subtle">
                        Update your account authentication token configuration.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="profile-btn-secondary profile-setting-action"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              <div className="profile-submit-row">
                <button
                  type="submit"
                  disabled={isSaving || isUnchanged}
                  className="profile-btn-primary"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="profile-footer">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>

      {/* 4. Modal Mount */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
