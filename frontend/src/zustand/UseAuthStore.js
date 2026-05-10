import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({

      user: null,
      isAuthenticated: false,

      isAdmin: false,
      isDoctor: false,
      isPatient: false,

      setAuth: (user) =>
        set({
          user,
          isAuthenticated: true,

          isAdmin: user.userRole === 'ADMIN',
          isDoctor: user.userRole === 'DOCTOR',
          isPatient: user.userRole === 'PATIENT',
        }),

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
      name: 'clinic-auth',

      partialize: (state) => ({
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