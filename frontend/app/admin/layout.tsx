import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/session';
import AdminSidebar from './_components/AdminSidebar';
import AdminFooter from './_components/AdminFooter';
import AdminHeader from './_components/AdminHeader';
import styles from './layout.module.css';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session.user || (session.user.role !== 'ROLE_ADMIN' && session.user.role !== 'ADMIN')) {
        redirect('/');
    }

    return (
        <div className={styles.layout}>
            <AdminSidebar />
            <div className={styles.content}>
                <AdminHeader />
                <main className={styles.main}>
                    {children}
                </main>
                <AdminFooter />
            </div>
        </div>
    );
}
