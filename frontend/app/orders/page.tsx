'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
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
    totalPrice: number;
    status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
    orderedAt: string;
    items: OrderItem[];
}

export default function UserOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMyOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else {
                console.error('Failed to fetch orders:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const handleCancelOrder = async (orderId: number) => {
        if (!confirm('정말로 주문을 취소하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/orders/${orderId}/status?status=CANCELLED`, {
                method: 'PATCH'
            });
            if (res.ok) {
                alert('주문이 취소되었습니다.');
                fetchMyOrders(); // Refresh orders after cancellation
            } else {
                const errorData = await res.json();
                alert(`주문 취소에 실패했습니다: ${errorData.message || res.statusText}`);
            }
        } catch (error) {
            console.error('Cancel order failed:', error);
            alert('오류가 발생했습니다.');
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return '주문접수 중';
            case 'PREPARING': return '메뉴 준비 중';
            case 'COMPLETED': return '준비 완료 (수령 가능)';
            case 'CANCELLED': return '주문 취소됨';
            default: return status;
        }
    };

    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>내 주문 내역</h1>
                    <p className={styles.subtitle}>최근 주문하신 내역과 준비 현황을 확인할 수 있습니다.</p>
                </header>

                {isLoading ? (
                    <div className={styles.loading}>주문 내역을 동기화 중입니다...</div>
                ) : (
                    <div className={styles.orderList}>
                        {orders.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>주문 내역이 아직 없습니다.</p>
                                <button className={styles.shopBtn} onClick={() => window.location.href = '/menus'}>
                                    메뉴 주문하러 가기
                                </button>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className={styles.orderCard}>
                                    <div className={styles.orderTop}>
                                        <div className={styles.idGroup}>
                                            <span className={styles.orderId}>주문번호: {order.id}</span>
                                            <span className={styles.orderTime}>{new Date(order.orderedAt).toLocaleString()}</span>
                                        </div>
                                        <div className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                                            {getStatusLabel(order.status)}
                                        </div>
                                    </div>
                                    
                                    <div className={styles.orderItems}>
                                        {order.items.map(item => (
                                            <div key={item.id} className={styles.itemRow}>
                                                <div className={styles.itemInfo}>
                                                    <span className={styles.itemName}>{item.menuName}</span>
                                                    <span className={styles.itemQty}>x {item.quantity}</span>
                                                </div>
                                                <span className={styles.itemPrice}>{item.price.toLocaleString()}원</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.orderBottom}>
                                        <div className={styles.totalInfo}>
                                            <span>총 결제금액</span>
                                            <span className={styles.totalPrice}>{order.totalPrice.toLocaleString()}원</span>
                                        </div>
                                        {order.status === 'PENDING' && (
                                            <button 
                                                className={styles.cancelBtn}
                                                onClick={() => handleCancelOrder(order.id)}
                                            >
                                                주문 취소하기
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
