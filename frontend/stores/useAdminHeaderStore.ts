import { create } from 'zustand';
import { ReactNode } from 'react';

interface AdminHeaderState {
    title: string;
    subtitle?: string;
    actions: ReactNode | null;
    setTitle: (title: string) => void;
    setSubtitle: (subtitle?: string) => void;
    setActions: (actions: ReactNode | null) => void;
    setHeader: (title: string, subtitle?: string, actions?: ReactNode | null) => void;
    clearHeader: () => void;
}

export const useAdminHeaderStore = create<AdminHeaderState>((set) => ({
    title: '',
    subtitle: '',
    actions: null,
    setTitle: (title) => set({ title }),
    setSubtitle: (subtitle) => set({ subtitle }),
    setActions: (actions) => set({ actions }),
    setHeader: (title, subtitle, actions) => set({ title, subtitle, actions: actions || null }),
    clearHeader: () => set({ title: '', subtitle: '', actions: null }),
}));
