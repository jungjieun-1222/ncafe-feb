import { useState, useEffect } from 'react';
import { Menu } from '@/types/menu';


export interface MenuResponse {
    id: number;
    korName: string;
    engName: string;
    description: string;
    price: number;
    categoryName: string;
    imageSrc: string;
    isAvailable: boolean;
    isSoldOut: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface MenuListResponse {
    menus: MenuResponse[],
    total: number;
}

export function useMenus(selectedCategory: number | undefined, searchQuery: string | undefined) {
    const [menus, setMenus] = useState<MenuResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenus = async () => {
            const url = new URL('/api/v1/admin/menus', window.location.origin);

            const params = url.searchParams;
            if (selectedCategory) params.set('categoryId', selectedCategory.toString());
            if (searchQuery) params.set('searchQuery', searchQuery);

            try {
                console.log(selectedCategory);
                console.log(searchQuery);
                setIsLoading(true);
                const res = await fetch(url.toString());
                if (!res.ok) {
                    throw new Error('Failed to fetch menus');
                }
                const data = await res.json();
                setMenus(data.menus);
                console.log("data.menus", data.menus);

                // 데이터 변환  menuDTO
                // const mappedMenus: MenuResponse[] = menuList.map((item: any) => ({
                //     id: String(item.id),
                //     korName: item.korName,
                //     engName: item.engName,
                //     description: item.description,
                //     price: Number(item.price) || 0,
                //     category: {
                //         id: String(item.category?.id || item.categoryId),
                //         korName: item.category?.name || '미분류',
                //         engName: '',
                //         icon: 'coffee',
                //         sortOrder: 0
                //     },
                //     images: item.image ? [{
                //         id: `img-${item.id}`,
                //         url: item.image,
                //         isPrimary: true,
                //         sortOrder: 0
                //     }] : [],
                //     isAvailable: item.isAvailable ?? true,
                //     isSoldOut: false,
                //     sortOrder: item.id,
                //     options: [],
                //     createdAt: new Date(item.createdAt),
                //     updatedAt: new Date(item.updatedAt),
                // }));

            } catch (error) {
                console.error('Failed to fetch menus:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenus();
    }, [selectedCategory, searchQuery]);

    return { menus, isLoading, setMenus };
}
