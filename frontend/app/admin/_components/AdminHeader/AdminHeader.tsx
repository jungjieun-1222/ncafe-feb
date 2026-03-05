'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './AdminHeader.module.css';
import { useAdminHeaderStore } from '@/stores/useAdminHeaderStore';
import { User, Menu as MenuIcon, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { title, subtitle, actions } = useAdminHeaderStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        if (confirm('로그아웃 하시겠습니까?')) {
            await logout();
            toast.success('로그아웃 되었습니다.');
            router.push('/');
        }
    };

    // URL 경로에 따른 기본 제목 매핑
    const getPathTitle = (path: string) => {
        if (path === '/admin') return '대시보드';
        // /admin/menus, /admin/menus/new 모두 대응
        if (path === '/admin/menus') return '메뉴 관리';
        if (path === '/admin/menus/new') return '메뉴 추가';
        if (path === '/admin/orders') return '주문 관리';
        if (path === '/admin/settings') return '설정';
        return '';
    };

    // 스토어 제목이 있으면 우선 사용, 없으면 URL 기반 제목 사용
    const displayTitle = title || getPathTitle(pathname);

    if (!displayTitle && !subtitle && !actions) return null;

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                <button
                    className={styles.mobileMenuButton}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <MenuIcon size={24} />
                </button>

                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🍵</span>
                    <span className={`${styles.logoText} calligraphy`}>엔카페</span>
                </Link>

                <div className={styles.titleSection}>
                    <h1 className={styles.title}>{displayTitle}</h1>
                    {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                </div>
            </div>

            <div className={styles.rightSection}>
                {actions && <div className={styles.actions}>{actions}</div>}

                <div className={styles.divider} />

                <div className={styles.userSection}>
                    <div className={styles.userInfo}>
                        <span className={styles.cafeName}>관리자 모드</span>
                        <span className={styles.userName}>{user?.username || '관리자'}님</span>
                    </div>
                    <div className={styles.avatar}>
                        <User size={20} />
                    </div>
                    <button
                        className={styles.logoutButton}
                        onClick={handleLogout}
                        title="로그아웃"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay - Simplified for Prototype */}
            {isMobileMenuOpen && (
                <div className={styles.mobileNavOverlay}>
                    <div className={styles.mobileNavContent}>
                        <div className={styles.mobileNavHeader}>
                            <span className={`${styles.logoText} calligraphy`}>🍵 엔카페</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <nav className={styles.mobileNav}>
                            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>대시보드</Link>
                            <Link href="/admin/menus" onClick={() => setIsMobileMenuOpen(false)}>메뉴 관리</Link>
                            <Link href="/admin/orders" onClick={() => setIsMobileMenuOpen(false)}>주문 관리</Link>
                            <Link href="/admin/settings" onClick={() => setIsMobileMenuOpen(false)}>설정</Link>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
