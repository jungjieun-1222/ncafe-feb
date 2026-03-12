'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button/Button';
import styles from './MenuDetailInfo.module.css';
import { useMenuDetail } from './useMenuDetail';

export default function MenuDetailInfo({ id }: { id: number }) {
    const menu = useMenuDetail(id);
    const router = useRouter();

    if (!menu) {
        return null;
    }

    const { korName, engName, categoryName, price, description, available, createdAt, updatedAt } = menu;

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateString));
    };

    const handleDeleteMapping = async () => {
        if (!confirm('정말로 이 메뉴를 삭제하시겠습니까?')) return;
        try {
            const res = await fetch(`/api/admin/menus/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('삭제 실패');
            
            // Dynamic import toast for client-side only
            const toast = (await import('react-hot-toast')).default;
            toast.success('메뉴가 성공적으로 삭제되었습니다.');
            router.push('/admin/menus');
        } catch (error) {
            console.error('Delete error:', error);
            const toast = (await import('react-hot-toast')).default;
            toast.error('삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <>
            <div className={styles.titleSection}>
                <div className={styles.nameGroup}>
                    <h1 className={styles.korName}>{korName}</h1>
                    <span className={styles.engName}>{engName}</span>
                </div>
                <div className={styles.actions}>
                    <Link href={`/admin/menus/${id}/edit`}>
                        <Button variant="secondary" size="md">수정</Button>
                    </Link>
                    <Button 
                        variant="danger" 
                        size="md"
                        onClick={handleDeleteMapping}
                    >
                        삭제
                    </Button>
                </div>
            </div>

            <div className={styles.metaRow}>
                <span className={`${styles.badge} ${styles.badgeCategory}`}>
                    {categoryName}
                </span>
                <span className={`${styles.badge} ${styles.badgeStatus} ${!available ? styles.soldOut : ''}`}>
                    {available ? '판매중' : '품절'}
                </span>
            </div>

            <div className={styles.price}>
                {new Intl.NumberFormat('ko-KR').format(price)}원
            </div>

            <div className={styles.description}>
                {description}
            </div>

            <div className={styles.metadata}>
                <span>등록일: {formatDate(createdAt)}</span>
                <span>최종 수정일: {formatDate(updatedAt)}</span>
            </div>
        </>
    );
}
