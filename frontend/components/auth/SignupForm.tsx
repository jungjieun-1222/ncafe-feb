'use client';

import { useState } from 'react';
import styles from './LoginForm.module.css'; // Reusing styles if possible, or create new
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('회원가입 성공! 로그인해주세요.');
                router.push('/login');
            } else {
                toast.error(data.message || '회원가입 실패');
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
                    placeholder="사용하실 아이디를 입력하세요"
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
            <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? '가입 중...' : '회원가입'}
            </button>
            <div className={styles.links}>
                <span>이미 계정이 있으신가요? </span>
                <Link href="/login" className={styles.link}>로그인</Link>
            </div>
        </form>
    );
}
