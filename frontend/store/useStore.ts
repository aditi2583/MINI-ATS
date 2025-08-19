import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Application {
  id: string;
  candidateName: string;
  email: string;
  phone?: string;
  role: string;
  yearsOfExperience: number;
  resumeLink?: string;
  resumeFileName?: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  notes?: string;
  appliedDate: string;
  interviewDate?: string;
  skills?: string[];
  salary?: number;
  location?: string;
}

interface Store {
  user: User | null;
  token: string | null;
  applications: Application[];
  theme: 'light' | 'dark';
  filters: {
    search: string;
    status: string;
    role: string;
  };
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setApplications: (applications: Application[]) => void;
  addApplication: (application: Application) => void;
  updateApplication: (id: string, application: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setFilters: (filters: Partial<Store['filters']>) => void;
  logout: () => void;
}

const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      applications: [],
      theme: 'light',
      filters: {
        search: '',
        status: '',
        role: '',
      },
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setApplications: (applications) => set({ applications }),
      addApplication: (application) =>
        set((state) => ({
          applications: [application, ...state.applications],
        })),
      updateApplication: (id, updatedData) =>
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...updatedData } : app
          ),
        })),
      deleteApplication: (id) =>
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
        })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      logout: () =>
        set({
          user: null,
          token: null,
          applications: [],
        }),
    }),
    {
      name: 'mini-ats-storage',
      partialize: (state) => ({
        token: state.token,
        theme: state.theme,
      }),
    }
  )
);

export default useStore;