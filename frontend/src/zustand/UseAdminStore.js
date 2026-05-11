// store/useAdminStore.js

import { create } from "zustand";
import api from "../utils/api"; // Use your configured Axios instance

// Adjust this BASE URL if your axios instance baseURL already includes part of it
const BASE = "/admin";

const useAdminStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────────────────
  stats: null,
  appointments: [],
  users: [],
  loading: false,
  error: null,
  activeTab: "appointments",
serviceAppointments: [],
serviceAppointmentsLoading: false,
  // ── Helpers ───────────────────────────────────────────────────────────────
  _handleError: (err) => {
    let msg = err.response?.data?.err || err.message || "Something went wrong";

    if (typeof msg === "object") {
      msg = msg.message || JSON.stringify(msg);
    }

    if (msg === "{}") {
      msg = "Internal Server Error: Could not load data.";
    }

    set({ error: msg, loading: false });
  },

  setTab: (tab) => set({ activeTab: tab }),
  clearError: () => set({ error: null }),

  // ── Dashboard Stats ───────────────────────────────────────────────────────
  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`${BASE}/stats`);
      set({ stats: res.data.data, loading: false });
    } catch (err) {
      get()._handleError(err);
    }
  },

  // ── Appointments ──────────────────────────────────────────────────────────
  fetchAppointments: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const { paymentStatus, patientName, doctorName, email, mob_no } = filters;
      let query = "?";
      if (paymentStatus) query += `paymentStatus=${paymentStatus}&`;
      if (patientName) query += `userName=${patientName}&`;
      if (doctorName) query += `doctorName=${doctorName}&`;
      if (email) query += `email=${email}&`;
      if (mob_no) query += `mob_no=${mob_no}&`;

      const res = await api.get(`${BASE}/appointments${query}`);

      let rawData =
        res.data?.data?.appointments ||
        res.data?.data ||
        res.data?.appointments ||
        res.data;

      const apptsArray = Array.isArray(rawData) ? rawData : [];

      set({ appointments: apptsArray, loading: false });
    } catch (err) {
      get()._handleError(err);
    }
  },

  updateAppointmentStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`${BASE}/appointments/${id}/status`, { status });

      // Update in-place so we don't have to re-fetch the whole list
      set((state) => ({
        appointments: state.appointments.map((a) =>
          a._id === id ? { ...a, status } : a,
        ),
        loading: false,
      }));
    } catch (err) {
      get()._handleError(err);
    }
  },

  deleteAppointment: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`${BASE}/appointments/${id}`);

      set((state) => ({
        appointments: state.appointments.filter((a) => a._id !== id),
        loading: false,
      }));
    } catch (err) {
      get()._handleError(err);
    }
  },

  // ── Users ─────────────────────────────────────────────────────────────────
  fetchUsers: async (role = "") => {
    set({ loading: true, error: null });
    try {
      const query = role ? `?role=${role}` : "";
      const res = await api.get(`${BASE}/users${query}`);

      let rawData =
        res.data?.data?.users || res.data?.data || res.data?.users || res.data;

      const usersArray = Array.isArray(rawData) ? rawData : [];

      set({ users: usersArray, loading: false });
    } catch (err) {
      get()._handleError(err);
    }
  },

  addDoctor: async (doctorData) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/doctor`, doctorData);
      get().fetchUsers();
    } catch (err) {
      get()._handleError(err);
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`${BASE}/users/${id}`);

      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
        loading: false,
      }));
    } catch (err) {
      get()._handleError(err);
    }
  },

  fetchServiceAppointments: async (filters = {}) => {
  set({ serviceAppointmentsLoading: true });
  try {
    const params = new URLSearchParams();
    if (filters.name) params.append("name", filters.name);
    if (filters.mob_no) params.append("mob_no", filters.mob_no);

    const res = await api.get(`/service-appointments?${params.toString()}`);
    set({ serviceAppointments: res.data.data || [] });
  } catch (error) {
    set({ error: error.response?.data?.err || "Failed to fetch service appointments" });
  } finally {
    set({ serviceAppointmentsLoading: false });
  }
},

updateServiceAppointmentStatus: async (id, status) => {
  try {
    const res = await api.patch(`/service-appointments/${id}/status`, { status });
    // Update only that one row in state — no refetch needed
    set((state) => ({
      serviceAppointments: state.serviceAppointments.map((a) =>
        a._id === id ? res.data.data : a
      ),
    }));
  } catch (error) {
    set({ error: error.response?.data?.err || "Failed to update status" });
  }
},


}));

export default useAdminStore;
