'use client';

import React, { useState, useEffect } from 'react';
import styles from './orders.module.css';

interface OrderItem {
    id: number;
    menuId: number;
    menuName: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    userId: number | null;
    totalPrice: number;
    status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
    orderedAt: string;
    items: OrderItem[];
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/status?status=${newStatus}`, {
                method: 'PATCH'
            });
            if (res.ok) {
                fetchOrders(); // Refresh list
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('상태 변경에 실패했습니다.');
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return '주문 대기';
            case 'PREPARING': return '준비 중';
            case 'COMPLETED': return '완료';
            case 'CANCELLED': return '취소됨';
            default: return status;
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>주문 관리 (Order Management)</h1>
                <p className={styles.subtitle}>실시간 주문 현황을 확인하고 처리 상태를 관리합니다.</p>
            </header>

            {isLoading ? (
                <div className={styles.loading}>주문 내역을 불러오는 중...</div>
            ) : (
                <div className={styles.orderList}>
                    {orders.length === 0 ? (
                        <p className={styles.empty}>주문 내역이 없습니다.</p>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className={`${styles.orderCard} ${styles[order.status.toLowerCase()]}`}>
                                <div className={styles.orderHeader}>
                                    <div className={styles.orderMainInfo}>
                                        <span className={styles.orderId}>주문번호 #{order.id}</span>
                                        <span className={styles.orderTime}>{new Date(order.orderedAt).toLocaleString()}</span>
                                    </div>
                                    <div className={styles.orderStatusBadge}>
                                        {getStatusLabel(order.status)}
                                    </div>
                                </div>

                                <div className={styles.orderContent}>
                                    <ul className={styles.itemList}>
                                        {order.items.map(item => (
                                            <li key={item.id} className={styles.item}>
                                                <strong>{item.menuName}</strong>
                                                <span className={styles.itemCount}>{item.quantity}개</span>
                                                <span className={styles.itemPrice}>{item.price.toLocaleString()}원</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className={styles.orderFooter}>
                                    <div className={styles.totalPrice}>
                                        총 결제 금액: <strong>{order.totalPrice.toLocaleString()}원</strong>
                                    </div>
                                    <div className={styles.actions}>
                                        {order.status === 'PENDING' && (
                                            <button 
                                                className={styles.prepareBtn}
                                                onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                                            >
                                                준비 시작
                                            </button>
                                        )}
                                        {order.status === 'PREPARING' && (
                                            <button 
                                                className={styles.completeBtn}
                                                onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                                            >
                                                완료 처리
                                            </button>
                                        )}
                                        {(order.status === 'PENDING' || order.status === 'PREPARING') && (
                                            <button 
                                                className={styles.cancelBtn}
                                                onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                            >
                                                주문 취소
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
