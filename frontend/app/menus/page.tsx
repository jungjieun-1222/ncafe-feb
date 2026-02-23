'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

interface Menu {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    imageSrc: string;
    isAvailable: boolean;
}

export default function UserMenuPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const res = await fetch('/api/menus'); // Next.js rewrite redirects to backend /menus
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                // UserMenuController returns List<UserMenuWebModel>, which is a plain array
                setMenus(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenus();
    }, []);

    return (
        <div className={styles.container}>
            <Navbar />
            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>차림표</h1>
                    <p className={styles.subtitle}>엔카페가 정성스레 준비한 계절의 맛입니다.</p>
                </header>

                {isLoading ? (
                    <div className={styles.loading}>메뉴를 불러오는 중입니다...</div>
                ) : (
                    <div className={styles.grid}>
                        {menus.map((menu) => (
                            <div key={menu.id} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={menu.imageSrc && !menu.imageSrc.includes('blank') ? `/images/${menu.imageSrc}` : 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=400&auto=format&fit=crop'}
                                        alt={menu.korName}
                                        className={styles.image}
                                    />
                                </div>
                                <div className={styles.info}>
                                    <div className={styles.category}>{menu.categoryName}</div>
                                    <h3 className={styles.menuName}>{menu.korName}</h3>
                                    <p className={styles.description}>{menu.description}</p>
                                    <div className={styles.price}>{menu.price.toLocaleString()}원</div>
                                    <button className={styles.addBtn} onClick={() => alert('장바구니 기능은 곧 업데이트됩니다!')}>
                                        담기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
