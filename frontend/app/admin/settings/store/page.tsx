'use client';

import { useState, useEffect } from 'react';
import PageHeader from '../../menus/_components/MenuList/PageHeader/PageHeader';
import { Store, Clock, MapPin, Phone, Info } from 'lucide-react';
import styles from '../settings.module.css';
import toast from 'react-hot-toast';

interface StoreSettings {
    name: string;
    logoUrl: string;
    phoneNumber: string;
    address: string;
    operatingHours: string;
    announcement: string;
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export default function StoreSettingsPage() {
    const [settings, setSettings] = useState<StoreSettings>({
        name: '',
        logoUrl: '',
        phoneNumber: '',
        address: '',
        operatingHours: '',
        announcement: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings/store');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            toast.error('설정을 불러오는 데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/settings/store', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                toast.success('매장 정보가 저장되었습니다.');
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
                title="운영 정보 관리" 
                subtitle="카페의 기본 정보와 영업 시간을 설정합니다."
            />

            <form onSubmit={handleSave}>
                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}><Store size={20} /> 기본 정보</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.field}>
                            <label className={styles.label}>카페 이름</label>
                            <input 
                                className={styles.input} 
                                value={settings.name || ''}
                                onChange={e => setSettings({...settings, name: e.target.value})}
                                placeholder="카페 이름을 입력하세요"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>대표 번호</label>
                            <input 
                                className={styles.input}
                                value={settings.phoneNumber || ''}
                                onChange={e => setSettings({...settings, phoneNumber: e.target.value})}
                                placeholder="02-1234-5678"
                            />
                        </div>
                        <div className={`${styles.field} ${styles.fullWidth}`}>
                            <label className={styles.label}>주소</label>
                            <input 
                                className={styles.input}
                                value={settings.address || ''}
                                onChange={e => setSettings({...settings, address: e.target.value})}
                                placeholder="카페 주소를 입력하세요"
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}><Clock size={20} /> 영업 시간</h3>
                    <div className={styles.field}>
                        <label className={styles.label}>영업 시간 안내</label>
                        <textarea 
                            className={`${styles.input} ${styles.textarea}`}
                            value={settings.operatingHours || ''}
                            onChange={e => setSettings({...settings, operatingHours: e.target.value})}
                            placeholder="예: 평일 09:00 - 22:00, 주말 10:00 - 21:00"
                        />
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}><Info size={20} /> 공지사항</h3>
                    <div className={styles.field}>
                        <label className={styles.label}>메인 공지 문구</label>
                        <textarea 
                            className={`${styles.input} ${styles.textarea}`}
                            value={settings.announcement || ''}
                            onChange={e => setSettings({...settings, announcement: e.target.value})}
                            placeholder="고객 화면 상단에 노출될 공지사항을 입력하세요."
                        />
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                        {isSaving ? '저장 중...' : '설정 저장하기'}
                    </button>
                </div>
            </form>
        </div>
    );
}
