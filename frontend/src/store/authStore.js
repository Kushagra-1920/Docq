import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const customStorage = {
  getItem: (name) => {
    return sessionStorage.getItem(name) || localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (sessionStorage.getItem('use_session') === 'true') {
      sessionStorage.setItem(name, value);
    } else {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // { id, email, role, ... }
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      login: (userData, accessToken, refreshToken) => set({
        user: userData,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      }),
      
      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates }
      })),
      
      setTokens: (accessToken, refreshToken) => set({
        accessToken,
        refreshToken,
      }),

      logout: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => customStorage),
    }
  )
);

export default useAuthStore;
