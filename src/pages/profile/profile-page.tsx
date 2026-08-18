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
} from "lucide-react";

import { logOut } from "@/redux/auth/authSlice";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserHistoryQuery,
} from "@/redux/user/userApiSlice";
import { selectUserProfile, setEditingProfile } from "@/redux/user/userSlice";

import ChangePasswordModal from "@/components/organism/profile/modals/ChangePasswordModal";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);

  const { isFetching: isProfileLoading } = useGetUserProfileQuery();
  const { data: history, isLoading: isHistoryLoading } =
    useGetUserHistoryQuery();
  const [updateProfile, { isLoading: isSaving }] =
    useUpdateUserProfileMutation();

  const profile = useSelector(selectUserProfile);

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    notifications: true,
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.name || "",
        email: profile.email || "",
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
        email: formData.email,
      }).unwrap();
    } catch (error: any) {
      alert(error?.data?.error || "Failed to update profile");
    }
  };

  const handleLogoutClick = () => {
    dispatch(logOut());
    navigate("/login");
  };

  const isUnchanged =
    profile?.name === formData.fullName && profile?.email === formData.email;

  const totalSessions = history?.length || 0;
  const totalScore =
    history?.reduce((acc, current) => acc + current.score, 0) || 0;
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

  if (isProfileLoading || isHistoryLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground-muted font-semibold">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* 1. Top Navigation Hub Bar */}
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

      {/* 2. Main Layout Container Area */}
      <main className="profile-main">
        {/* Banner Profile Identity Segment */}
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

        {/* Profile Split-Layout Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Learning Statistics */}
          <div className="lg:col-span-1 space-y-6">
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

          {/* Right Column: Account Management Form */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="profile-section-title">Account Settings</h2>

            <form onSubmit={handleSave} className="profile-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    value={formData.email}
                    onChange={handleInputChange}
                    className="profile-form-input"
                    required
                  />
                </div>
              </div>

              <hr className="border-border" />

              {/* Toggle Switch Preference Card */}
              <div className="profile-setting-row">
                <div className="flex items-center space-x-3">
                  <div className="profile-setting-icon">
                    <Shield className="w-5 h-5 text-brand" />
                  </div>
                  <div>
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

              {/* Security Credentials Row */}
              <div className="profile-setting-row">
                <div className="flex items-center space-x-3">
                  <div className="profile-setting-icon">
                    <KeyRound className="w-5 h-5 text-brand" />
                  </div>
                  <div>
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
                  className="profile-btn-secondary"
                >
                  Change Password
                </button>
              </div>

              {/* Form Submission Actions */}
              <div className="flex justify-end pt-2">
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

      {/* 3. Footer Baseline */}
      <footer className="profile-footer">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>

      {/* 4. Overlay Portal Mount Entry */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
