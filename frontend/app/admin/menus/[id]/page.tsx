import styles from './page.module.css';
import Button from '@/components/common/Button/Button';
import Link from 'next/link';
import MenuDetailHeader from '@/app/admin/menus/_components/MenuDetail/MenuDetailHeader';
import MenuDetailImage from '@/app/admin/menus/_components/MenuDetail/MenuDetailImage';
import MenuDetailInfo from '@/app/admin/menus/_components/MenuDetail/MenuDetailInfo';
import MenuDetailOptions from '@/app/admin/menus/_components/MenuDetail/MenuDetailOptions';
import { use } from 'react';


export default function MenuDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <main>
            <MenuDetailHeader />

            <div className={styles.content}>
                {/* MenuDetailImage 컴포넌트에 menuId를 전달해야함 */}
                <MenuDetailImage menuId={Number(id)} />

                <div className={styles.infoSection}>
                    <MenuDetailInfo id={Number(id)} />
                    <MenuDetailOptions />
                </div>
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
                <Link href="/admin/menus">
                    <Button variant="ghost">목록으로 돌아가기</Button>
                </Link>
            </div>
        </main>
    );
}
