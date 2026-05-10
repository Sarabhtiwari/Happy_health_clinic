// store/useAuthStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      user: null,       // { name, email, userRole }
      isAuthenticated: false,

      // ── Derived State (Booleans, not functions) ────────────────────────────
      isAdmin: false,
      isDoctor: false,
      isPatient: false,

      // ── Actions ────────────────────────────────────────────────────────────
      /** Call this after successful login / signup */
      setAuth: (user) =>
        set({ 
          user, 
          isAuthenticated: true,
          isAdmin: user.userRole === 'ADMIN',
          isDoctor: user.userRole === 'DOCTOR',
          isPatient: user.userRole === 'PATIENT',
        }),

      /** Call on logout */
      clearAuth: () =>
        set({ 
          user: null, 
          isAuthenticated: false,
          isAdmin: false,
          isDoctor: false,
          isPatient: false,
        }),
    }),
    {
      name: 'clinic-auth',       // localStorage key
      partialize: (state) => ({  // only persist what's needed
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        isDoctor: state.isDoctor,
        isPatient: state.isPatient,
      }),
    }
  )
);

export default useAuthStore;