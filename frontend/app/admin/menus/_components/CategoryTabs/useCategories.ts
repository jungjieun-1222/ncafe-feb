import { useState, useEffect } from 'react';
import { MenuCategory } from '@/types/menu';



export interface CategoryResponseDto {
    id: number;
    name: string;
    icon: string;
    sortOrder: number;
    menuCount: number;
}

export interface CategoryListResponseDto {
    categories: CategoryResponseDto[];
    totalCount: number;
}



export function useCategories() {
    const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const res = await fetch('/api/admin/categories');

                if (!res.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const data = await res.json();

                // 데이터 정제 로직
                const formattedCats = data.map((c: any) => ({
                    ...c,
                    id: String(c.id),
                    korName: c.korName || c.name || '미분류',
                    engName: c.engName || '',
                    // 소문자로 변환하여 매핑 확률 높임
                    icon: (c.icon || 'coffee').toLowerCase(),
                    sortOrder: c.sortOrder || 0
                }));

                setCategories(formattedCats);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, isLoading, error, setCategories };
}
