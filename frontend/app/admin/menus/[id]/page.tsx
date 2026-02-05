import { menus } from '@/mocks/menuData';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import Button from '@/components/common/Button/Button';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '@/app/admin/menus/_components/MenuList/PageHeader';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function MenuDetailPage({ params }: Props) {
    const { id } = await params;

    const menu = menus.find((m) => m.id === id);

    if (!menu) {
        notFound();
    }

    const primaryImage = menu.images.find(img => img.isPrimary) || menu.images[0];

    return (
        <div className={styles.container}>
            <PageHeader title={menu.korName} subtitle={menu.engName}>
                <Link href={`/admin/menus/${menu.id}/edit`}>
                    <Button variant="secondary">수정</Button>
                </Link>
                <Button variant="danger">삭제</Button>
            </PageHeader>

            <div className={styles.content}>
                <div className={styles.imageSection}>
                    {primaryImage ? (
                        <Image
                            src={primaryImage.url}
                            alt={menu.korName}
                            fill
                            className={styles.image}
                            sizes="(max-width: 768px) 100vw, 800px"
                            priority
                        />
                    ) : (
                        <div className={styles.image} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                            이미지 없음
                        </div>
                    )}
                </div>

                <div className={styles.infoSection}>
                    <div className={styles.metaRow}>
                        <span className={`${styles.badge} ${styles.badgeCategory}`}>
                            {menu.category.korName}
                        </span>
                        <span className={`${styles.badge} ${styles.badgeStatus} ${menu.isSoldOut ? styles.soldOut : ''}`}>
                            {menu.isSoldOut ? '품절' : '판매중'}
                        </span>
                    </div>

                    <div className={styles.price}>
                        {new Intl.NumberFormat('ko-KR').format(menu.price)}원
                    </div>

                    <div className={styles.description}>
                        {menu.description}
                    </div>

                    <h2 className={styles.sectionTitle}>옵션</h2>
                    <div className={styles.optionList}>
                        {menu.options.length > 0 ? (
                            menu.options.map((option) => (
                                <div key={option.id} className={styles.optionItem}>
                                    <div className={styles.optionHeader}>
                                        <span>{option.name}</span>
                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', fontWeight: 'normal' }}>
                                            {option.required ? '필수' : '선택'} • {option.type === 'radio' ? '단일 선택' : '다중 선택'}
                                        </span>
                                    </div>
                                    <div className={styles.optionDetailList}>
                                        {option.items.map((item) => (
                                            <div key={item.id} className={styles.optionDetailBadge}>
                                                {item.name} {item.priceDelta > 0 && `(+${item.priceDelta}원)`}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: 'var(--color-gray-500)' }}>등록된 옵션이 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
                <Link href="/admin/menus">
                    <Button variant="ghost">목록으로 돌아가기</Button>
                </Link>
            </div>
        </div>
    );
}
