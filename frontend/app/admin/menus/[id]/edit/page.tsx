import { menus } from '@/mocks/menuData';
import { notFound } from 'next/navigation';
import MenuForm from '../../_components/MenuForm/MenuForm';
import PageHeader from '@/app/admin/menus/_components/MenuList/PageHeader';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditMenuPage({ params }: Props) {
    const { id } = await params;

    // fetch menu
    const menu = menus.find((m) => m.id === id);

    if (!menu) {
        notFound();
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <PageHeader title="메뉴 수정" subtitle={menu.korName} />
            <MenuForm mode="edit" initialData={menu} />
        </div>
    );
}
