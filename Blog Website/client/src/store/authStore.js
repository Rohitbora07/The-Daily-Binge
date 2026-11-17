import { create } from "zustand";
import { persist } from "zustand/middleware";

const userAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user, token = null) =>
        set((state) => ({
          user,
          token: token !== null ? token : state.token,
          isAuthenticated: !!user,
        })),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);

export default userAuthStore;