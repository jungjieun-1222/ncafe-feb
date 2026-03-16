'use client';

import { useState } from 'react';
import styles from './LoginForm.module.css';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

            if (response.ok && data.user) {
                toast.success('로그인 성공');
                const loggedInUser = {
                    id: data.user.id,
                    username: data.user.username || data.user.nickname,
                    nickname: data.user.nickname,
                    role: data.user.role || 'ROLE_USER'
                };
                setUser(loggedInUser);

                // 장바구니 병합 로직
                let guestCartId = localStorage.getItem('cartId');
                // Sanitize guestCartId if it exists
                if (guestCartId && guestCartId.includes(':')) {
                    guestCartId = guestCartId.split(':')[0];
                }
                const userCartId = `user-${loggedInUser.id}`;
                
                if (guestCartId && guestCartId !== userCartId) {
                    try {
                        await fetch(`/api/v1/carts/merge?guestCartId=${guestCartId}&userCartId=${userCartId}`, {
                            method: 'POST'
                        });
                    } catch (err) {
                        console.error('Cart merge failed:', err);
                    }
                }
                
                // localStorage 갱신
                localStorage.setItem('cartId', userCartId);

                window.dispatchEvent(new Event('login'));
                
                // 리다이렉트 처리: 기존에 가려던 페이지가 있으면 그쪽으로, 없으면 관리자 또는 메인으로
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                router.push(redirect || '/'); 
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
                <label htmlFor="username">이메일</label>
                <input
                    id="username"
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="등록하신 이메일을 입력하세요"
                    required
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="password">비밀번호</label>
                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        required
                        style={{ paddingRight: '3rem', width: '100%' }}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ 
                            position: 'absolute', 
                            right: '1rem', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0'
                        }}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
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
