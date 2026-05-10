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
  fetchAppointments: async (status = "", paymentStatus = "") => {
    set({ loading: true, error: null });
    try {
      // Simple way: start with ? and add what we have
      let query = "?";
      if (status) query += `status=${status}&`;
      if (paymentStatus) query += `paymentStatus=${paymentStatus}`;

      const res = await api.get(`${BASE}/appointments${query}`);

      const apptsArray =
        res.data?.data?.appointments ||
        res.data?.data ||
        res.data?.appointments ||
        res.data ||
        [];

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

      const usersArray =
        res.data?.data?.users ||
        res.data?.data ||
        res.data?.users ||
        res.data ||
        [];

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
}));

export default useAdminStore;
