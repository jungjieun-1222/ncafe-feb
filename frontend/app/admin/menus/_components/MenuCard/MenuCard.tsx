'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { Menu } from '@/types/menu';
import styles from './MenuCard.module.css';
import { MenuResponse } from '../MenuList/useMenus';

interface MenuCardProps {
    menu: MenuResponse;
    onToggleSoldOut: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function MenuCard({ menu, onToggleSoldOut, onDelete }: MenuCardProps) {

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const [imgError, setImgError] = useState(false);

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                {(menu.imageSrc && !imgError) ? (
                    <Image
                        src={`http://localhost:8080/${menu.imageSrc}`}
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
            </div>

            {/* 품절 오버레이 */}
            {menu.isSoldOut && (
                <div className={styles.soldOutOverlay}>
                    <span className={styles.soldOutBadge}>SOLD OUT</span>
                </div>
            )}

            <div className={styles.body}>
                <div className={styles.header}>
                    <span className={styles.category}>{menu.categoryName || '일반'}</span>
                    <span className={styles.price}>{formatPrice(menu.price)}원</span>
                </div>

                <div className={styles.nameGroup}>
                    <h3 className={styles.name}>{menu.korName}</h3>
                    <p className={styles.engName}>{menu.engName}</p>
                </div>

                <div className={styles.footer}>
                    <div className={styles.toggle} onClick={() => onToggleSoldOut(menu.id)}>
                        {/* 토글 스위치 */}
                        <div className={`${styles.toggleSwitch} ${menu.isSoldOut ? styles.active : ''}`} />
                        <span className={styles.toggleLabel}>품절</span>
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
            </div>
        </div >
    );
}
