'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

import { Search, Coffee, Beer, Utensils, IceCream } from 'lucide-react';
import Link from 'next/link';

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

interface Category {
    id: number;
    name: string;
    icon?: string;
}

export default function UserMenuPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // 카테고리 로드
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) { console.error(err); }
        };
        fetchCategories();
    }, []);

    // 메뉴 로드 (필터 적용)
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setIsLoading(true);
                const url = new URL('/api/menus', window.location.origin);
                if (selectedCategory) url.searchParams.set('categoryId', selectedCategory.toString());
                if (searchQuery) url.searchParams.set('searchQuery', searchQuery);

                const res = await fetch(url.toString());
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setMenus(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        const timer = setTimeout(fetchMenus, 300); // 디바운스
        return () => clearTimeout(timer);
    }, [selectedCategory, searchQuery]);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <header className={styles.header}>
                    <h1 className={styles.title}>차림표</h1>
                    <p className={styles.subtitle}>엔카페가 정성스레 준비한 계절의 맛입니다.</p>
                </header>

                <section className={styles.filterSection}>
                    <div className={styles.searchBar}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="찾으시는 메뉴가 있으신가요?"
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.categoryTabs}>
                        <button
                            className={`${styles.tab} ${selectedCategory === null ? styles.activeTab : ''}`}
                            onClick={() => setSelectedCategory(null)}
                        >
                            전체
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`${styles.tab} ${selectedCategory === cat.id ? styles.activeTab : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </section>

                {isLoading ? (
                    <div className={styles.loading}>메뉴를 불러오는 중입니다...</div>
                ) : (
                    <div className={styles.grid}>
                        {menus.length > 0 ? menus.map((menu) => (
                            <Link href={`/menus/${menu.id}`} key={menu.id} className={styles.cardLink}>
                                <div className={styles.card}>
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
                                        <button className={styles.addBtn} onClick={(e) => {
                                            e.preventDefault();
                                            alert('장바구니 기능은 곧 업데이트됩니다!');
                                        }}>
                                            담기
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className={styles.noResult}>검색 결과가 없습니다.</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
