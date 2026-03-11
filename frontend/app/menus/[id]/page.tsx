'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingCart, Info } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import styles from './page.module.css';

interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    imageSrc: string;
    images: string[];
    isAvailable: boolean;
    allergyInfo: string;
}

export default function MenuDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { openCart, triggerRefresh } = useCartStore();
    const [menu, setMenu] = useState<MenuDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = '/images/blank.png';
    };

    const getImageUrl = (src: string | undefined) => {
        if (!src || src === 'blank.png' || src.includes('blank.png')) return '/images/blank.png';
        return `/images/${src}`;
    };

    const handleAddToCart = async () => {
        if (!menu) return;
        
        setIsAdding(true);
        try {
            let cartId = localStorage.getItem('cartId');
            if (!cartId) {
                cartId = 'guest_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9);
                localStorage.setItem('cartId', cartId);
            }
            
            const mockOptions = [];
            if (menu.categoryName === '커피&음료' || menu.categoryName === '전통차') {
                mockOptions.push({ name: '옵션', value: '샷 추가', price: 500 });
            } else if (menu.categoryName === '디저트') {
                mockOptions.push({ name: '포장', value: '개별 포장', price: 0 });
            }

            const res = await fetch(`/api/v1/carts/${cartId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    menuId: Number(id),
                    menuName: menu.korName,
                    basePrice: menu.price,
                    quantity: 1,
                    options: mockOptions
                })
            });
            
            if (!res.ok) throw new Error('장바구니 추가 실패');
            
            triggerRefresh();
            openCart();
        } catch (err) {
            console.error(err);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsAdding(false);
        }
    };

    const handleOrderNow = async () => {
        if (!menu) return;
        
        if (!confirm('이 메뉴를 바로 주문하시겠습니까?')) return;

        setIsAdding(true);
        try {
            // 1. Add to cart first
            let cartId = localStorage.getItem('cartId');
            if (!cartId) {
                cartId = 'guest_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9);
                localStorage.setItem('cartId', cartId);
            }
            
            const mockOptions = [];
            if (menu.categoryName === '커피&음료' || menu.categoryName === '전통차') {
                mockOptions.push({ name: '옵션', value: '샷 추가', price: 500 });
            } else if (menu.categoryName === '디저트') {
                mockOptions.push({ name: '포장', value: '개별 포장', price: 0 });
            }

            const cartRes = await fetch(`/api/v1/carts/${cartId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    menuId: Number(id),
                    menuName: menu.korName,
                    basePrice: menu.price,
                    quantity: 1,
                    options: mockOptions
                })
            });
            
            if (!cartRes.ok) throw new Error('장바구니 추가 실패');

            // 2. Place order immediately
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId })
            });

            if (orderRes.ok) {
                alert('주문이 완료되었습니다!');
                localStorage.removeItem('cartId'); // Clear cart after order
                triggerRefresh();
                router.push('/menus');
            } else {
                throw new Error('주문 실패');
            }
        } catch (err) {
            console.error(err);
            alert('주문 중 오류가 발생했습니다.');
        } finally {
            setIsAdding(false);
        }
    };

    useEffect(() => {
        const fetchMenuDetail = async () => {
            try {
                const res = await fetch(`/api/menus/${id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setMenu(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchMenuDetail();
    }, [id]);

    if (isLoading) return <div className={styles.loading}>정보를 불러오는 중...</div>;
    if (!menu) return <div className={styles.error}>메뉴를 찾을 수 없습니다.</div>;

    const mainImageUrl = getImageUrl((menu.images && menu.images.length > 0) ? menu.images[0] : menu.imageSrc);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <ChevronLeft size={20} /> 돌아가기
                </button>

                <div className={styles.content}>
                    <div className={styles.imageSection}>
                        <div className={styles.mainImageWrapper}>
                            <img
                                src={mainImageUrl}
                                alt={menu.korName}
                                className={styles.mainImage}
                                onError={handleImageError}
                            />
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.badgeGroup}>
                            <div className={styles.badge}>{menu.categoryName}</div>
                            {!menu.isAvailable && <div className={styles.soldOutBadge}>품절</div>}
                        </div>
                        <h1 className={styles.title}>{menu.korName}</h1>
                        <p className={styles.engName}>{menu.engName}</p>

                        <div className={styles.divider}></div>

                        <p className={styles.description}>{menu.description}</p>

                        <div className={styles.priceSection}>
                            <span className={styles.priceLabel}>판매가</span>
                            <span className={styles.priceValue}>{menu.price.toLocaleString()}원</span>
                        </div>

                        <div className={styles.utils}>
                            <div className={styles.utilItem}>
                                <Info size={16} />
                                <span>알레르기 정보: {menu.allergyInfo || '매장 문의'}</span>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button 
                                className={styles.cartBtn} 
                                onClick={handleAddToCart}
                                disabled={isAdding || !menu.isAvailable}
                            >
                                <ShoppingCart size={20} /> {!menu.isAvailable ? '품절된 상품입니다' : (isAdding ? '담는 중...' : '장바구니 담기')}
                            </button>
                            {menu.isAvailable && (
                                <button 
                                    className={styles.orderBtn} 
                                    onClick={handleOrderNow}
                                    disabled={isAdding}
                                >
                                    {isAdding ? '처리 중...' : '바로 주문하기'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
