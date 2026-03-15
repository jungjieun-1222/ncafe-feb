'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Coffee, ClipboardList, Settings, LibraryBig, Store, ShieldCheck, Users } from 'lucide-react';
import styles from './AdminSidebar.module.css';
import { SessionUser } from '@/app/lib/session';

const navItems = [
    {
        group: '메뉴 및 서비스',
        items: [
            { href: '/admin', label: '대시보드', icon: LayoutDashboard, roles: ['MASTER'] },
            { href: '/admin/menus', label: '메뉴 관리', icon: Coffee, roles: ['MASTER'] },
            { href: '/admin/orders', label: '주문 관리', icon: ClipboardList, roles: ['MASTER', 'STAFF'] },
            { href: '/admin/knowledge', label: '지식 관리 (RAG)', icon: LibraryBig, roles: ['MASTER'] },
        ],
    },
    {
        group: '설정',
        items: [
            { href: '/admin/settings/store', label: '운영 정보 관리', icon: Store, roles: ['MASTER'] },
            { href: '/admin/settings/policy', label: '서비스 정책 설정', icon: ShieldCheck, roles: ['MASTER'] },
            { href: '/admin/settings/accounts', label: '사용자 및 권한 관리', icon: Users, roles: ['MASTER'] },
        ],
    },
];

interface AdminSidebarProps {
    user: SessionUser;
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className={styles.sidebar}>
            <Link href="/" className={styles.logo}>
                <span className={styles.logoIcon}>🍵</span>
                <span className={`${styles.logoText} calligraphy`}>엔카페</span>
            </Link>

            <nav className={styles.nav}>
                {navItems.map((group) => {
                    const visibleItems = group.items.filter(item => 
                        item.roles.some(role => user.role.includes(role))
                    );

                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={group.group} className={styles.navGroup}>
                            <div className={styles.navGroupLabel}>{group.group}</div>
                            {visibleItems.map((item) => {
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
                    );
                })}
            </nav>

        </aside>
    );
}
