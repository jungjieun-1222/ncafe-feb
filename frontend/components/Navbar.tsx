import React from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className={`${styles.nav} glass-warm`}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">
                        <span>엔카페</span> <span className={styles.dot}>.</span>
                    </Link>
                </div>

                <div className={styles.links}>
                    <Link href="/menu" className={styles.link}>차림표</Link>
                    <Link href="/story" className={styles.link}>이야기</Link>
                    <Link href="/locations" className={styles.link}>오시는 길</Link>
                </div>

                <div className={styles.actions}>
                    <button className={styles.reserveBtn}>자리 예약</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
