'use client';

import { useState, useEffect } from 'react';
import PageHeader from '../../menus/_components/MenuList/PageHeader/PageHeader';
import { ShieldCheck, ShoppingBag, Percent, Gift } from 'lucide-react';
import styles from '../settings.module.css';
import toast from 'react-hot-toast';

interface PolicySettings {
    orderReceptionOpen: boolean;
    soldOutHandling: string;
    rewardRate: number;
    welcomeBenefit: string;
}

export default function PolicySettingsPage() {
    const [settings, setSettings] = useState<PolicySettings>({
        orderReceptionOpen: true,
        soldOutHandling: 'LABEL',
        rewardRate: 5,
        welcomeBenefit: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings/policy');
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    orderReceptionOpen: data.orderReceptionOpen ?? true,
                    soldOutHandling: data.soldOutHandling || 'LABEL',
                    rewardRate: data.rewardRate ?? 0,
                    welcomeBenefit: data.welcomeBenefit || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            toast.error('설정을 불러오는 데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const updateSingleSetting = async (key: string, value: any) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        
        try {
            const res = await fetch('/api/admin/settings/policy', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            });
            if (res.ok) {
                toast.success('변경사항이 즉시 반영되었습니다.', { id: 'auto-save' });
            }
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/settings/policy', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                toast.success('정책 설정이 모두 저장되었습니다.');
            } else {
                throw new Error('저장 실패');
            }
        } catch (error) {
            toast.error('저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className={styles.container}>로딩 중...</div>;

    return (
        <div className={styles.container}>
            <PageHeader 
                title="서비스 정책 설정" 
                subtitle="주문 접수 상태와 품절 표시 정책 등을 실시간으로 관리합니다."
            />

            <form onSubmit={handleSave}>
                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}><ShoppingBag size={20} /> 주문 및 품절 설정 (즉시 반영)</h3>
                    
                    <div className={styles.policyRow}>
                        <div className={styles.policyInfo}>
                            <h4>주문 접수 활성화</h4>
                            <p>OFF로 설정하면 고객이 메뉴를 장바구니에 담거나 주문할 수 없습니다.</p>
                        </div>
                        <label className={styles.switch}>
                            <input 
                                type="checkbox"
                                checked={settings.orderReceptionOpen}
                                onChange={e => updateSingleSetting('orderReceptionOpen', e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>품절 메뉴 표시 방식</label>
                        <select 
                            className={styles.input}
                            value={settings.soldOutHandling}
                            onChange={e => updateSingleSetting('soldOutHandling', e.target.value)}
                        >
                            <option value="LABEL">품절 배지 표시 (목록 노출)</option>
                            <option value="HIDE">목록에서 즉시 숨김</option>
                        </select>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}><Percent size={20} /> 혜택 및 적립 설정</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label className={styles.label}>결제 금액 적립률 (%)</label>
                            <input 
                                type="number"
                                className={styles.input}
                                value={settings.rewardRate}
                                onChange={e => setSettings({...settings, rewardRate: Number(e.target.value)})}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>신규 가입 혜택</label>
                            <input 
                                className={styles.input}
                                value={settings.welcomeBenefit}
                                onChange={e => setSettings({...settings, welcomeBenefit: e.target.value})}
                                placeholder="예: 1,000P 즉시 지급"
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                        {isSaving ? '저장 중...' : '정책 저장하기'}
                    </button>
                </div>
            </form>
        </div>
    );
}
