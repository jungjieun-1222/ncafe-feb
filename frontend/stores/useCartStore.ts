import { create } from 'zustand';

interface CartState {
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    
    // Increment this whenever the cart data might have changed 
    // to trigger a re-fetch in components that need it.
    refreshTrigger: number;
    triggerRefresh: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    isOpen: false,
    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    
    refreshTrigger: 0,
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
