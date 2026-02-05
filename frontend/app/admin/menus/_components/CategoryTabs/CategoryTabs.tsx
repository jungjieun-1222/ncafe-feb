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

    return (
        <div className={styles.toolbar}>
            <div className={styles.filterSection}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${selectedCategory === undefined ? styles.tabActive : ''}`}
                    >
                        <LayoutGrid className={styles.tabIcon} />
                        전체
                    </button>
                    {/* 카테고리 탭 */}
                    {categories.map((category: CategoryResponseDto) => {
                        return (
                            <button
                                key={category.id}
                                className={`${styles.tab} ${selectedCategory === category.id ? styles.tabActive : ''}`}
                                onClick={() => onCategoryChange(category.id)}
                            >
                                <span className={styles.tabIcon}>{category.icon}</span>
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
