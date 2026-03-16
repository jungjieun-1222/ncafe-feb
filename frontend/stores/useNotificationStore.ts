import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
    lastReadAnnouncement: string | null;
    markAsRead: (announcement: string) => void;
    checkIsRead: (announcement: string | undefined) => boolean;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            lastReadAnnouncement: null,
            markAsRead: (announcement: string) => set({ lastReadAnnouncement: announcement }),
            checkIsRead: (announcement: string | undefined) => {
                if (!announcement) return true;
                return get().lastReadAnnouncement === announcement;
            },
        }),
        {
            name: 'notification-storage',
        }
    )
);
