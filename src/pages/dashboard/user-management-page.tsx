import * as React from "react";
import {
  Plus,
  Search,
  MoreVertical,
  ShieldCheck,
  UserCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "@/redux/user/userApiSlice";
import ConfirmModal from "@/components/organism/common/ConfirmModal";
import {
  ToastContainer,
  type ToastMessage,
} from "@/components/organism/common/Toast";
import Dropdown from "@/components/organism/common/Dropdown";
import { useState } from "react";

export default function UserManagementPage() {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    message?: string,
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Track which user is currently being deleted via API
  const [deletingUserId, setDeletingUserId] = React.useState<
    string | number | null
  >(null);

  // State for ConfirmModal control
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<any | null>(null);

  // Debounce search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch users list from backend via RTK Query
  const { data, isLoading, isFetching, isError, refetch } = useGetUsersQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  // RTK Query Mutation for deletion
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = data?.data || [];
  const pagination = data?.pagination;
  const totalUsers = pagination?.total || 0;

  // Handlers for menu actions
  const handleViewDetails = (user: any) => {
    console.log("View details for user:", user);
  };

  const handleEditUser = (user: any) => {
    console.log("Edit user:", user);
  };

  const handleOpenDeleteModal = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeletingUserId(userToDelete.id);
      await deleteUser(userToDelete.id).unwrap();

      if (users.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }

      addToast(
        "success",
        "Action Success",
        `User ${userToDelete.name || userToDelete.email} was successfully deleted.`,
      );
    } catch (err) {
      console.error("Failed to delete user:", err);
      addToast(
        "error",
        "Action Failed",
        "Failed to delete user. Please try again.",
      );
    } finally {
      setDeletingUserId(null);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="w-full space-y-8">
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

      {/* Operational Performance Summary Mini-Widgets */}
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
              Current Page Items
            </p>
            <p className="text-xl font-black text-neutral-800 mt-0.5">
              {users.length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Total Pages
            </p>
            <p className="text-xl font-black text-neutral-800 mt-0.5">
              {pagination?.totalPages || 1}
            </p>
          </div>
        </div>
      </div>

      {/* Controls & Search Filter Deck Row */}
      <div className="bg-white border border-neutral-200/80 p-4 rounded-2xl shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Filter by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] transition-all"
          />
          {isFetching && (
            <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-600 animate-spin" />
          )}
        </div>
      </div>

      {/* Main System Users Structured Table Data */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="px-6 py-4">User Identity</th>
                <th className="px-6 py-4">Access Level (Role)</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/80 text-xs font-medium text-neutral-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-neutral-400">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                      <p className="font-semibold text-xs">
                        Loading users data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="text-red-500 font-semibold space-y-2">
                      <p>Failed to load user records from server.</p>
                      <button
                        onClick={() => refetch()}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user: any) => {
                  const isCurrentDeleting =
                    isDeleting && deletingUserId === user.id;

                  const menuItems = [
                    {
                      label: "View Details",
                      icon: <Eye className="w-3.5 h-3.5" />,
                      onClick: () => handleViewDetails(user),
                    },
                    {
                      label: "Edit User",
                      icon: <Pencil className="w-3.5 h-3.5" />,
                      onClick: () => handleEditUser(user),
                    },
                    {
                      label: "Delete User",
                      icon: <Trash2 className="w-3.5 h-3.5" />,
                      onClick: () => handleOpenDeleteModal(user),
                      danger: true,
                      divider: true,
                    },
                  ];

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-neutral-50/50 transition-colors group ${
                        isCurrentDeleting
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      {/* Name & Email Identity Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-indigo-50 flex items-center justify-center text-neutral-500 group-hover:text-[#5A67FF] transition-colors font-bold text-xs uppercase">
                            {user.name ? user.name.charAt(0) : "U"}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-800">
                              {user.name || "N/A"}
                            </p>
                            <p className="text-[11px] text-neutral-400 flex items-center space-x-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              <span>{user.email}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            user.role?.name === "ADMIN"
                              ? "bg-purple-50 text-purple-600 border border-purple-100"
                              : "bg-indigo-50 text-[#5A67FF] border border-indigo-100"
                          }`}
                        >
                          {user.role?.name || "USER"}
                        </span>
                      </td>

                      {/* Phone Number Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-neutral-600 font-medium">
                          {user.phoneNumber || "—"}
                        </span>
                      </td>

                      {/* Joined Date Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Action Dropdown Menu Column */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {isCurrentDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-500 mx-auto" />
                        ) : (
                          <Dropdown
                            align="right"
                            width="w-44"
                            items={menuItems}
                            trigger={
                              <button
                                type="button"
                                className="w-7 h-7 inline-flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            }
                          />
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center font-semibold text-neutral-400"
                  >
                    No matching user records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-200/80 flex items-center justify-between rounded-b-2xl">
            <p className="text-xs text-neutral-500 font-medium">
              Showing page{" "}
              <span className="font-bold text-neutral-800">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-bold text-neutral-800">
                {pagination.totalPages}
              </span>{" "}
              ({pagination.total} total)
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || isFetching}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.totalPages))
                }
                disabled={page === pagination.totalPages || isFetching}
                className="p-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${
          userToDelete?.name || userToDelete?.email || "this user"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
