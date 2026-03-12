'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin_reservations.module.css';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Reservation {
    id: number;
    userId: number;
    guestName: string;
    guestPhone: string;
    reserveDate: string;
    reserveTime: string;
    guestCount: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    createdAt: string;
}

export default function AdminReservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const { user } = useAuthStore();
    const isAdmin = user?.role === 'ROLE_ADMIN';
    const router = useRouter();

    useEffect(() => {
        if (!isAdmin) {
            router.push('/');
            return;
        }
        fetchReservations();
    }, [isAdmin]);

    const fetchReservations = async () => {
        try {
            const res = await fetch('/api/reservations');
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            }
        } catch (error) {
            console.error('Fetch reservations error:', error);
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/reservations/${id}/status?status=${status}`, {
                method: 'PATCH'
            });
            if (res.ok) {
                toast.success(`예약 상태가 ${status === 'CONFIRMED' ? '확정' : '취소'}되었습니다.`);
                fetchReservations();
            } else {
                toast.error('상태 변경에 실패했습니다.');
            }
        } catch (error) {
            toast.error('오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>예약 관리 대시보드</h1>
                <button onClick={fetchReservations} className={styles.actionBtn}>새로고침</button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>예약자</th>
                            <th>연락처</th>
                            <th>날짜</th>
                            <th>시간</th>
                            <th>인원</th>
                            <th>상태</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.length > 0 ? (
                            reservations.map(res => (
                                <tr key={res.id}>
                                    <td>{res.id}</td>
                                    <td>{res.guestName}</td>
                                    <td>{res.guestPhone}</td>
                                    <td>{res.reserveDate}</td>
                                    <td>{res.reserveTime.substring(0, 5)}</td>
                                    <td>{res.guestCount}명</td>
                                    <td>
                                        <span className={`${styles.status} ${styles[res.status.toLowerCase()]}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        {res.status === 'PENDING' && (
                                            <>
                                                <button 
                                                    onClick={() => handleStatusUpdate(res.id, 'CONFIRMED')}
                                                    className={`${styles.actionBtn} ${styles.confirmBtn}`}
                                                >
                                                    승인
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(res.id, 'CANCELLED')}
                                                    className={`${styles.actionBtn} ${styles.cancelBtn}`}
                                                >
                                                    거절
                                                </button>
                                            </>
                                        )}
                                        {res.status === 'CONFIRMED' && (
                                            <button 
                                                onClick={() => handleStatusUpdate(res.id, 'CANCELLED')}
                                                className={`${styles.actionBtn} ${styles.cancelBtn}`}
                                            >
                                                취소 처리
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} style={{textAlign: 'center', padding: '40px'}}>예약 내역이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
