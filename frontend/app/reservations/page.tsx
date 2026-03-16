'use client';

import React, { useState } from 'react';
import styles from './reservations.module.css';
import { useAuthStore } from '@/stores/useAuthStore';
import { Calendar, Clock, Users, Phone, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const TIME_SLOTS = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function ReservationPage() {
    const { isAuthenticated, user } = useAuthStore();
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [headcount, setHeadcount] = useState(2);
    const [userName, setUserName] = useState(user?.name || user?.username || '');
    const [contact, setContact] = useState(user?.phone || '');
    const [isLoading, setIsLoading] = useState(false);

    // 전화번호 포맷팅 함수 (010-0000-0000 형식)
    const formatPhone = (value: string) => {
        const cleaned = value.replace(/\D/g, ''); // 숫자만 남김
        const truncated = cleaned.slice(0, 11); // 최대 11자리
        
        if (truncated.length <= 3) return truncated;
        if (truncated.length <= 7) return `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
        return `${truncated.slice(0, 3)}-${truncated.slice(3, 7)}-${truncated.slice(7)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value);
        setContact(formatted);
    };
    const router = useRouter();

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.loginPrompt}>
                    <h2>로그인이 필요합니다</h2>
                    <p>카페 자리 예약은 회원만 가능합니다.</p>
                    <Link href="/login" className={styles.loginBtn}>로그인하러 가기</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !startTime || !contact || headcount < 1) {
            toast.error('모든 필드를 입력해주세요.');
            return;
        }

        setIsLoading(true);

        const endHour = parseInt(startTime.split(':')[0]) + 1;
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;

        try {
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id, // Assuming store has id
                    guestName: userName,
                    guestPhone: contact,
                    reserveDate: date,
                    reserveTime: `${startTime}:00`,
                    guestCount: headcount
                }),
            });

            if (res.ok) {
                toast.success('예약 신청이 완료되었습니다! 관리자 승인 후 확정됩니다.');
                router.push('/mypage');
            } else {
                const errorMsg = await res.text();
                toast.error(errorMsg || '예약에 실패했습니다.');
            }
        } catch (error) {
            console.error('Reservation error:', error);
            toast.error('서버 통신 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>자리 예약하기</h1>
                <p className={styles.subtitle}>고즈넉한 한옥 공간에서의 여유를 미리 준비하세요.</p>

                <form onSubmit={handleSubmit}>
                    <div className={styles.section}>
                        <label className={styles.label}>
                            <UserIcon size={16} style={{marginRight: 6}} />
                            예약자 성함
                        </label>
                        <input 
                            type="text" 
                            className={styles.input} 
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="성함을 입력해주세요"
                        />
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>
                            <Phone size={16} style={{marginRight: 6}} />
                            연락처
                        </label>
                        <input 
                            type="tel" 
                            className={styles.input} 
                            value={contact}
                            onChange={handlePhoneChange}
                            placeholder="010-0000-0000"
                            maxLength={13}
                        />
                    </div>

                    <div className={styles.inputGrid}>
                        <div className={styles.section}>
                            <label className={styles.label}>
                                <Calendar size={16} style={{marginRight: 6}} />
                                예약 날짜
                            </label>
                            <input 
                                type="date" 
                                className={styles.input} 
                                value={date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className={styles.section}>
                            <label className={styles.label}>
                                <Users size={16} style={{marginRight: 6}} />
                                인원수
                            </label>
                            <input 
                                type="number" 
                                className={styles.input} 
                                value={headcount}
                                min={1}
                                max={20}
                                onChange={(e) => setHeadcount(parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>
                            <Clock size={16} style={{marginRight: 6}} />
                            예약 시간 (1시간 단위)
                        </label>
                        <div className={styles.timeGrid}>
                            {TIME_SLOTS.map(time => (
                                <button
                                    key={time}
                                    type="button"
                                    className={`${styles.timeButton} ${startTime === time ? styles.selectedTime : ''}`}
                                    onClick={() => setStartTime(time)}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? '신청 중...' : '예약 신청하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}
