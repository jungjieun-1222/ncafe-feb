'use client';

import React, { useState, useEffect } from 'react';
import styles from './mypage.module.css';
import { useAuthStore } from '@/stores/useAuthStore';
import { 
    Calendar, 
    Clock, 
    ShoppingBag, 
    History, 
    User, 
    MapPin, 
    CreditCard, 
    ChefHat,
    ChevronRight,
    SearchX,
    XCircle
} from 'lucide-react';
import { fetchAPI } from '@/app/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';
import { authAPI } from '@/app/lib/api';

type TabType = 'reservation' | 'cart' | 'order';

export default function MyPage() {
    const { user, isAuthenticated, logout, isLoading: isAuthLoading } = useAuthStore();
    const { refreshTrigger } = useCartStore();
    const [activeTab, setActiveTab] = useState<TabType>('reservation');
    const [reservations, setReservations] = useState<any[]>([]);
    const [cart, setCart] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push('/login?redirect=/mypage');
        }
    }, [isAuthenticated, isAuthLoading, router]);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchAllData();
        }
    }, [isAuthenticated, user, refreshTrigger]);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchReservations(),
                fetchCart(),
                fetchOrders()
            ]);
        } catch (error) {
            console.error('Failed to fetch mypage data:', error);
            toast.error('데이터를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReservations = async () => {
        const data = await fetchAPI(`/reservations?userId=${user?.id}`);
        if (data) setReservations(data);
    };

    const fetchCart = async () => {
        const cartId = localStorage.getItem('cartId') || `user-${user?.id}`;
        try {
            const data = await fetchAPI(`/v1/carts/${cartId}`);
            setCart(data || { items: [], totalPrice: 0 });
        } catch (error) {
            setCart({ items: [], totalPrice: 0 });
        }
    };

    const fetchOrders = async () => {
        const data = await fetchAPI(`/orders/user/${user?.id}`);
        if (data) setOrders(data);
    };

    const handleCancelReservation = async (reservationId: number) => {
        if (!confirm('정말로 예약을 취소하고 기록을 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/reservations/${reservationId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('예약 기록이 삭제되었습니다.');
                // Remove from local state immediately
                setReservations(prev => prev.filter(res => res.id !== reservationId));
            } else {
                toast.error('삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('네트워크 오류가 발생했습니다.');
        }
    };

    const handlePlaceOrder = async () => {
        if (!cart || !cart.items || cart.items.length === 0) return;
        
        try {
            const res = await fetchAPI('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    userId: user?.id,
                    cartId: cart.cartId,
                    paymentMethod: 'CARD', // Default
                    requestMessage: '맛있게 부탁드립니다!'
                })
            });
            
            if (res && res.approvalNumber) {
                toast.success('주문이 완료되었습니다!');
                const { triggerRefresh } = useCartStore.getState();
                triggerRefresh(); // Sync other components like Navbar
                setActiveTab('order');
                fetchAllData();
            }
        } catch (error) {
            toast.error('주문에 실패했습니다.');
        }
    };

    const handleWithdraw = async () => {
        const confirmed = window.confirm('정말로 탈퇴하시겠습니까? 모든 기록이 삭제됩니다.');
        if (!confirmed) return;

        const password = window.prompt('보안을 위해 비밀번호를 다시 한 번 입력해주세요.');
        if (!password) return;

        try {
            await authAPI.withdraw(password);
            toast.success('회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.');
            await logout();
            router.push('/');
        } catch (error: any) {
            toast.error(error.message || '탈퇴 처리 중 오류가 발생했습니다.');
        }
    };

    if (isAuthLoading || (isLoading && reservations.length === 0 && !cart && orders.length === 0)) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.greeting}>
                    {user?.nickname || user?.name || user?.username}나리, 어서오세요! 🏮
                </div>
                <div className={styles.subGreeting}>
                    나리의 발걸음이 머무는 곳, 엔카페에서의 기록입니다.
                </div>
            </header>

            <nav className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${activeTab === 'reservation' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('reservation')}
                >
                    <Calendar size={20} /> 예약 내역
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'cart' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('cart')}
                >
                    <ShoppingBag size={20} /> 장바구니
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'order' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('order')}
                >
                    <History size={20} /> 주문 내역
                </button>
            </nav>

            <main>
                {activeTab === 'reservation' && (
                    <section>
                        <h2 className={styles.sectionTitle}>나의 자리 예약</h2>
                        {reservations.length > 0 ? (
                            <div className={styles.grid}>
                                {reservations.map((res: any) => (
                                    <div key={res.id} className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.cardTitle}>한옥 카페 자리 예약</div>
                                            <span className={`${styles.badge} ${styles['status_' + res.status]}`}>
                                                {res.status === 'PENDING' ? '승인 대기' : 
                                                 res.status === 'CONFIRMED' ? '예약 확정' : 
                                                 res.status === 'CANCELLED' ? '취소됨' : '이용 완료'}
                                            </span>
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <div className={styles.infoItem}>
                                                <Calendar size={16} /> {res.reserveDate}
                                            </div>
                                            <div className={styles.infoItem}>
                                                <Clock size={16} /> {res.reserveTime.substring(0, 5)}
                                            </div>
                                            <div className={styles.infoItem}>
                                                <ChefHat size={16} /> {res.guestCount}인 방문 예정
                                            </div>
                                             <div className={styles.infoItem}>
                                                <MapPin size={16} /> 대청마루 혹은 정원석 (방문 시 안내)
                                            </div>
                                        </div>
                                        {res.status !== 'CANCELLED' && res.status !== 'COMPLETED' && (
                                            <button 
                                                className={styles.cancelBtn} 
                                                onClick={() => handleCancelReservation(res.id)}
                                            >
                                                <XCircle size={16} /> 예약 취소
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState 
                                text="현재 예약된 내역이 없습니다." 
                                ctaText="고즈넉한 자리 예약하러 가기" 
                                href="/reservations" 
                            />
                        )}
                    </section>
                )}

                {activeTab === 'cart' && (
                    <section>
                        <h2 className={styles.sectionTitle}>계산대에 올린 메뉴</h2>
                        {cart && cart.items && cart.items.length > 0 ? (
                            <div className={styles.card}>
                                <div className={styles.grid}>
                                    {cart.items.map((item: any) => (
                                        <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid #f5f5f5'}}>
                                            <div>
                                                <div style={{fontWeight: 700}}>{item.menuName}</div>
                                                <div style={{fontSize: '0.8rem', color: '#888'}}>{item.quantity}개 / {item.options?.map((o: any) => o.value).join(', ')}</div>
                                            </div>
                                            <div style={{fontWeight: 600}}>{(item.totalPrice).toLocaleString()}원</div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.cartFooter}>
                                    <div>
                                        <div style={{fontSize: '0.9rem', color: '#666'}}>총 결제 금액</div>
                                        <div className={styles.totalPrice}>{(cart.totalPrice).toLocaleString()}원</div>
                                    </div>
                                    <button className={styles.orderBtn} onClick={handlePlaceOrder}>
                                        주문하기
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <EmptyState 
                                text="장바구니가 비어 있습니다." 
                                ctaText="차림표 보러 가기" 
                                href="/menus" 
                            />
                        )}
                    </section>
                )}

                {activeTab === 'order' && (
                    <section>
                        <h2 className={styles.sectionTitle}>지나간 주문 기록</h2>
                        {orders.length > 0 ? (
                            <div className={styles.grid}>
                                {orders.map((order: any) => (
                                    <div key={order.id} className={styles.card}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.cardTitle}>주문 번호: {order.approvalNumber}</div>
                                            <span className={`${styles.badge} ${styles['status_' + order.status]}`}>
                                                {order.status === 'COMPLETED' ? '준비 완료' : 
                                                 order.status === 'PREPARING' ? '준비 중' : 
                                                 order.status === 'PENDING' ? '주문 접수' : '취소됨'}
                                            </span>
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <div className={styles.infoItem}>
                                                <CreditCard size={16} /> {order.totalPrice.toLocaleString()}원 ({order.paymentMethod})
                                            </div>
                                            <div className={styles.infoItem}>
                                                <Clock size={16} /> {new Date(order.orderedAt).toLocaleString()}
                                            </div>
                                            <div className={styles.infoItem} style={{marginTop: '0.5rem', fontWeight: 600, color: '#4e342e'}}>
                                                <ChevronRight size={16} /> {order.items?.[0]?.menuName} {order.items?.length > 1 ? `외 ${order.items.length - 1}건` : ''}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState 
                                text="아직 주문하신 기록이 없습니다." 
                                ctaText="첫 주문 하러 가기" 
                                href="/menus" 
                            />
                        )}
                    </section>
                )}
            </main>

            <footer className={styles.dangerZone}>
                <h3 className={styles.dangerTitle}>계정 관리</h3>
                <p className={styles.dangerDesc}>탈퇴 시 모든 예약 및 주문 기록이 영구적으로 삭제되며 복구할 수 없습니다.</p>
                <button className={styles.withdrawBtn} onClick={handleWithdraw}>
                    회원 탈퇴하기
                </button>
            </footer>
        </div>
    );
}

function EmptyState({ text, ctaText, href }: { text: string, ctaText: string, href: string }) {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
                <SearchX size={48} />
            </div>
            <p className={styles.emptyText}>{text}</p>
            <Link href={href} className={styles.ctaLink}>
                {ctaText}
            </Link>
        </div>
    );
}
