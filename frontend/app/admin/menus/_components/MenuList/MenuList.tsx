'use client';

import { useState, useEffect } from 'react';
import { Coffee, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import MenuCard from '../MenuCard';
import styles from './MenuList.module.css';
import { useMenus } from './useMenus';

const ITEMS_PER_PAGE = 12;

interface MenuListProps {
    selectedCategory: number | undefined;
    searchQuery: string | undefined;
    sortBy: string;
}

export default function MenuList({ selectedCategory, searchQuery, sortBy }: MenuListProps) {
    const { menus, isLoading, setMenus } = useMenus(selectedCategory, searchQuery, sortBy);
    const [currentPage, setCurrentPage] = useState(1);

    // Scroll to top when page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const handleToggleSoldOut = async (id: number, nextIsAvailable: boolean) => {
        try {
            const res = await fetch(`/api/admin/menus/${id}/status?isAvailable=${nextIsAvailable}`, {
                method: 'PATCH',
            });

            if (!res.ok) throw new Error('상태 변경 실패');

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
            throw error;
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

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const newMenus = Array.from(menus);
        
        // Remove from source and insert at destination
        const realSourceIndex = startIndex + result.source.index;
        const realDestIndex = startIndex + result.destination.index;
        
        const [movedItem] = newMenus.splice(realSourceIndex, 1);
        newMenus.splice(realDestIndex, 0, movedItem);

        // Optimistically update state
        setMenus(newMenus);

        // Sync with backend
        try {
            // We only need to send the reordered IDs for the global list or the current category
            // For simplicity, we send IDs in the new order. 
            // If categorized, we might only want to reorder within category, but the backend reorder method re-indexes them.
            const menuIds = newMenus.map(m => m.id);
            const res = await fetch('/api/admin/menus/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menuIds),
            });

            if (!res.ok) throw new Error('순서 변경 저장 실패');
            toast.success('순서가 변경되었습니다.');
        } catch (error) {
            console.error(error);
            toast.error('순서 변경 중 오류가 발생했습니다.');
            // Revert on failure could be complex, maybe refresh would be better
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

    // Drag and drop is only meaningful when sorting is manually possible
    // We disable it if a search query is active to avoid confusion
    const isDragDisabled = !!searchQuery;

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="menu-list" direction="horizontal">
                    {(provided) => (
                        <div 
                            className={styles.grid}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {currentMenus.map((menu, index) => (
                                <Draggable 
                                    key={`draggable-menu-${menu.id}`} 
                                    draggableId={`menu-${menu.id}`} 
                                    index={index}
                                    isDragDisabled={isDragDisabled}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`${styles.draggableItem} ${snapshot.isDragging ? styles.dragging : ''}`}
                                            style={{
                                                ...provided.draggableProps.style,
                                                height: 'auto'
                                            }}
                                        >
                                            <MenuCard
                                                menu={menu}
                                                onToggleSoldOut={handleToggleSoldOut}
                                                onDelete={handleDelete}
                                                dragHandleProps={provided.dragHandleProps}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

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
