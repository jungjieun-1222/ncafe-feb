'use client';

import { useState } from 'react';
import styles from './LoginForm.module.css';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const setUser = useAuthStore(state => state.setUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('로그인 성공');
                setUser({
                    id: data.user.id,
                    username: data.user.nickname,
                    role: data.user.role || 'ROLE_USER'
                });
                window.dispatchEvent(new Event('login'));
                router.push('/admin');
            } else {
                toast.error(data.message || '로그인 실패');
            }
        } catch (error) {
            toast.error('서버와 통신 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="username">아이디</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="아이디를 입력하세요"
                    required
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="password">비밀번호</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    required
                />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
            </button>
            <div className={styles.links}>
                <span>계정이 없으신가요? </span>
                <Link href="/signup" className={styles.link}>회원가입</Link>
            </div>
        </form>
    );
}
