'use client';

import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import styles from './OptionChangeModal.module.css';
import { getOptionsByCategory, MenuOption, OptionGroup } from '../_constants/menuOptions';

interface CartItem {
    id: string;
    menuId: number;
    menuName: string;
    basePrice: number;
    quantity: number;
    options: MenuOption[];
}

interface OptionChangeModalProps {
    item: CartItem;
    onClose: () => void;
    onUpdate: (itemId: string, optionIds: number[]) => Promise<void>;
}

export default function OptionChangeModal({ item, onClose, onUpdate }: OptionChangeModalProps) {
    const [availableGroups, setAvailableGroups] = useState<OptionGroup[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>(item.options || []);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchMenuCategory = async () => {
            try {
                const res = await fetch(`/api/menus/${item.menuId}`);
                if (res.ok) {
                    const menuData = await res.json();
                    const groups = getOptionsByCategory(menuData.categoryName);
                    setAvailableGroups(groups);
                }
            } catch (err) {
                console.error('Failed to fetch menu info:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuCategory();
    }, [item.menuId]);

    const isOptionSelected = (opt: MenuOption) => {
        return selectedOptions.some(s => s.id === opt.id);
    };

    const handleSelectOption = (group: OptionGroup, opt: MenuOption) => {
        if (group.type === 'radio') {
            setSelectedOptions(prev => {
                const filtered = prev.filter(p => p.name !== group.name);
                return [...filtered, opt];
            });
        } else {
            setSelectedOptions(prev => {
                if (isOptionSelected(opt)) {
                    return prev.filter(p => p.id !== opt.id);
                } else {
                    return [...prev, opt];
                }
            });
        }
    };

    const calculateTotalPrice = () => {
        const optionsPrice = selectedOptions.reduce((acc, opt) => acc + opt.price, 0);
        return (item.basePrice + optionsPrice) * item.quantity;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const optionIds = selectedOptions.map(opt => opt.id);
            await onUpdate(item.id, optionIds);
            onClose();
        } catch (err) {
            console.error(err);
            alert('옵션 변경에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>옵션 변경: {item.menuName}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.content}>
                    {availableGroups.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#767676', padding: '40px 0' }}>
                            선택 가능한 옵션이 없는 메뉴입니다.
                        </p>
                    ) : (
                        availableGroups.map((group, gIdx) => (
                            <div key={gIdx} className={styles.optionGroup}>
                                <h3 className={styles.groupTitle}>{group.name}</h3>
                                <div className={styles.optionsList}>
                                    {group.options.map((opt, oIdx) => {
                                        const selected = isOptionSelected(opt);
                                        return (
                                            <div 
                                                key={oIdx} 
                                                className={`${styles.optionItem} ${selected ? styles.selected : ''}`}
                                                onClick={() => handleSelectOption(group, opt)}
                                            >
                                                <div className={styles.optionInfo}>
                                                    <div className={group.type === 'radio' ? styles.radio : styles.checkbox}>
                                                        {selected && (
                                                            group.type === 'radio' ? <div className={styles.innerCircle} /> : <Check size={14} className={styles.checkMark} />
                                                        )}
                                                    </div>
                                                    <span className={styles.optionName}>{opt.value}</span>
                                                </div>
                                                <span className={styles.optionPrice}>
                                                    {opt.price > 0 ? `+${opt.price.toLocaleString()}원` : '0원'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.footer}>
                    <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>변경 후 수량 {item.quantity}개의 합계</span>
                        <span className={styles.totalAmount}>{calculateTotalPrice().toLocaleString()}원</span>
                    </div>
                    <button 
                        className={styles.submitBtn} 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '변경 중...' : '변경 완료'}
                    </button>
                </div>
            </div>
        </div>
    );
}
