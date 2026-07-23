import * as React from "react";
import {
  LogOut,
  User,
  ArrowLeft,
  Plus,
  Search,
  MoreVertical,
  ShieldCheck,
  UserCheck,
  UserMinus,
  Mail,
  Award,
} from "lucide-react";

export default function UserManagementPage() {
  // Mock Data Array for System Users
  const [users, setUsers] = React.useState([
    {
      id: "usr-1",
      name: "Alex Mercer",
      email: "alex.mercer@workspace.com",
      role: "Premium Learner",
      status: "Active",
      cardsMastered: 342,
      joinedDate: "Jan 12, 2026",
    },
    {
      id: "usr-2",
      name: "Jane Doe",
      email: "jane.doe@workspace.com",
      role: "Administrator",
      status: "Active",
      cardsMastered: 512,
      joinedDate: "Nov 04, 2025",
    },
    {
      id: "usr-3",
      name: "Marcus Vance",
      email: "m.vance@workspace.com",
      role: "Standard Learner",
      status: "Suspended",
      cardsMastered: 89,
      joinedDate: "Mar 29, 2026",
    },
  ]);

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Administrative summary counts
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      {/* 1. Dynamic Top Navigation Hub Bar */}
      <header className="w-full bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              J
            </div>
            <span className="font-bold text-lg text-neutral-800 tracking-tight">
              Admin Hub
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-red-500 transition-colors px-2 py-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Main Layout Container Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col space-y-8">
        {/* Header Action Dashboard Hub Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-800 tracking-tight">
              User Management
            </h1>
            <p className="text-xs text-neutral-400 font-medium mt-0.5">
              Administer system authorization levels, access status, and view
              application metrics.
            </p>
          </div>

          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>

        {/* 3. Operational Performance Summary Mini-Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5A67FF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Total System Users
              </p>
              <p className="text-xl font-black text-neutral-800 mt-0.5">
                {totalUsers}
              </p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Active Deployments
              </p>
              <p className="text-xl font-black text-neutral-800 mt-0.5">
                {activeUsers}
              </p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Global Cards Finished
              </p>
              <p className="text-xl font-black text-neutral-800 mt-0.5">943</p>
            </div>
          </div>
        </div>

        {/* 4. Controls & Search Filter Deck Row */}
        <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter by name or identity email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] transition-all"
            />
          </div>
        </div>

        {/* 5. Main System Users Structured Table Data */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="px-6 py-4">User Identity</th>
                  <th className="px-6 py-4">Access Level</th>
                  <th className="px-6 py-4">Mastery Array</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80 text-xs font-medium text-neutral-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-neutral-50/50 transition-colors group"
                    >
                      {/* Name & Email Identity Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-indigo-50 flex items-center justify-center text-neutral-500 group-hover:text-[#5A67FF] transition-colors font-bold text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-800">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-neutral-400 flex items-center space-x-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              <span>{user.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Access Level Authorization Tag Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            user.role === "Administrator"
                              ? "bg-purple-50 text-purple-600 border border-purple-100"
                              : user.role === "Premium Learner"
                                ? "bg-indigo-50 text-[#5A67FF] border border-indigo-100"
                                : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Mastery Cards Calculation Metric Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-bold text-neutral-800">
                            {user.cardsMastered} Cards
                          </p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            Joined {user.joinedDate}
                          </p>
                        </div>
                      </td>

                      {/* Activity Status Flag Toggle Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            user.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`}
                          />
                          <span>{user.status}</span>
                        </span>
                      </td>

                      {/* Action Menu Target Row Column */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          className="w-7 h-7 inline-flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
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
                      className="px-6 py-10 text-center font-semibold text-neutral-400"
                    >
                      No matching records found in system dataset arrays.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 4. Footer Baseline Component Group */}
      <footer className="w-full bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 font-medium">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>
    </div>
  );
}
