'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if the current route is an admin route
    const isAdmin = pathname?.startsWith('/admin');

    // If it's an admin route, do not render Navbar, Footer, and the minHeight wrapper
    if (isAdmin) {
        return <>{children}</>;
    }

    // For non-admin routes, render the normal layout wrapper
    return (
        <>
            <Navbar />
            <main style={{ minHeight: 'calc(100vh - 180px)' }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
