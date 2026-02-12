'use client';

import { useState } from 'react';
import PageHeader from './_components/MenuList/PageHeader';
import CategoryTabs from './_components/CategoryTabs';
import MenuList from './_components/MenuList';

import styles from './page.module.css';

export default function MenuListPage() {
    //상태 Lifting State Up
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    //선택된 카테고리 변경
    //const handleCategoryChange = (Id: number) => {
    //    setSelectedCategory(Id);
    //};

    return (
        <div className={styles.container}>
            <PageHeader title="메뉴 관리" />
            {/* callback property */}
            <CategoryTabs
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            {/* selectedCategory property */}
            <MenuList
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
            />
        </div>
    );
}
