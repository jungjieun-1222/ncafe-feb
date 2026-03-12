'use client';

import React from 'react';
import { Banknote, ShoppingBag, CalendarCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from '../admin_premium.module.css';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change?: {
        value: string;
        isUp: boolean;
    };
    description: string;
}

const SummaryCard = ({ title, value, icon, change, description }: SummaryCardProps) => (
    <div className={styles.summaryCard}>
        <div className={styles.cardHeader}>
            <div className={styles.iconBox}>
                {icon}
            </div>
            {change && (
                <div className={`${styles.badge} ${change.isUp ? styles.badgeUp : styles.badgeDown}`}>
                    {change.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {change.value}
                </div>
            )}
        </div>
        <div>
            <p className={styles.cardLabel}>{title}</p>
            <h3 className={styles.cardValue}>{value}</h3>
            <p className={styles.cardDesc}>{description}</p>
        </div>
    </div>
);

interface DashboardSummaryData {
    totalSales: number;
    orderCount: number;
    reservationCount: number;
    popularMenu: string;
}

export default function DashboardSummary() {
    const [summary, setSummary] = React.useState<DashboardSummaryData>({
        totalSales: 0,
        orderCount: 0,
        reservationCount: 0,
        popularMenu: '-'
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/admin/dashboard/summary')
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                // Ensure data has expected fields
                if (data && typeof data.totalSales !== 'undefined') {
                    setSummary(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch summary:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className={styles.summaryGrid}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={styles.skeletonCard}></div>
                ))}
            </div>
        );
    }

    const summaryData = [
        {
            title: "오늘 총 매출",
            value: `₩${(summary.totalSales || 0).toLocaleString()}`,
            icon: <Banknote size={24} />,
            change: { value: "12.5%", isUp: true },
            description: "실시간 결제 합계"
        },
        {
            title: "오늘 주문 건수",
            value: `${summary.orderCount || 0}건`,
            icon: <ShoppingBag size={24} />,
            change: { value: "5.2%", isUp: true },
            description: "현재 주문 처리량"
        },
        {
            title: "신규 예약 건수",
            value: `${summary.reservationCount || 0}건`,
            icon: <CalendarCheck size={24} />,
            change: { value: "2.1%", isUp: false },
            description: "오늘 접수된 예약"
        },
        {
            title: "인기 메뉴",
            value: summary.popularMenu || '-',
            icon: <TrendingUp size={24} />,
            description: "가장 많이 주문된 메뉴"
        }
    ];

    return (
        <div className={styles.summaryGrid}>
            {summaryData.map((data, index) => (
                <SummaryCard 
                    key={index}
                    title={data.title}
                    value={data.value}
                    icon={data.icon}
                    change={data.change}
                    description={data.description}
                />
            ))}
        </div>
    );
}
