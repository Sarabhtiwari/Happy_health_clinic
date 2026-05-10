import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../zustand/UseAdminStore";
import useAuthStore from "../zustand/UseAuthStore";
import { StatCard } from "./AdminShared";
import { AppointmentsTab, UsersTab } from "./AdminTabs";
import api from "../utils/api"

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const { stats, error, activeTab, setTab, fetchStats, clearError } =
    useAdminStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/signout");
    } catch (error) {
      console.error("Failed to log out on the server:", error);
    } finally {
      clearAuth();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Topbar ── */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-gray-700 text-sm transition-colors"
          >
            ← Home
          </button>
          <span className="text-gray-200">|</span>
          <h1 className="text-lg font-bold text-gray-900 font-serif">
            Admin Panel
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">
            Signed in as{" "}
            <span className="font-semibold text-gray-800">{user?.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
        {/* Error banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Appointments"
            value={stats?.totalAppointments}
            icon="📋"
            accent="bg-blue-50"
          />
          <StatCard
            label="Pending"
            value={stats?.pendingAppointments}
            icon="⏳"
            accent="bg-amber-50"
          />
          <StatCard
            label="Total Patients"
            value={stats?.totalPatients}
            icon="🧑‍⚕️"
            accent="bg-green-50"
          />
          <StatCard
            label="Doctors"
            value={stats?.totalDoctors}
            icon="👨‍⚕️"
            accent="bg-purple-50"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
          {["appointments", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {activeTab === "appointments" && <AppointmentsTab />}
        {activeTab === "users" && <UsersTab />}
      </main>
    </div>
  );
};

export default AdminDashboard;
