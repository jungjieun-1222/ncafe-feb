'use client';

import React from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { ShoppingBag, ClipboardList, Settings, Bell, X, Megaphone } from 'lucide-react';

const Navbar = () => {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { openCart, refreshTrigger } = useCartStore();
    const [cartCount, setCartCount] = React.useState(0);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const notificationRef = React.useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { settings } = useSettingsStore();
    const { markAsRead, checkIsRead } = useNotificationStore();
    const isRead = checkIsRead(settings?.announcement);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
    }, [refreshTrigger, isAuthenticated, user?.id]);

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem('cartId'); // 장바구니 ID 초기화
        toast.success('로그아웃 되었습니다.');
        router.push('/');
    };

    const handleToggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications && settings?.announcement) {
            markAsRead(settings.announcement);
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
                        <div className={styles.notificationWrapper} ref={notificationRef}>
                            <button 
                                onClick={handleToggleNotifications}
                                className={styles.notificationBtn}
                                title="공지사항"
                            >
                                <div style={{ position: 'relative' }}>
                                    <Bell size={20} />
                                    {!isRead && <span className={styles.notificationBadge} />}
                                </div>
                            </button>

                            {showNotifications && (
                                <div className={styles.notificationDropdown}>
                                    <div className={styles.dropdownHeader}>
                                        <span>🏮 서신함</span>
                                        <button className={styles.closeDropdownBtn} onClick={() => setShowNotifications(false)}>닫기</button>
                                    </div>
                                    <div className={styles.dropdownContent}>
                                        <div className={styles.announcementCard}>
                                            <div className={styles.announcementTitle}>
                                                <Megaphone size={16} />
                                                <span>새로운 소식</span>
                                            </div>
                                            <div className={styles.announcementBody}>
                                                {settings.announcement}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.dropdownFooter}>
                                        <span style={{ fontSize: '0.75rem', color: '#888' }}>월하선생 올림</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {isAuthenticated ? (
                        <>
                            {isAdmin ? (
                                <span className={styles.userInfo}>{user?.nickname || user?.name || user?.username} 관리자님 🏮</span>
                            ) : (
                                <Link href="/mypage" className={styles.userInfo}>{user?.nickname || user?.name || user?.username}나리 🏮</Link>
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
