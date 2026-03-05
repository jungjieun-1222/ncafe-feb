'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ChevronLeft, ShoppingCart, Info } from 'lucide-react';
import styles from './page.module.css';

interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    imageSrc: string;
    isAvailable: boolean;
    allergyInfo: string;
}

export default function MenuDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [menu, setMenu] = useState<MenuDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <button onClick={() => router.back()} className={styles.backBtn}>
                    <ChevronLeft size={20} /> 돌아가기
                </button>

                <div className={styles.content}>
                    <div className={styles.imageSection}>
                        <img
                            src={menu.imageSrc && !menu.imageSrc.includes('blank') ? `/images/${menu.imageSrc}` : 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=800&auto=format&fit=crop'}
                            alt={menu.korName}
                            className={styles.mainImage}
                        />
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.badge}>{menu.categoryName}</div>
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
                            <button className={styles.cartBtn} onClick={() => alert('장바구니 기능은 준비 중입니다.')}>
                                <ShoppingCart size={20} /> 장바구니 담기
                            </button>
                            <button className={styles.orderBtn} onClick={() => alert('바로 주문 기능은 준비 중입니다.')}>
                                바로 주문하기
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
