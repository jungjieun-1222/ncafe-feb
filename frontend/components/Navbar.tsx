'use client';

import React from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const Navbar = () => {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        toast.success('로그아웃 되었습니다.');
        router.push('/');
    };

    return (
        <nav className={`${styles.nav} glass-warm`}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/" className={`${styles.logoLink} calligraphy`}>
                        🍵 엔카페
                    </Link>
                </div>

                <div className={styles.links}>
                    <Link href="/menus" className={styles.link}>차림표</Link>
                    <Link href="/story" className={styles.link}>이야기</Link>
                    <Link href="/locations" className={styles.link}>오시는 길</Link>
                    {(user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN') && (
                        <Link href="/admin" className={styles.link}>관리자</Link>
                    )}
                </div>

                <div className={styles.actions}>
                    {isAuthenticated ? (
                        <>
                            <span className={styles.userInfo}>{user?.username}님</span>
                            <button
                                onClick={handleLogout}
                                className={styles.loginBtn}
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className={styles.loginBtn}
                        >
                            로그인
                        </Link>
                    )}
                    <button
                        className={styles.reserveBtn}
                    >
                        자리 예약
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
