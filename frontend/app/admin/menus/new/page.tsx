import MenuForm from '../_components/MenuForm/MenuForm';
import PageHeader from '@/app/admin/menus/_components/MenuList/PageHeader';

export default function NewMenuPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <PageHeader title="메뉴 등록" />
            <MenuForm mode="create" />
        </div>
    );
}
