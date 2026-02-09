'use client';

import { useParams } from 'next/navigation';
import { menus } from '@/mocks/menuData';
import styles from './MenuDetailOptions.module.css';

export default function MenuDetailOptions() {
    const { id } = useParams();
    const menu = menus.find((m) => m.id === id);

    if (!menu) return null;

    const { options } = menu;

    return (
        <div>
            <h2 className={styles.sectionTitle}>옵션</h2>
            <div className={styles.optionList}>
                {options && options.length > 0 ? (
                    options.map((option) => (
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
    );
}
