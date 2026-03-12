import { create } from 'zustand';

interface User {
    id: number;
    username: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

import { authAPI } from '@/app/lib/api';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
    checkAuth: async () => {
        try {
            const data = await authAPI.getSession();
            if (data?.user) {
                set({
                    user: {
                        id: data.user.id,
                        username: data.user.nickname,
                        role: data.user.role
                    },
                    isAuthenticated: true,
                    isLoading: false
                });
            } else {
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        } catch (error) {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },
    logout: async () => {
        try {
            await authAPI.logout();
            set({ user: null, isAuthenticated: false });
            window.dispatchEvent(new Event('logout'));
        } catch (error) {
            console.error('Logout failed', error);
        }
    }
}));

