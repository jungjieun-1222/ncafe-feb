import { useState } from 'react';
import { Coffee, ChevronLeft, ChevronRight } from 'lucide-react';
import { Menu } from '@/types/menu';
import MenuCard from '../MenuCard';
import styles from './MenuList.module.css';
import { useMenus } from './useMenus';

const ITEMS_PER_PAGE = 12; // 페이지당 표시할 메뉴 개수

interface MenuListProps {
    selectedCategory: number | undefined;
    searchQuery: string | undefined;
}

export default function MenuList({ selectedCategory, searchQuery }: MenuListProps) {

    //http://localhost:8080/admin/menus?category=1&searchQuery=&page=1&size=8

    const { menus, isLoading } = useMenus(selectedCategory, searchQuery);
    const [currentPage, setCurrentPage] = useState(1);


    // 2. 페이지네이션 계산
    const totalPages = Math.ceil(menus.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentMenus = menus.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // 로딩 중
    if (isLoading) {
        return (
            <div className={styles.grid}>
                <div className={styles.empty}>
                    <p className={styles.emptyText}>데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 데이터 없음
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
                    //<div key={menu.id}>{menu.korName}</div>
                    <MenuCard
                        key={menu.id}
                        menu={menu}
                        onToggleSoldOut={() => console.log('품절 토글:', menu.id)}
                        onDelete={() => console.log('삭제:', menu.id)}
                    />
                ))}
            </div>

            {/* 페이저 */}
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
