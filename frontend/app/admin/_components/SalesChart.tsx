'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from '../admin_premium.module.css';

// 1. Tooltip 타입 정의 (빨간 줄 해결)
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip} style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '12px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #F0F0F0',
        backdropFilter: 'blur(4px)'
      }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#767676', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4B3621', margin: 0 }}>
          ₩{(payload[0].value || 0).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

interface SalesData {
  time: string;
  sales: number;
}

export default function SalesChart() {
  const [chartData, setChartData] = useState<SalesData[]>([]);
  const [isMounted, setIsMounted] = useState(false); // 2. SSR 방지용 상태

  useEffect(() => {
    setIsMounted(true); // 마운트 완료 확인

    fetch('/api/admin/dashboard/sales-graph')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setChartData(data);
        }
      })
      .catch(err => console.error('Failed to fetch sales graph:', err));
  }, []);

  // 마운트되기 전에는 빈 공간만 보여주기 (에러 방지)
  if (!isMounted) {
    return <div className={styles.chartCard} style={{ height: '450px' }}></div>;
  }

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h3 className={styles.sectionTitle} style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4B3621', marginBottom: '0.4rem' }}>오늘의 매출 흐름</h3>
          <p style={{ fontSize: '0.85rem', color: '#999', margin: 0 }}>실시간 결제 데이터 기반 통계</p>
        </div>
        <div className={styles.liveBadge} style={{ background: '#4B362110', padding: '4px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', background: '#4B3621', borderRadius: '50%' }}></span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4B3621' }}>LIVE</span>
        </div>
      </div>

      {/* 3. 명시적인 높이 지정 (중요!) */}
      <div style={{ height: '320px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4B3621" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4B3621" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#A0A0A0' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#A0A0A0' }}
              tickFormatter={(value) => `${value / 10000}만`}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" // 'smooth'는 유효하지 않은 타입이므로 'monotone'으로 변경
              dataKey="sales"
              stroke="#4B3621"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}