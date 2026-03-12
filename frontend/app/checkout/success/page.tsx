'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Home, List } from 'lucide-react';
import styles from './success.module.css';
import { Suspense } from 'react';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const approvalNumber = searchParams.get('approvalNumber');

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <CheckCircle size={80} className={styles.icon} />
                </div>
                <h1 className={styles.title}>주문이 성공적으로 완료되었습니다!</h1>
                <div className={styles.approvalBox}>
                    <span className={styles.approvalLabel}>결제 승인 번호</span>
                    <span className={styles.approvalValue}>{approvalNumber || '--------'}</span>
                </div>
                <p className={styles.subtitle}>
                    엔카페를 이용해 주셔서 감사합니다.<br />
                    정성을 다해 준비하겠습니다.
                </p>
                
                <div className={styles.btnGroup}>
                    <button onClick={() => router.push('/')} className={styles.secondaryBtn}>
                        <Home size={18} /> 홈으로
                    </button>
                    <button onClick={() => router.push('/menus')} className={styles.primaryBtn}>
                        <List size={18} /> 메뉴 더보기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div>Loading order details...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
