'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Trash2, Plus, Minus } from 'lucide-react';
import styles from './page.module.css';

interface CartItem {
    id: string;
    menuId: number;
    menuName: string;
    basePrice: number;
    quantity: number;
    options: any[]; // Adjust type if needed
}

interface Cart {
    cartId: string;
    items: CartItem[];
    totalPrice: number;
}

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const cartId = localStorage.getItem('cartId');
            if (!cartId) {
                setIsLoading(false);
                return;
            }

            const res = await fetch(`/api/v1/carts/${cartId}`);
            if (!res.ok) {
                if (res.status === 404) {
                    setCart(null);
                } else {
                    throw new Error('Failed to fetch cart');
                }
            } else {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        const cartId = localStorage.getItem('cartId');
        if (!cartId) return;

        try {
            const res = await fetch(`/api/v1/carts/${cartId}/items/${itemId}?quantity=${newQuantity}`, {
                method: 'PATCH'
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) return;

        try {
            const res = await fetch(`/api/v1/carts/${cartId}/items/${itemId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleClearCart = async () => {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) return;

        try {
            const res = await fetch(`/api/v1/carts/${cartId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setCart(null);
                localStorage.removeItem('cartId');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <div className={styles.loading}>장바구니 불러오는 중...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <ChevronLeft size={24} />
                </button>
                <h1 className={styles.title}>장바구니</h1>
                <div style={{ width: 40 }} /> {/* for flex centering */}
            </header>

            <main className={styles.main}>
                {!cart || !cart.items || cart.items.length === 0 ? (
                    <div className={styles.emptyCart}>
                        <p>장바구니가 비어 있습니다.</p>
                        <button className={styles.continueBtn} onClick={() => router.push('/menus')}>
                            메뉴 담으러 가기
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.cartList}>
                            {cart.items.map(item => (
                                <div key={item.id} className={styles.cartItem}>
                                    <div className={styles.itemInfo}>
                                        <h3 className={styles.itemName}>{item.menuName}</h3>
                                        <p className={styles.itemPrice}>{item.basePrice.toLocaleString()}원</p>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <div className={styles.quantityControl}>
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                                <Minus size={16} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <button className={styles.removeBtn} onClick={() => handleRemoveItem(item.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.summary}>
                            <div className={styles.summaryRow}>
                                <span>총 결제금액</span>
                                <span className={styles.totalAmount}>{cart.totalPrice?.toLocaleString()}원</span>
                            </div>
                        </div>

                        <div className={styles.checkoutActions}>
                            <button className={styles.clearBtn} onClick={handleClearCart}>
                                전체 비우기
                            </button>
                            <button className={styles.checkoutBtn} onClick={() => alert('주문 기능은 준비 중입니다.')}>
                                주문하기
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
