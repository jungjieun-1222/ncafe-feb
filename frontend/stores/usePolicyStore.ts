import { create } from 'zustand';

interface PolicySettings {
    orderReceptionOpen: boolean;
    soldOutHandling: string;
    rewardRate: number;
    welcomeBenefit: string;
}

interface PolicyState {
    policy: PolicySettings | null;
    isLoading: boolean;
    fetchPolicy: () => Promise<void>;
}

export const usePolicyStore = create<PolicyState>((set) => ({
    policy: null,
    isLoading: false,
    fetchPolicy: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch('/api/v1/store/policy');
            if (response.ok) {
                const data = await response.json();
                set({ 
                    policy: {
                        orderReceptionOpen: (data.orderReceptionOpen !== undefined ? data.orderReceptionOpen : data.isOrderReceptionOpen) ?? true,
                        soldOutHandling: data.soldOutHandling || 'LABEL',
                        rewardRate: data.rewardRate ?? 0,
                        welcomeBenefit: data.welcomeBenefit || ''
                    } 
                });
            }
        } catch (error) {
            console.error('Failed to fetch policy:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));
