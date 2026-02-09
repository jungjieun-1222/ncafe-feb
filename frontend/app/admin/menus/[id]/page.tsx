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

            <div className={styles.pageContainer}>
                <section className={styles.imageSection}>
                    <MenuDetailImage menuId={Number(id)} />
                </section>

                <section className={styles.infoSection}>
                    <MenuDetailInfo id={Number(id)} />
                    <MenuDetailOptions />
                </section>
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
                <Link href="/admin/menus">
                    <Button variant="ghost">목록으로 돌아가기</Button>
                </Link>
            </div>
        </main>
    );
}
