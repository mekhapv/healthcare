import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Patient, UserSession, ViewMode } from '../types';
import { patients } from '../data/patients';

type AppState = {
  user: UserSession | null;
  patients: Patient[];
  selectedPatientId: string;
  viewMode: ViewMode;
  notificationCount: number;
  setUser: (user: UserSession | null) => void;
  setSelectedPatient: (id: string) => void;
  setViewMode: (viewMode: ViewMode) => void;
  incrementNotificationCount: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      patients,
      selectedPatientId: patients[0]?.id ?? '',
      viewMode: 'grid',
      notificationCount: 0,
      setUser: (user) => set({ user }),
      setSelectedPatient: (id) => set({ selectedPatientId: id }),
      setViewMode: (viewMode) => set({ viewMode }),
      incrementNotificationCount: () =>
        set((state) => ({ notificationCount: state.notificationCount + 1 })),
    }),
    {
      name: 'careops-session',
      partialize: (state) => ({
        user: state.user,
        selectedPatientId: state.selectedPatientId,
        viewMode: state.viewMode,
        notificationCount: state.notificationCount,
      }),
    },
  ),
);
