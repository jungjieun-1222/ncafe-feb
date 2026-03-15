'use client';

import { useState, useEffect } from 'react';
import { Coffee, CupSoda, Leaf, Cake, Croissant, LayoutGrid, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';
import styles from './CategoryTabs.module.css';
import { CategoryResponseDto, useCategories } from '@/app/admin/menus/_components/CategoryTabs/useCategories';

interface CategoryTabsProps {
    selectedCategory: number | undefined;
    onCategoryChange: (categoryId: number | undefined) => void;
}

export default function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
    const { categories, setCategories } = useCategories();

    useEffect(() => {
        console.log("CategoryTabs: selectedCategory changed to:", selectedCategory);
    }, [selectedCategory]);

    const getIcon = (id: string | number) => {
        const categoryId = Number(id);
        switch (categoryId) {
            case 1: return <Leaf className={styles.tabIcon} />;
            case 2: return <Cake className={styles.tabIcon} />;
            case 3: return <Coffee className={styles.tabIcon} />;
            case 4: return <Croissant className={styles.tabIcon} />;
            case 5: return <CupSoda className={styles.tabIcon} />;
            case 6: return <LayoutGrid className={styles.tabIcon} />;
            case 7: return <Plus className={styles.tabIcon} />;
            default: return <Coffee className={styles.tabIcon} />;
        }
    };

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;

        const newCategories = Array.from(categories);
        const [movedItem] = newCategories.splice(result.source.index, 1);
        newCategories.splice(result.destination.index, 0, movedItem);

        // Optimistic update
        setCategories(newCategories);

        try {
            const res = await fetch('/api/admin/categories/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCategories.map(c => Number(c.id))),
            });

            if (!res.ok) throw new Error('카테고리 순서 변경 실패');
            toast.success('카테고리 순서가 변경되었습니다.');
        } catch (error) {
            console.error(error);
            toast.error('순서 변경 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.toolbar}>
            <div className={styles.filterSection}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${selectedCategory === undefined ? styles.tabActive : ''}`}
                        onClick={() => {
                            console.log("All categories clicked");
                            onCategoryChange(undefined);
                        }}
                    >
                        <LayoutGrid className={styles.tabIcon} />
                        전체
                    </button>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="category-tabs" direction="horizontal">
                            {(provided) => (
                                <div
                                    className={styles.draggableTabs}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {categories.map((category: CategoryResponseDto, index: number) => (
                                        <Draggable
                                            key={`category-${category.id}`}
                                            draggableId={`category-${category.id}`}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <button
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`${styles.tab} ${selectedCategory === Number(category.id) ? styles.tabActive : ''} ${snapshot.isDragging ? styles.dragging : ''}`}
                                                    onClick={() => {
                                                        console.log("Category clicked:", category.id);
                                                        onCategoryChange(Number(category.id));
                                                    }}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                    }}
                                                >
                                                    {getIcon(category.id)}
                                                    {category.name}
                                                </button>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        </div>
    );
}
