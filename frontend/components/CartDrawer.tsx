import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';
import styles from './CartDrawer.module.css';

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
}

interface Cart {
    cartId: string;
    items: CartItem[];
    totalPrice: number;
}

const CartDrawer = () => {
    const router = useRouter();
    const { isOpen, closeCart, refreshTrigger, triggerRefresh } = useCartStore();
    const [cart, setCart] = useState<Cart | null>(null);

    const fetchCart = async () => {
        try {
            const cartId = localStorage.getItem('cartId');
            if (!cartId) {
                setCart(null);
                return;
            }

            const res = await fetch(`/api/v1/carts/${cartId}`);
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            } else if (res.status === 404) {
                setCart(null);
            }
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen, refreshTrigger]);

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        const cartId = localStorage.getItem('cartId');
        if (!cartId) return;

        try {
            const res = await fetch(`/api/v1/carts/${cartId}/items/${itemId}?quantity=${newQuantity}`, {
                method: 'PATCH'
            });
            if (res.ok) {
                const updatedCart = await res.json();
                setCart(updatedCart);
                triggerRefresh();
            }
        } catch (err) {
            console.error('Update quantity failed:', err);
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
                const updatedCart = await res.json();
                setCart(updatedCart);
                triggerRefresh();
            }
        } catch (err) {
            console.error('Remove item failed:', err);
        }
    };

    const handleClearCart = async () => {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) return;

        if (confirm('장바구니를 모두 비우시겠습니까?')) {
            try {
                const res = await fetch(`/api/v1/carts/${cartId}`, {
                    method: 'DELETE'
                });
                if (res.ok) {
                    setCart(null);
                    localStorage.removeItem('cartId');
                    triggerRefresh();
                    closeCart();
                }
            } catch (err) {
                console.error('Clear cart failed:', err);
            }
        }
    };

    const handlePlaceOrder = async () => {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) return;

        if (confirm('주문하시겠습니까?')) {
            try {
                const res = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cartId })
                });

                if (res.ok) {
                    alert('주문이 완료되었습니다. 감사합니다!');
                    setCart(null);
                    localStorage.removeItem('cartId');
                    triggerRefresh();
                    closeCart();
                    router.push('/menus');
                } else {
                    throw new Error('주문 실패');
                }
            } catch (err) {
                console.error('Order failed:', err);
                alert('주문 중 오류가 발생했습니다.');
            }
        }
    };

    const totalItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    // Item Option Text Builder
    const renderOptions = (options: Option[]) => {
        if (!options || options.length === 0) return null;
        return (
            <div className={styles.options}>
                {options.map((opt, idx) => (
                    <span key={idx} className={styles.optionTag}>
                        {opt.name}: {opt.value}{opt.price > 0 ? ` (+${opt.price.toLocaleString()}원)` : ''}
                    </span>
                ))}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className={styles.backdrop} onClick={closeCart}>
            <div 
                className={`${styles.drawer} ${isOpen ? styles.opened : ''}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <header className={styles.header}>
                    <div className={styles.headerTitle}>
                        <span className="material-icons" style={{ color: 'var(--color-primary-600)' }}>shopping_basket</span>
                        <h2>장바구니 <span>({totalItemsCount})</span></h2>
                    </div>
                    <button onClick={closeCart} className={styles.closeBtn}>
                        <span className="material-icons">close</span>
                    </button>
                </header>

                <main className={styles.content}>
                    {!cart || !cart.items || cart.items.length === 0 ? (
                        <div className={styles.emptyContainer}>
                            <div className={styles.emptyIcon}>
                                <span className="material-icons" style={{ fontSize: '3rem', color: '#ccc' }}>shopping_cart_checkout</span>
                            </div>
                            <p>장바구니가 비어 있습니다.</p>
                            <button className={styles.shopBtn} onClick={() => { closeCart(); router.push('/menus'); }}>
                                메뉴 보러가기
                            </button>
                        </div>
                    ) : (
                        <ul className={styles.itemList}>
                            {cart.items.map((item) => (
                                <li key={item.id} className={styles.itemCard}>
                                    <div className={styles.itemMain}>
                                        <div className={styles.itemInfo}>
                                            <h3 className={styles.itemName}>{item.menuName}</h3>
                                            {renderOptions(item.options)}
                                            <p className={styles.itemPrice}>
                                                {(item.basePrice * item.quantity).toLocaleString()}원
                                            </p>
                                        </div>
                                        <button 
                                            className={styles.itemRemoveBtn} 
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            <span className="material-icons">delete_outline</span>
                                        </button>
                                    </div>
                                    <div className={styles.itemFooter}>
                                        <div className={styles.quantity}>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <span className="material-icons" style={{ fontSize: '18px' }}>remove</span>
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                                                <span className="material-icons" style={{ fontSize: '18px' }}>add</span>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </main>

                {cart && cart.items && cart.items.length > 0 && (
                    <footer className={styles.footer}>
                        <div className={styles.summary}>
                            <div className={styles.totalRow}>
                                <span>합계</span>
                                <span className={styles.totalPrice}>{cart.totalPrice.toLocaleString()}원</span>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button className={styles.clearBtn} onClick={handleClearCart}>
                                비우기
                            </button>
                            <button className={styles.orderBtn} onClick={handlePlaceOrder}>
                                주문하기
                            </button>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
