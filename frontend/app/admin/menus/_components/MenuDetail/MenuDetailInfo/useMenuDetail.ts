import { useState, useEffect } from 'react';

export interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
    available: boolean;
}

export function useMenuDetail(id: number | string | undefined) {
    const [menu, setMenu] = useState<MenuDetail | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchMenu = async () => {
            try {
                const res = await fetch(`/api/admin/menus/${id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch menu detail');
                }
                const data = await res.json();

                // Backend returns isAvailable, mapping to available as requested
                const mappedData: MenuDetail = {
                    ...data,
                    available: data.available !== undefined ? data.available : data.isAvailable
                };

                setMenu(mappedData);
            } catch (error) {
                console.error('Failed to fetch menu detail:', error);
            }
        };

        fetchMenu();
    }, [id]);

    return menu;
}
