import styles from './page.module.css';
import Button from '@/components/common/Button/Button';
import Link from 'next/link';
import MenuDetailHeader from '@/app/admin/menus/_components/MenuDetail/MenuDetailHeader';
import MenuDetailImage from '@/app/admin/menus/_components/MenuDetail/MenuDetailImage';
import MenuDetailInfo from '@/app/admin/menus/_components/MenuDetail/MenuDetailInfo';
import MenuDetailOptions from '@/app/admin/menus/_components/MenuDetail/MenuDetailOptions';
import { use } from 'react';


export default function MenuDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    return (
        <main>
            <MenuDetailHeader />

            <div className={styles.detailGrid}>
                <aside className={styles.imageColumn}>
                    <section className={styles.imageSection}>
                        <MenuDetailImage slug={slug} />
                    </section>
                </aside>

                <div className={styles.infoColumn}>
                    <section className={styles.infoSection}>
                        <MenuDetailInfo slug={slug} />
                    </section>
                    <section className={styles.optionsSection}>
                        <MenuDetailOptions />
                    </section>
                </div>
            </div>

            <div className={styles.footerActions}>
                <Link href="/admin/menus">
                    <Button variant="ghost">목록으로 돌아가기</Button>
                </Link>
            </div>
        </main>
    );
}
