import React from 'react';
import AdminSidebar from './_components/AdminSidebar';
import AdminFooter from './_components/AdminFooter';
import AdminHeader from './_components/AdminHeader';
import styles from './layout.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
