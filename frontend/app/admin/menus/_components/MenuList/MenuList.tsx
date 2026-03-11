'use client';

import { useState } from 'react';
import { Coffee, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import MenuCard from '../MenuCard';
import styles from './MenuList.module.css';
import { useMenus } from './useMenus';

const ITEMS_PER_PAGE = 12;

interface MenuListProps {
    selectedCategory: number | undefined;
    searchQuery: string | undefined;
}

export default function MenuList({ selectedCategory, searchQuery }: MenuListProps) {
    const { menus, isLoading, setMenus } = useMenus(selectedCategory, searchQuery);
    const [currentPage, setCurrentPage] = useState(1);

    const handleToggleSoldOut = async (id: number, nextIsAvailable: boolean) => {
        try {
            const res = await fetch(`/api/admin/menus/${id}/status?isAvailable=${nextIsAvailable}`, {
                method: 'PATCH',
            });

            if (!res.ok) throw new Error('상태 변경 실패');

            // 매우 중요: 오직 클릭한 id와 일치하는 메뉴만 상태를 변경합니다.
            setMenus(prevMenus => 
                prevMenus.map(menu => 
                    menu.id === id 
                        ? { ...menu, isAvailable: nextIsAvailable, isSoldOut: !nextIsAvailable } 
                        : menu
                )
            );

            toast.success(nextIsAvailable ? '판매 중으로 변경되었습니다.' : '품절 처리되었습니다.');
        } catch (error) {
            console.error('Toggle error:', error);
            toast.error('상태 변경 중 오류가 발생했습니다.');
            throw error; // MenuCard에서 로컬 상태 복구를 위해 던짐
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말로 삭제하시겠습니까?')) return;
        try {
            const res = await fetch(`/api/admin/menus/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('삭제 실패');
            setMenus(prev => prev.filter(m => m.id !== id));
            toast.success('삭제되었습니다.');
        } catch (error) {
            console.error(error);
            toast.error('삭제 중 오류가 발생했습니다.');
        }
    };

    const totalPages = Math.ceil(menus.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentMenus = menus.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (isLoading) {
        return (
            <div className={styles.grid}>
                <div className={styles.empty}>
                    <p className={styles.emptyText}>데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (menus.length === 0) {
        return (
            <div className={styles.grid}>
                <div className={styles.empty}>
                    <Coffee className={styles.emptyIcon} />
                    <p className={styles.emptyText}>등록된 메뉴가 없습니다</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.grid}>
                {currentMenus.map((menu) => (
                    <MenuCard
                        // key에 id를 포함하여 리액트가 카드를 명확히 식별하게 합니다.
                        key={`admin-menu-${menu.id}`}
                        menu={menu}
                        onToggleSoldOut={handleToggleSoldOut}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={18} />
                    </button>

                    <span className={styles.pageInfo}>
                        {menus.length}개 중 {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, menus.length)}개
                    </span>
                </div>
            )}
        </>
    );
}
