'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';

export default function SettingsInitializer() {
    const fetchSettings = useSettingsStore(state => state.fetchSettings);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return null;
}
