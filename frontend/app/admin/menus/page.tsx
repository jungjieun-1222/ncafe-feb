'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/common/Button';
import PageHeader from './_components/MenuList/PageHeader/PageHeader';
import CategoryTabs from './_components/CategoryTabs';
import MenuList from './_components/MenuList';

import styles from './page.module.css';
import tabStyles from './_components/CategoryTabs/CategoryTabs.module.css';

export default function MenuListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [sortBy, setSortBy] = useState('default');

    console.log("Current State - Category:", selectedCategory, "Sort:", sortBy);

    return (
        <div className={styles.container}>
            <PageHeader title="메뉴 관리" subtitle="카페의 소중한 메뉴들을 관리하는 공간입니다.">
                <div className={tabStyles.actionSection}>
                    <div className={tabStyles.sortWrapper}>
                        <select 
                            className={tabStyles.sortSelect}
                            value={sortBy}
                            onChange={(e) => {
                                console.log("Sort changed to:", e.target.value);
                                setSortBy(e.target.value);
                            }}
                        >
                            <option value="default">기본순</option>
                            <option value="latest">최신순</option>
                            <option value="recommended">추천순</option>
                        </select>
                    </div>

                    <div className={tabStyles.searchWrapper}>
                        <Search size={18} className={tabStyles.searchIcon} />
                        <input
                            type="text"
                            placeholder="메뉴 검색..."
                            className={tabStyles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Link href="/admin/menus/new">
                        <Button className={tabStyles.addBtn}>
                            <Plus size={18} />
                            <span>메뉴 추가</span>
                        </Button>
                    </Link>
                </div>
            </PageHeader>

            <CategoryTabs
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            <MenuList
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                sortBy={sortBy}
            />
        </div>
    );
}
