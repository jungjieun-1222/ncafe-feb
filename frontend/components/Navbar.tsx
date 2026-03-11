'use client';

import React from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCartStore } from '@/stores/useCartStore';
import { ShoppingBag, ClipboardList, Settings } from 'lucide-react';

const Navbar = () => {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { openCart } = useCartStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        toast.success('로그아웃 되었습니다.');
        router.push('/');
    };

    const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

    return (
        <nav className={`${styles.nav} glass-warm`}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/" className={`${styles.logoLink} calligraphy`}>
                        🍵 엔카페
                    </Link>
                </div>

                <div className={styles.groupA}>
                    <Link href="/menus" className={`${styles.link} ${pathname === '/menus' ? styles.active : ''}`}>차림표</Link>
                    <Link href="/story" className={`${styles.link} ${pathname === '/story' ? styles.active : ''}`}>이야기</Link>
                    <Link href="/location" className={`${styles.link} ${pathname === '/location' ? styles.active : ''}`}>오시는 길</Link>
                </div>

                <div className={styles.spacer}></div>

                <div className={styles.groupB}>
                    {isAdmin ? (
                        <Link href="/admin" className={`${styles.adminActionLink} ${pathname.startsWith('/admin') ? styles.activeAdmin : ''}`}>
                            <Settings size={20} />
                            <span>관리자 전용</span>
                        </Link>
                    ) : (
                        <>
                            <Link href="/orders" className={`${styles.actionLink} ${pathname === '/orders' ? styles.activeAction : ''}`}>
                                <ClipboardList size={20} />
                                <span>내 주문</span>
                            </Link>
                            <button 
                                onClick={openCart} 
                                className={styles.cartActionBtn}
                            >
                                <ShoppingBag size={20} />
                                <span>장바구니</span>
                            </button>
                        </>
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
