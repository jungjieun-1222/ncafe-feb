import { create } from 'zustand';

interface ConfigState {
    configs: Record<string, string>;
    isLoading: boolean;
    fetchConfigs: () => Promise<void>;
    getConfig: (key: string, defaultValue?: string) => string;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
    configs: {},
    isLoading: true,
    fetchConfigs: async () => {
        try {
            const response = await fetch('/api/v1/configs');
            if (response.ok) {
                const data = await response.json();
                set({ configs: data, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Failed to fetch configs:', error);
            set({ isLoading: false });
        }
    },
    getConfig: (key: string, defaultValue = '') => {
        return get().configs[key] || defaultValue;
    }
}));
