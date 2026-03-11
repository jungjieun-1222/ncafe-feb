'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { MenuResponse } from '../MenuList/useMenus';
import styles from './MenuCard.module.css';

interface MenuCardProps {
    menu: MenuResponse;
    onToggleSoldOut: (id: number, nextIsAvailable: boolean) => Promise<void>;
    onDelete: (id: number) => void;
}

export default function MenuCard({ menu, onToggleSoldOut, onDelete }: MenuCardProps) {
    const [isAvailable, setIsAvailable] = useState(menu.isAvailable);
    const [isSoldOut, setIsSoldOut] = useState(menu.isSoldOut);
    const [imgError, setImgError] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    // 부모로부터 받은 값이 변하면 동기화
    useEffect(() => {
        setIsAvailable(menu.isAvailable);
        setIsSoldOut(menu.isSoldOut);
    }, [menu.isAvailable, menu.isSoldOut]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isToggling) return;

        const nextIsAvailable = !isAvailable;
        setIsToggling(true);
        
        try {
            await onToggleSoldOut(menu.id, nextIsAvailable);
            // 성공하면 로컬 상태 업데이트
            setIsAvailable(nextIsAvailable);
            setIsSoldOut(!nextIsAvailable);
        } catch (error) {
            console.error('Toggle failed:', error);
        } finally {
            setIsToggling(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const getImageUrl = (url: string | null | undefined) => {
        if (!url) return '/images/blank.png';
        if (url.startsWith('/images/')) return url;
        if (url.startsWith('http')) return url;
        return `/images/${url}`;
    };

    return (
        <div className={`${styles.card} ${isSoldOut ? styles.isSoldOutCard : ''}`}>
            <Link href={`/admin/menus/${menu.id}`} className={styles.cardLink}>
                <div className={styles.imageWrapper}>
                    {(menu.imageSrc && !imgError) ? (
                        <Image
                            src={getImageUrl(menu.imageSrc)}
                            alt={menu.korName}
                            fill
                            className={styles.image}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className={styles.placeholder}>
                            <ImageIcon width={48} height={48} strokeWidth={1} />
                        </div>
                    )}
                    
                    {/* 품절 오버레이 - 이미지 영역에만 적용 */}
                    {isSoldOut && (
                        <div className={styles.soldOutOverlay}>
                            <span className={styles.soldOutBadge}>SOLD OUT</span>
                        </div>
                    )}
                </div>

                <div className={styles.body}>
                    <div className={styles.header}>
                        <span className={styles.category}>{menu.categoryName || '일반'}</span>
                        <span className={styles.price}>{formatPrice(menu.price)}원</span>
                    </div>

                    <div className={styles.nameGroup}>
                        <h3 className={styles.name}>{menu.korName}</h3>
                        <p className={styles.engName}>{menu.engName}</p>
                    </div>
                </div>
            </Link>

            <div className={styles.footer}>
                <div className={styles.toggle} onClick={handleToggle}>
                    <div className={`${styles.toggleSwitch} ${isAvailable ? styles.active : ''} ${isToggling ? styles.loading : ''}`} />
                    <span className={styles.toggleLabel}>
                        {isAvailable ? '판매 중' : '품절'}
                    </span>
                </div>

                <div className={styles.actions}>
                    <Link
                        href={`/admin/menus/${menu.id}/edit`}
                        className={styles.actionBtn}
                        aria-label="수정"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Pencil size={18} strokeWidth={2} />
                    </Link>
                    <button
                        className={`${styles.actionBtn} ${styles.delete}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(menu.id);
                        }}
                        aria-label="삭제"
                    >
                        <Trash2 size={18} strokeWidth={2} />
                    </button>
                </div>
            </div>
        </div >
    );
}
