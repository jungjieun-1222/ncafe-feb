import React from 'react';
import styles from './Footer.module.css';
import { useSettingsStore } from '@/stores/useSettingsStore';

const Footer = () => {
    const settings = useSettingsStore(state => state.settings);

    const operatingHours = settings?.operatingHours && settings.operatingHours !== '{}'
        ? settings.operatingHours
        : '매일 09:00 - 22:00';

    return (
        <footer className={`${styles.footer} heritage-theme`}>
            <div className={styles.patternLine}>
                <div className={styles.dancheongPattern}></div>
            </div>
            <div className={styles.container}>
                <div className={styles.footerContent}>
                    <div className={styles.footerBrand}>
                        <h3>{settings?.name || '엔카페'} <span>.</span></h3>
                    </div>
                    <div className={styles.footerInfo}>
                        <div className={styles.contactInfo}>
                            {settings?.address && <span>{settings.address}</span>}
                            {settings?.phoneNumber && <span className={styles.phone}> | T. {settings.phoneNumber}</span>}
                            {operatingHours && <p className={styles.hours}>{operatingHours}</p>}
                        </div>
                        <p>&copy; {new Date().getFullYear()} NCafe Heritage. 모든 권리는 엔카페(NCafe)에 있습니다.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
