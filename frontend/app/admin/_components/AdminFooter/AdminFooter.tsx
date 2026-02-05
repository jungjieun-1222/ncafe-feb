import React from 'react';
import styles from './AdminFooter.module.css';

export default function AdminFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.copyright}>
                    &copy; {currentYear} NCafe Admin. All rights reserved.
                </p>
                <div className={styles.links}>
                    <span className={styles.version}>v1.0.0</span>
                    <a href="#" className={styles.link}>도움말</a>
                    <a href="#" className={styles.link}>문의하기</a>
                </div>
            </div>
        </footer>
    );
}
