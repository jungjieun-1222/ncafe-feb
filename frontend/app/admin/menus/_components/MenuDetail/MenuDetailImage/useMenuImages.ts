import { useState, useEffect } from 'react';

export interface MenuImage {
    id: number;
    menuId: number;
    srcUrl: string;
    altText?: string;
    sortOrder: number;
}

export function useMenuImages(menuId: number | string | undefined) {
    const [images, setImages] = useState<MenuImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!menuId) return;

        const fetchImages = async () => {
            try {
                const res = await fetch(`/api/admin/menus/${menuId}/menu-images`);
                if (!res.ok) {
                    throw new Error('Failed to fetch menu images');
                }
                const data = await res.json();
                // data is MenuImageListResponse which contains menuImages list
                setImages(data.menuImages || []);
            } catch (error) {
                console.error('Failed to fetch menu images:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [menuId]);

    return { images, isLoading };
}
