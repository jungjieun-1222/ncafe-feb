'use client';

import PageHeader from './menus/_components/MenuList/PageHeader';
import Link from 'next/link';
import { Coffee, Database, Calendar, ClipboardList } from 'lucide-react';
import DashboardSummary from './_components/DashboardSummary';
import SalesChart from './_components/SalesChart';
import styles from './admin_premium.module.css';

export default function AdminDashboard() {
    return (
        <div className={styles.dashboardContainer}>
            {/* Header Section */}
            <div className={`${styles.maxContainer} ${styles.header}`}>
                <h1 className={styles.title}>카페 관리 대시보드</h1>
                <p className={styles.subtitle}>관리자님, 오늘 하루의 운영 현황을 한눈에 살펴보세요.</p>
            </div>

            <div className={styles.maxContainer}>
                {/* Summary Cards */}
                <DashboardSummary />

                {/* Main Content Grid */}
                <div className={styles.mainLayout}>
                    {/* Sales Flow Chart */}
                    <SalesChart />

                    {/* Quick Access Services */}
                    <div className={styles.quickMenuSection}>
                        <h2 className={styles.sectionTitle}>서비스 퀵 메뉴</h2>

                        <div className={styles.menuList}>
                            {[
                                { href: "/admin/menus", title: "메뉴 관리", icon: <Coffee size={24} />, desc: "차림표 항목 및 품절 상태 관리" },
                                { href: "/admin/knowledge", title: "지식 관리 (RAG)", icon: <Database size={24} />, desc: "챗봇 답변 근거 데이터 최적화" },
                                { href: "/admin/reservations", title: "공간 예약 관리", icon: <Calendar size={24} />, desc: "고객 자리 예약 현황 및 승인" },
                                { href: "/admin/orders", title: "주문 내역 관리", icon: <ClipboardList size={24} />, desc: "실시간 조리 상태 및 결제 확인" },
                            ].map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className={styles.menuItem}
                                >
                                    <div className={styles.smallIconBox}>
                                        {item.icon}
                                    </div>
                                    <div className={styles.menuText}>
                                        <h3 className={styles.menuTitle}>{item.title}</h3>
                                        <p className={styles.menuDesc}>{item.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
