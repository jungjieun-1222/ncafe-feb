'use client';

import { useState, useEffect, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import MenuForm from '../../_components/MenuForm/MenuForm';
import PageHeader from '@/app/admin/menus/_components/MenuList/PageHeader';
import { Menu } from '@/types/menu';

interface Props {
    params: Promise<{ id: string }>;
}

export default function EditMenuPage({ params }: Props) {
    const { id } = use(params);
    const [menu, setMenu] = useState<Menu | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await fetch(`/api/admin/menus/${id}`);
                if (!res.ok) {
                    if (res.status === 404) notFound();
                    throw new Error('Failed to fetch menu');
                }
                const data = await res.json();
                
                // Map API response to Menu type
                const mappedMenu: Menu = {
                    id: String(data.id),
                    korName: data.korName,
                    engName: data.engName || '',
                    description: data.description || '',
                    price: data.price,
                    category: {
                        id: String(data.categoryId),
                        korName: data.categoryName || '기타',
                        engName: '',
                        sortOrder: 0
                    },
                    images: data.imageSrc ? [{
                        id: 'primary',
                        url: data.imageSrc,
                        isPrimary: true,
                        sortOrder: 0
                    }] : [],
                    isAvailable: data.isAvailable,
                    isSoldOut: !data.isAvailable,
                    sortOrder: 0,
                    options: [], // Options not supported by backend yet
                    createdAt: new Date(data.createdAt),
                    updatedAt: new Date(data.updatedAt)
                };
                
                setMenu(mappedMenu);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenu();
    }, [id]);

    if (isLoading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>데이터를 불러오는 중...</div>;
    }

    if (!menu) {
        return null; // or notFound()
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <PageHeader title="메뉴 수정" subtitle={menu.korName} />
            <MenuForm mode="edit" initialData={menu} />
        </div>
    );
}
