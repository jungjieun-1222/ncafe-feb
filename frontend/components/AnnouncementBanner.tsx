'use client';

import React from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { Megaphone } from 'lucide-react';
import styles from './AnnouncementBanner.module.css';

export default function AnnouncementBanner() {
    const settings = useSettingsStore(state => state.settings);

    if (!settings?.announcement) return null;

    return (
        <div className={styles.banner}>
            <div className={styles.container}>
                <Megaphone size={16} className={styles.icon} />
                <span className={styles.text}>{settings.announcement}</span>
            </div>
        </div>
    );
}
