'use client';

import React from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCartStore } from '@/stores/useCartStore';
import { ShoppingBag, ClipboardList, Settings, Bell } from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';

const Navbar = () => {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { openCart, refreshTrigger } = useCartStore();
    const [cartCount, setCartCount] = React.useState(0);
    const router = useRouter();

    React.useEffect(() => {
        const fetchCartCount = async () => {
            let cartId = localStorage.getItem('cartId');
            if (!cartId) {
                setCartCount(0);
                return;
            }
            
            // Sanitization: Remove any trailing info like :1
            if (cartId.includes(':')) {
                cartId = cartId.split(':')[0];
                localStorage.setItem('cartId', cartId);
            }

            try {
                const res = await fetch(`/api/v1/carts/${cartId}`);
                if (res.ok) {
                    const data = await res.json();
                    const count = data.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
                    setCartCount(count);
                } else {
                    setCartCount(0);
                }
            } catch (err) {
                setCartCount(0);
            }
        };
        fetchCartCount();
    }, [refreshTrigger]);

    const { settings } = useSettingsStore();

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('cartId'); // 장바구니 ID 초기화
        toast.success('로그아웃 되었습니다.');
        router.push('/');
    };

    const handleShowAnnouncement = () => {
        if (settings?.announcement) {
            toast(settings.announcement, {
                icon: '📢',
                duration: 5000,
                style: {
                    background: 'var(--k-clay)',
                    color: '#F7F3EE',
                    border: '1px solid var(--k-gold)',
                    fontFamily: 'var(--font-myeongjo)'
                }
            });
        }
    };

    const isAdmin = user?.role?.includes('ADMIN') || user?.role?.includes('MASTER') || user?.role?.includes('STAFF');

    return (
        <nav className={styles.nav}>
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
                            {isAuthenticated ? (
                                <Link href="/mypage" className={`${styles.actionLink} ${pathname === '/mypage' ? styles.activeAction : ''}`}>
                                    <ClipboardList size={20} />
                                    <span>나의 이용기록</span>
                                </Link>
                            ) : (
                                <Link href="/orders" className={`${styles.actionLink} ${pathname === '/orders' ? styles.activeAction : ''}`}>
                                    <ClipboardList size={20} />
                                    <span>주문 내역</span>
                                </Link>
                            )}
                            <button 
                                onClick={openCart} 
                                className={styles.cartActionBtn}
                            >
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <ShoppingBag size={20} />
                                    {cartCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            right: '-8px',
                                            background: 'var(--k-crimson)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            fontSize: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            border: '2px solid var(--k-clay)'
                                        }}>
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                                <span style={{ marginLeft: cartCount > 0 ? '8px' : '0' }}>장바구니</span>
                            </button>
                        </>
                    )}
                </div>

                <div className={styles.actions}>
                    {settings?.announcement && (
                        <button 
                            onClick={handleShowAnnouncement}
                            className={styles.notificationBtn}
                            title="공지사항"
                        >
                            <div style={{ position: 'relative' }}>
                                <Bell size={20} />
                                <span className={styles.notificationBadge} />
                            </div>
                        </button>
                    )}
                    {isAuthenticated ? (
                        <>
                            {isAdmin ? (
                                <span className={styles.userInfo}>{user?.username} 관리자님 🏮</span>
                            ) : (
                                <Link href="/mypage" className={styles.userInfo}>{user?.username} 나리 🏮</Link>
                            )}
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
                    {!isAdmin && (
                        <Link
                            href="/reservations"
                            className={styles.reserveBtn}
                        >
                            자리 예약
                        </Link>
                    )}
                </div>
            </div>
            <div className={styles.patternLine}>
                <div className={styles.dancheongPattern}></div>
            </div>
        </nav>
    );
};

export default Navbar;
