'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Coffee, CupSoda, Leaf, Cake, Croissant, LayoutGrid, Plus, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import styles from './CategoryTabs.module.css';
import { CategoryResponseDto, useCategories } from '@/app/admin/menus/_components/CategoryTabs/useCategories';

interface CategoryTabsProps {
    selectedCategory: number | undefined;
    onCategoryChange: (categoryId: number) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function CategoryTabs({ selectedCategory, onCategoryChange, searchQuery, setSearchQuery }: CategoryTabsProps) {
    const { categories } = useCategories();

    const getIcon = (id: string | number) => {
        const categoryId = Number(id);
        switch (categoryId) {
            case 1: return <Coffee className={styles.tabIcon} />;    // 커피
            case 2: return <Croissant className={styles.tabIcon} />; // 샌드위치
            case 3: return <Leaf className={styles.tabIcon} />;      // 디저트
            case 4: return <Cake className={styles.tabIcon} />;      // 쿠키
            case 5: return <CupSoda className={styles.tabIcon} />;   // 논커피
            case 9: return <LayoutGrid className={styles.tabIcon} />;// 기타
            default: return <Coffee className={styles.tabIcon} />;
        }
    };

    return (
        <div className={styles.toolbar}>
            <div className={styles.filterSection}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${selectedCategory === undefined ? styles.tabActive : ''}`}
                        onClick={() => onCategoryChange(undefined as any)}
                    >
                        <LayoutGrid className={styles.tabIcon} />
                        전체
                    </button>
                    {/* 카테고리 탭 */}
                    {categories.map((category: CategoryResponseDto) => {
                        return (
                            <button
                                key={category.id}
                                className={`${styles.tab} ${selectedCategory === Number(category.id) ? styles.tabActive : ''}`}
                                onClick={() => onCategoryChange(Number(category.id))}
                            >
                                {getIcon(category.id)}
                                {category.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={styles.actionSection}>
                <div className={styles.searchWrapper}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="메뉴 검색..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Link href="/admin/menus/new">
                    <Button className={styles.addBtn}>
                        <Plus size={18} />
                        <span>메뉴 추가</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
