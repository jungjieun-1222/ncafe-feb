import { create } from 'zustand';

interface StoreSettings {
    name: string;
    logoUrl: string;
    phoneNumber: string;
    address: string;
    operatingHours: string;
    announcement: string;
}

interface SettingsState {
    settings: StoreSettings | null;
    isLoading: boolean;
    fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: null,
    isLoading: false,
    fetchSettings: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch('/api/v1/store/settings');
            if (response.ok) {
                const data = await response.json();
                set({ settings: data });
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));
