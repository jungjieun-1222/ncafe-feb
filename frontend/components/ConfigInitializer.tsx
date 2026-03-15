'use client';

import { useEffect } from 'react';
import { useConfigStore } from '@/stores/useConfigStore';

export default function ConfigInitializer() {
    const fetchConfigs = useConfigStore(state => state.fetchConfigs);

    useEffect(() => {
        fetchConfigs();
    }, [fetchConfigs]);

    return null;
}
