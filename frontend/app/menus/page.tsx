'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/stores/useCartStore';
import { getImageUrl } from '@/utils/image';

interface Menu {
    id: number;
    korName: string;
    engName: string;
    slug: string;
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
    const { openCart, triggerRefresh } = useCartStore();
    const [menus, setMenus] = useState<Menu[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [addingMenuId, setAddingMenuId] = useState<number | null>(null);

    const handleAddToCart = async (e: React.MouseEvent, menu: Menu) => {
        e.preventDefault();
        setAddingMenuId(menu.id);
        
        try {
            let cartId = localStorage.getItem('cartId');
            if (!cartId) {
                cartId = 'guest_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9);
                localStorage.setItem('cartId', cartId);
            }
            
            const mockOptions = [];
            // Mocking options to utilize Option.java and show UI design
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
                    menuId: menu.id,
                    menuName: menu.korName,
                    basePrice: menu.price,
                    quantity: 1,
                    options: mockOptions
                })
            });
            
            if (!res.ok) throw new Error('장바구니 추가 실패');
            
            triggerRefresh(); // Sync drawer
            openCart(); // Show drawer
        } catch (err) {
            console.error(err);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setAddingMenuId(null);
        }
    };

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
                            <Link href={`/menus/${menu.slug}`} key={menu.id} className={styles.cardLink}>
                                <div className={`${styles.card} ${!menu.isAvailable ? styles.soldOut : ''}`}>
                                    <div className={styles.imageWrapper}>
                                        <img
                                            src={getImageUrl(menu.imageSrc)}
                                            alt={menu.korName}
                                            className={styles.image}
                                            onError={(e) => { e.currentTarget.src = '/images/blank.png'; }}
                                        />
                                        {!menu.isAvailable && (
                                            <div className={styles.soldOutOverlay}>
                                                <span>SOLD OUT</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.category}>{menu.categoryName}</div>
                                        <h3 className={styles.menuName}>{menu.korName}</h3>
                                        <p className={styles.description}>{menu.description}</p>
                                        <div className={styles.price}>{menu.price.toLocaleString()}원</div>
                                        <button 
                                            className={styles.addBtn} 
                                            onClick={(e) => handleAddToCart(e, menu)}
                                            disabled={addingMenuId === menu.id || !menu.isAvailable}
                                        >
                                            {!menu.isAvailable ? '품절' : addingMenuId === menu.id ? '담는 중...' : '담기'}
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
