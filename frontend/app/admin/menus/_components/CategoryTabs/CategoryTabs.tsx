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
}

export default function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
    const { categories } = useCategories();

    const getIcon = (id: string | number) => {
        console.log("들어온 카테고리 ID:", id, "타입:", typeof id);
        const categoryId = Number(id);
        switch (categoryId) {
            case 1: return <Leaf className={styles.tabIcon} />;      // 전통차 (찻잎)
            case 2: return <Cake className={styles.tabIcon} />;      // 디저트
            case 3: return <Coffee className={styles.tabIcon} />;    // 커피&음료
            case 4: return <Croissant className={styles.tabIcon} />; // 샌드위치&브런치
            case 5: return <CupSoda className={styles.tabIcon} />;   // 에이드&스무디
            case 6: return <LayoutGrid className={styles.tabIcon} />;// 아이스크림&빙수 (적절한 아이콘으로 교체 가능)
            case 7: return <Plus className={styles.tabIcon} />;      // 기획 상품
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
        </div>
    );
}
