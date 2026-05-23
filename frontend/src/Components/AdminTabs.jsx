import { useEffect, useState } from "react";
import useAdminStore from "../zustand/UseAdminStore";
import useAuthStore from "../zustand/UseAuthStore";
import SearchBarForAdminAppointSearch from "./SearchBarForAdminAppointSearch";

import {
  Badge,
  ConfirmModal,
  STATUS_COLORS,
  ROLE_COLORS,
  ModalWrapper,
} from "./AdminShared";

// ── Add Doctor Modal Form ─────────────────────────────────────────────────────
const AddDoctorModal = ({ onClose }) => {
  const { addDoctor } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mob_no: "", 
    fees: "",
    description: "",
    qualification: "",
    maxAppointmentsPerDay: "",
    startTime: "10:00",
    endTime: "18:00",
    availableDays: ["MON", "TUE", "WED", "THU", "FRI"],
  });

  const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoctor({
        ...formData,
        fees: Number(formData.fees),
        maxAppointmentsPerDay: Number(formData.maxAppointmentsPerDay),
        workingHours: {
          start: formData.startTime,
          end: formData.endTime
        }
      });
      onClose(); 
    } catch (error) {
      setLoading(false); 
    }
  };

  return (
    <ModalWrapper title="Add New Doctor" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Details */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            User Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              required
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              required
              type="password"
              name="password"
              placeholder="Temporary Password"
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {/* Added mobile number input */}
            <input
              required
              type="text"
              name="mob_no"
              placeholder="Mobile Number"
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Doctor Details */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            Professional Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              name="qualification"
              placeholder="Qualifications (e.g. MBBS, MD)"
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              required
              type="number"
              name="fees"
              placeholder="Consultation Fees (₹)"
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              required
              type="number"
              name="maxAppointmentsPerDay"
              placeholder="Max Appointments / Day"
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
            />
            <textarea
              required
              name="description"
              placeholder="Doctor Bio / Description"
              rows="3"
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
            ></textarea>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            Schedule
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none"
              />
            </div>
          </div>
          <label className="text-xs text-gray-500 mb-2 block">
            Available Days
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${formData.availableDays.includes(day) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Doctor"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// ── Appointments tab ─────────────────────────────────────────────────────────
export const AppointmentsTab = () => {
  const {
    appointments,
    loading,
    fetchAppointments,
    updateAppointmentStatus,
    deleteAppointment,
  } = useAdminStore();

  const [paymentFilter, setPaymentFilter] = useState("");
  const [confirm, setConfirm] = useState(null);

  const [searchFilters, setSearchFilters] = useState({
    patientName: "",
    doctorName: "",
    email: "",
    mob_no: "",
  });

 const loadAppointments = (updatedFilters = searchFilters, payment = paymentFilter) => {
    // Pass as a single object so order doesn't matter at all
    fetchAppointments({
      paymentStatus: payment,
      patientName: updatedFilters.patientName,
      doctorName: updatedFilters.doctorName,
      email: updatedFilters.email,
      mob_no: updatedFilters.mob_no
    });
  };

  // INITIAL LOAD: Fetch data when tab opens
  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaymentChange = (status) => {
    setPaymentFilter(status);
    loadAppointments(searchFilters, status); // Fetch on payment filter click
  };

  const handleStatusChange = (id, status) => {
    setConfirm({ type: "status", id, value: status });
  };

  const handleDelete = (id) => {
    setConfirm({ type: "delete", id });
  };

  const executeConfirm = async () => {
    if (confirm.type === "status") {
      await updateAppointmentStatus(confirm.id, confirm.value);
    } else {
      await deleteAppointment(confirm.id);
    }
    setConfirm(null);
  };

  return (
    <div>
      {/* SEARCH BAR */}
      <SearchBarForAdminAppointSearch
        onSearch={(filters) => {
          setSearchFilters(filters); // Keep parent state in sync
        }}
        onSearchClick={(filters) => {
          // Trigger fetch ONLY when this button is clicked
          loadAppointments(filters, paymentFilter);
        }}
      />

      {confirm && (
        <ConfirmModal
          message={
            confirm.type === "delete"
              ? "Delete this appointment? This cannot be undone."
              : `Change status to "${confirm.value}"?`
          }
          onConfirm={executeConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* PAYMENT FILTER */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "PENDING", "PAID", "FAILED"].map((s) => (
          <button
            key={s}
            onClick={() => handlePaymentChange(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              paymentFilter === s
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-500 border-gray-200 hover:border-blue-300"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {/* TABLE */}
      {loading && (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      )}

      {!loading && appointments.length === 0 && (
        <p className="text-sm text-gray-400 py-8 text-center">
          No appointments found.
        </p>
      )}

      {!loading && appointments.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-widest">
                <th className="px-5 py-3 font-semibold">Patient</th>
                <th className="px-5 py-3 font-semibold">Doctor</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointments.map((appt) => (
                <tr key={appt._id} className="bg-white hover:bg-gray-50/60">
                  <td className="px-5 py-4 font-medium">
                    {appt.user?.name ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    {appt.doctor?.user?.name ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    {appt.dateOfAppointment
                      ? new Date(appt.dateOfAppointment).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={appt.paymentStatus ?? "PENDING"}
                      colorMap={STATUS_COLORS}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <button 
                      onClick={() => handleDelete(appt._id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Users tab ─────────────────────────────────────────────────────────────────
export const UsersTab = () => {
  const { users, loading, fetchUsers, deleteUser } = useAdminStore();
  const { user: currentUser } = useAuthStore();
  const [roleFilter, setRoleFilter] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  useEffect(() => {
    fetchUsers(roleFilter);
  }, [roleFilter, fetchUsers]);

  const executeConfirm = async () => {
    await deleteUser(confirm.id);
    setConfirm(null);
  };

  return (
    <div>
      {confirm && (
        <ConfirmModal
          message="Delete this user? All their data will be removed."
          onConfirm={executeConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Doctor Modal Trigger */}
      {showDoctorModal && (
        <AddDoctorModal onClose={() => setShowDoctorModal(false)} />
      )}

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap">
          {["", "PATIENT", "DOCTOR", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                roleFilter === r
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300"
              }`}
            >
              {r || "All"}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowDoctorModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm transition-all"
        >
          + Add Doctor
        </button>
      </div>

      {loading && (
        <p className="text-sm text-gray-400 py-8 text-center">Loading…</p>
      )}
      {!loading && users.length === 0 && (
        <p className="text-sm text-gray-400 py-8 text-center">
          No users found.
        </p>
      )}

      {!loading && users.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-widest">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="bg-white hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {u.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      {u.name}
                      {u._id === currentUser?.id && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{u.email}</td>
                  <td className="px-5 py-4">
                    <Badge label={u.userRole} colorMap={ROLE_COLORS} />
                  </td>
                  <td className="px-5 py-4 text-gray-400">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {u._id !== currentUser?.id && (
                        <button
                          onClick={() =>
                            setConfirm({ type: "delete", id: u._id })
                          }
                          className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const ServiceAppointmentsTab = () => {
  const {
    serviceAppointments,
    serviceAppointmentsLoading,
    fetchServiceAppointments,
    updateServiceAppointmentStatus,
  } = useAdminStore();

  const [filters, setFilters] = useState({ name: "", mob_no: "" });
  const [confirm, setConfirm] = useState(null); // { id, status }

  useEffect(() => {
    fetchServiceAppointments();
  }, [fetchServiceAppointments]);

  const handleSearch = () => fetchServiceAppointments(filters);

  const handleClear = () => {
    const reset = { name: "", mob_no: "" };
    setFilters(reset);
    fetchServiceAppointments(reset);
  };

  const executeStatusChange = async () => {
    await updateServiceAppointmentStatus(confirm.id, confirm.status);
    setConfirm(null);
  };

  const SERVICE_STATUS_COLORS = {
    PENDING: "bg-amber-100 text-amber-800",
    DONE:    "bg-green-100 text-green-800",
  };

  return (
    <div>
      {confirm && (
        <ConfirmModal
          message={`Change status to "${confirm.status}"?`}
          onConfirm={executeStatusChange}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Search */}
      <div className="bg-white border border-gray-100 p-5 rounded-2xl mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            placeholder="Patient Name"
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
          />
          <input
            value={filters.mob_no}
            onChange={(e) => setFilters({ ...filters, mob_no: e.target.value })}
            placeholder="Mobile Number"
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-3 mt-4 justify-end">
          <button
            onClick={handleClear}
            className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
          >
            Clear
          </button>
          <button
            onClick={handleSearch}
            className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* States */}
      {serviceAppointmentsLoading && (
        <p className="text-sm text-gray-400 py-8 text-center">Loading...</p>
      )}
      {!serviceAppointmentsLoading && serviceAppointments.length === 0 && (
        <p className="text-sm text-gray-400 py-8 text-center">
          No service appointments found.
        </p>
      )}

      {/* Table */}
      {!serviceAppointmentsLoading && serviceAppointments.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-widest">
                <th className="px-5 py-3 font-semibold">Patient</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Mobile</th>
                <th className="px-5 py-3 font-semibold">Service</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {serviceAppointments.map((appt) => (
                <tr key={appt._id} className="bg-white hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {appt.user?.name ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {appt.user?.email ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {appt.user?.mob_no ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-700">
                    {appt.service?.title ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {appt.date ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    <Badge label={appt.status} colorMap={SERVICE_STATUS_COLORS} />
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={appt.status}
                      onChange={(e) =>
                        setConfirm({ id: appt._id, status: e.target.value })
                      }
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-500 bg-white cursor-pointer"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};