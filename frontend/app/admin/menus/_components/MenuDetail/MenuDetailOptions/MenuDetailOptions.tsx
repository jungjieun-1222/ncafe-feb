'use client';

import React, { useState, useEffect } from 'react';
import { useMenuDetail } from '../MenuDetailInfo/useMenuDetail';
import styles from './MenuDetailOptions.module.css';
import Button from '@/components/common/Button/Button';
import toast from 'react-hot-toast';

interface Option {
    id: number;
    name: string;
    value: string;
    price: number;
}

export default function MenuDetailOptions({ slug }: { slug: string }) {
    const menu = useMenuDetail(slug);
    const [allOptions, setAllOptions] = useState<Option[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newOption, setNewOption] = useState({ name: '', value: '', price: 0 });
    const [showAllOptions, setShowAllOptions] = useState(false);

    useEffect(() => {
        fetchAllOptions();
    }, []);

    const fetchAllOptions = async () => {
        try {
            const res = await fetch('/api/admin/options');
            if (res.ok) {
                const data = await res.json();
                setAllOptions(data);
            }
        } catch (error) {
            console.error('Failed to fetch global options:', error);
        }
    };

    const handleLinkOption = async (optionId: number) => {
        if (!menu) return;
        try {
            const res = await fetch(`/api/admin/menus/${menu.id}/options/${optionId}`, {
                method: 'POST',
            });
            if (res.ok) {
                toast.success('옵션이 추가되었습니다.');
                window.location.reload(); // Quick way to refresh both MenuDetailInfo and Options
            }
        } catch (error) {
            toast.error('옵션을 추가하는 중 오류가 발생했습니다.');
        }
    };

    const handleUnlinkOption = async (optionId: number) => {
        if (!menu) return;
        if (!confirm('이 메뉴에서 이 옵션을 제거하시겠습니까?')) return;
        try {
            const res = await fetch(`/api/admin/menus/${menu.id}/options/${optionId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('옵션이 제거되었습니다.');
                window.location.reload();
            }
        } catch (error) {
            toast.error('옵션을 제거하는 중 오류가 발생했습니다.');
        }
    };

    const handleCreateGlobalOption = async () => {
        if (!newOption.name || !newOption.value) {
            toast.error('이름과 값을 입력해주세요.');
            return;
        }
        try {
            const res = await fetch('/api/admin/options', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOption)
            });
            if (res.ok) {
                toast.success('새 글로벌 옵션이 생성되었습니다.');
                setNewOption({ name: '', value: '', price: 0 });
                fetchAllOptions();
            }
        } catch (error) {
            toast.error('옵션 생성 중 오류가 발생했습니다.');
        }
    };

    const handleDeleteGlobalOption = async (id: number) => {
        if (!confirm('이 옵션을 시스템에서 완전히 삭제하시겠습니까? (다른 메뉴에서도 사라집니다)')) return;
        try {
            const res = await fetch(`/api/admin/options/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('글로벌 옵션이 삭제되었습니다.');
                fetchAllOptions();
            }
        } catch (error) {
            toast.error('옵션 삭제 중 오류가 발생했습니다.');
        }
    };

    if (!menu) return null;

    const linkedOptions = menu.options || [];
    const availableOptions = allOptions.filter(opt => !linkedOptions.some((lo: Option) => lo.id === opt.id));

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.sectionTitle}>메뉴 옵션 관리</h2>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAllOptions(!showAllOptions)}
                >
                    {showAllOptions ? '닫기' : '옵션 추가/편집'}
                </Button>
            </div>

            <div className={styles.subTitle}>현재 적용된 옵션 ({linkedOptions.length})</div>
            {/* 현재 연결된 옵션 리스트 */}
            <div className={styles.optionList}>
                {linkedOptions.length > 0 ? (
                    linkedOptions.map((option: Option) => (
                        <div key={option.id} className={styles.optionItem}>
                            <div className={styles.optionInfo}>
                                <span className={styles.optionName}>[{option.name}]</span>
                                <span className={styles.optionValue}>{option.value}</span>
                                {option.price > 0 && <span className={styles.optionPrice}>+{option.price}원</span>}
                            </div>
                            <button 
                                className={styles.removeBtn} 
                                onClick={() => handleUnlinkOption(option.id)}
                                title="이 메뉴에서 이 옵션 제거"
                            >
                                연결 해제
                            </button>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>연결된 옵션이 없습니다.</div>
                )}
            </div>

            {/* 전체 옵션 목록 및 관리 (추가 모드) */}
            {showAllOptions && (
                <div className={styles.managementSection}>
                    <div className={styles.divider} />
                    <h3 className={styles.subTitle}>사용 가능한 모든 옵션</h3>
                    <div className={styles.allOptionsList}>
                        {availableOptions.map(opt => (
                            <div key={opt.id} className={styles.globalOptionItem}>
                                <span>{opt.name}: {opt.value} (+{opt.price}원)</span>
                                <div className={styles.globalActions}>
                                    <button className={styles.addBtn} onClick={() => handleLinkOption(opt.id)}>메뉴에 추가</button>
                                    <button className={styles.deleteGlobalBtn} onClick={() => handleDeleteGlobalOption(opt.id)}>DB삭제</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.createSection}>
                        <h3 className={styles.subTitle}>새 글로벌 옵션 생성</h3>
                        <div className={styles.inputGroup}>
                            <input 
                                placeholder="분류 (예: 온도)" 
                                value={newOption.name}
                                onChange={e => setNewOption({...newOption, name: e.target.value})}
                            />
                            <input 
                                placeholder="값 (예: ICE)" 
                                value={newOption.value}
                                onChange={e => setNewOption({...newOption, value: e.target.value})}
                            />
                            <input 
                                type="number"
                                placeholder="가격" 
                                value={newOption.price}
                                onChange={e => setNewOption({...newOption, price: parseInt(e.target.value) || 0})}
                            />
                            <Button size="sm" onClick={handleCreateGlobalOption}>생성</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
