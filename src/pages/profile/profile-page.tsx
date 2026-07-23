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

// Import your custom password change modal layout
import ChangePasswordModal from "@/components/organism/profile/modals/ChangePasswordModal";
export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Modal visibility tracking status
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);

  // 1. Fetch live Profile data & Exam History from RTK Query
  const { isFetching: isProfileLoading } = useGetUserProfileQuery();
  const { data: history, isLoading: isHistoryLoading } =
    useGetUserHistoryQuery();
  const [updateProfile, { isLoading: isSaving }] =
    useUpdateUserProfileMutation();

  // Select the globally synced profile state built in the previous step
  const profile = useSelector(selectUserProfile);

  // 2. Local Form state synced when API returns profile data
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

  // 3. User Interaction Handlers
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

  // Check if form data matches the source state to manage disable modes
  const isUnchanged =
    profile?.name === formData.fullName && profile?.email === formData.email;

  // 4. Compute Metrics Dynamically from History
  const totalSessions = history?.length || 0;
  const totalScore =
    history?.reduce((acc, current) => acc + current.score, 0) || 0;
  const averageScore =
    totalSessions > 0 ? (totalScore / totalSessions).toFixed(1) : "0";

  const stats = [
    {
      label: "Total Exams",
      value: totalSessions.toString(),
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "Avg Score",
      value: `${averageScore}%`,
      icon: <Award className="w-5 h-5 text-indigo-500" />,
    },
    {
      label: "Status",
      value: "Active",
      icon: <Clock className="w-5 h-5 text-emerald-500" />,
    },
  ];

  if (isProfileLoading || isHistoryLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 text-neutral-500 font-semibold">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      {/* 1. Top Navigation Hub Bar */}
      <header className="w-full bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="font-bold text-lg text-neutral-800 tracking-tight">
              Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center text-[#5A67FF] border border-indigo-100 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleLogoutClick}
            className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-red-500 transition-colors px-2 py-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Main Layout Container Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col space-y-8">
        {/* Banner Profile Identity Segment */}
        <section className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl pt-16 pb-8 px-6 md:px-12 text-white shadow-lg overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500 rounded-full opacity-30 blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-full opacity-10 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0">
            <div className="relative group w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white p-1 shadow-xl flex-shrink-0">
              <div className="w-full h-full bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400 overflow-hidden relative">
                <User className="w-12 h-12 text-indigo-500" />
                <button
                  type="button"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pb-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {profile?.name}
                </h1>
                <span className="bg-white/20 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md backdrop-blur-md">
                  PRO
                </span>
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
            <h2 className="text-lg font-extrabold text-neutral-800 tracking-tight">
              Learning Statistics
            </h2>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-neutral-50/80 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-lg font-extrabold text-neutral-800">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Account Management Form */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-extrabold text-neutral-800 tracking-tight">
              Account Settings
            </h2>

            <form
              onSubmit={handleSave}
              className="bg-white border border-neutral-200/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="text-xs font-bold text-neutral-600 uppercase tracking-wider"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] focus:ring-2 focus:ring-indigo-100 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-bold text-neutral-600 uppercase tracking-wider"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] focus:ring-2 focus:ring-indigo-100 transition-all"
                    required
                  />
                </div>
              </div>

              <hr className="border-neutral-200/80" />

              {/* Toggle Switch Preference Card */}
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-800">
                      Email Notifications
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Receive system performance metrics directly.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggle}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    formData.notifications ? "bg-[#5A67FF]" : "bg-neutral-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      formData.notifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Security Credentials Row Integration Area */}
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-800">
                      Account Password
                    </h4>
                    <p className="text-xs text-neutral-400">
                      Update your account authentication token configuration.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Change Password
                </button>
              </div>

              {/* Form Submission Actions */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving || isUnchanged}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm px-6 py-3 rounded-xl tracking-wide shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
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
      <footer className="w-full bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 font-medium">
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
