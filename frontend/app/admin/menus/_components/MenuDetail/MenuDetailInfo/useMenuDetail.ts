import { useState, useEffect } from 'react';

export interface MenuDetail {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    categoryId: number;
    imageSrc: string;
    createdAt: string;
    updatedAt: string;
    available: boolean;
    options: Array<{
        id: number;
        name: string;
        value: string;
        price: number;
    }>;
}

export function useMenuDetail(slug: string | undefined) {
    const [menu, setMenu] = useState<MenuDetail | null>(null);

    useEffect(() => {
        if (!slug) return;

        const fetchMenu = async () => {
            try {
                const res = await fetch(`/api/admin/menus/${slug}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch menu detail');
                }
                const data = await res.json();

                // Backend returns isAvailable, mapping to available as requested
                const mappedData: MenuDetail = {
                    ...data,
                    available: data.available !== undefined ? data.available : data.isAvailable,
                    options: data.options || []
                };

                setMenu(mappedData);
            } catch (error) {
                console.error('Failed to fetch menu detail:', error);
            }
        };

        fetchMenu();
    }, [slug]);

    return menu;
}
