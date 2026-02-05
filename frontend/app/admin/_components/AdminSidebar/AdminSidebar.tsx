'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Coffee, ClipboardList, Settings } from 'lucide-react';
import styles from './AdminSidebar.module.css';

const navItems = [
    {
        group: '메뉴',
        items: [
            { href: '/admin', label: '대시보드', icon: LayoutDashboard },
            { href: '/admin/menus', label: '메뉴 관리', icon: Coffee },
            { href: '/admin/orders', label: '주문 관리', icon: ClipboardList },
        ],
    },
    {
        group: '설정',
        items: [
            { href: '/admin/settings', label: '설정', icon: Settings },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span className={styles.logoText}>☕ NCafe</span>
            </div>

            <nav className={styles.nav}>
                {navItems.map((group) => (
                    <div key={group.group} className={styles.navGroup}>
                        <div className={styles.navGroupLabel}>{group.group}</div>
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.navItem} ${isActive(item.href) ? styles.navItemActive : ''}`}
                                >
                                    <Icon className={styles.navIcon} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className={styles.footer}>
                <div className={styles.cafeInfo}>
                    <div className={styles.cafeAvatar}>M</div>
                    <div>
                        <div className={styles.cafeName}>마이카페</div>
                        <div className={styles.cafeRole}>사장님</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
