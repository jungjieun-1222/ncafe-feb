'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Wallet, Smartphone, ChevronLeft, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './page.module.css';

interface Option {
    name: string;
    value: string;
    price: number;
}

interface CartItem {
    id: string;
    menuId: number;
    menuName: string;
    basePrice: number;
    quantity: number;
    options: Option[];
    totalPrice: number;
}

interface Cart {
    cartId: string;
    items: CartItem[];
    totalPrice: number;
}

type PaymentMethod = 'CARD' | 'KAKAO' | 'NAVER';

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');
    const [requestNote, setRequestNote] = useState('');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cartId = localStorage.getItem('cartId');
                if (!cartId) {
                    setIsLoading(false);
                    return;
                }
                const res = await fetch(`/api/v1/carts/${cartId}`);
                if (res.ok) {
                    const data = await res.json();
                    setCart(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCart();
    }, []);

    const { user } = useAuthStore();

    const handlePayment = async () => {
        setIsProcessing(true);

        // Virtual processing for 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Finalize order (Real order creation would happen here)
        try {
            const cartId = localStorage.getItem('cartId');
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    cartId,
                    paymentMethod,
                    requestMessage: requestNote,
                    totalPrice: cart?.totalPrice
                })
            });

            if (res.ok) {
                const data = await res.json();
                
                // Do NOT remove cartId! The backend clears the items, 
                // but we need the ID to show the order history.
                
                // Use the approval number from the backend
                const approvalNum = data.approvalNumber;

                router.push(`/checkout/success?approvalNumber=${approvalNum}`);
            } else {
                alert('결제 처리 중 오류가 발생했습니다.');
                setIsProcessing(false);
            }
        } catch (err) {
            console.error(err);
            alert('네트워크 오류가 발생했습니다.');
            setIsProcessing(false);
        }
    };

    if (isLoading) return <div className={styles.overlay}><div className={styles.spinner}></div></div>;

    if (!cart || cart.items.length === 0) {
        return (
            <div className={styles.container}>
                <main className={styles.main}>
                    <div className={styles.empty}>
                        <p>장바구니가 비어 있어 결제할 항목이 없습니다.</p>
                        <button onClick={() => router.push('/menus')} className={styles.payBtn} style={{ marginTop: '20px' }}>
                            메뉴 선택하러 가기
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {isProcessing && (
                <div className={styles.overlay}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>결제 처리 중입니다...</p>
                </div>
            )}

            <main className={styles.main}>
                <button onClick={() => router.back()} className={styles.backBtn} style={{ background: 'none', border: 'none', color: '#8b5e3c', cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <ChevronLeft size={20} /> 뒤로가기
                </button>

                <h1 className={styles.title}>주문 및 결제</h1>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>주문 요약</h2>
                    <div className={styles.itemList}>
                        {cart.items.map((item) => (
                            <div key={item.id} className={styles.itemRow}>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemName}>{item.menuName} x {item.quantity}</span>
                                    {item.options && item.options.length > 0 && (
                                        <span className={styles.itemOptions}>
                                            {item.options.map(o => `${o.name}: ${o.value}`).join(' / ')}
                                        </span>
                                    )}
                                </div>
                                <span className={styles.itemPrice}>
                                    {((item.basePrice + item.options.reduce((s, o) => s + (o.price || 0), 0)) * item.quantity).toLocaleString()}원
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>결제 수단</h2>
                    <div className={styles.methodGroup}>
                        <div
                            className={`${styles.methodCard} ${paymentMethod === 'CARD' ? styles.selectedMethod : ''}`}
                            onClick={() => setPaymentMethod('CARD')}
                        >
                            <CreditCard size={28} />
                            <span className={styles.methodLabel}>신용/체크카드</span>
                        </div>
                        <div
                            className={`${styles.methodCard} ${paymentMethod === 'KAKAO' ? styles.selectedMethod : ''}`}
                            onClick={() => setPaymentMethod('KAKAO')}
                        >
                            <Wallet size={28} />
                            <span className={styles.methodLabel}>카카오페이</span>
                        </div>
                        <div
                            className={`${styles.methodCard} ${paymentMethod === 'NAVER' ? styles.selectedMethod : ''}`}
                            onClick={() => setPaymentMethod('NAVER')}
                        >
                            <Smartphone size={28} />
                            <span className={styles.methodLabel}>네이버페이</span>
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>요청 사항</h2>
                    <textarea
                        className={styles.textarea}
                        placeholder="요청 사항을 입력해 주세요. (예: 덜 달게 해주세요, 박스 포장 신경 써주세요 등)"
                        value={requestNote}
                        onChange={(e) => setRequestNote(e.target.value)}
                    />
                </section>
            </main>

            <footer className={styles.bottomBar}>
                <div className={styles.bottomBarContent}>
                    <div className={styles.totalBox}>
                        <span className={styles.totalLabel}>총 결제 금액</span>
                        <span className={styles.totalAmount}>{cart.totalPrice.toLocaleString()}원</span>
                    </div>
                    <button
                        className={styles.payBtn}
                        onClick={handlePayment}
                        disabled={isProcessing}
                    >
                        {cart.totalPrice.toLocaleString()}원 결제하기
                    </button>
                </div>
            </footer>
        </div>
    );
}
