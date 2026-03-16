'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthInitializer() {
    const checkAuth = useAuthStore(state => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const { isAuthenticated, isLoading } = useAuthStore();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const cartId = localStorage.getItem('cartId');
            if (cartId && cartId.startsWith('user-')) {
                localStorage.removeItem('cartId');
                // Trigger a refresh across components
                const { triggerRefresh } = (import('@/stores/useCartStore') as any).useCartStore?.getState() || {};
                if (triggerRefresh) triggerRefresh();
            }
        }
    }, [isLoading, isAuthenticated]);

    return null;
}
