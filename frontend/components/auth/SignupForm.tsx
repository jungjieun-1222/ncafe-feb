'use client';

import { useState } from 'react';
import styles from './LoginForm.module.css'; // Reusing styles if possible, or create new
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupForm() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    
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
        setPhone(formatted);
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUsernameChecked, setIsUsernameChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const checkUsername = async () => {
        if (!username) {
            toast.error('아이디를 입력해주세요.');
            return;
        }
        try {
            const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
            const data = await res.json();
            if (data.exists) {
                toast.error('이미 사용 중인 아이디입니다.');
                setIsUsernameChecked(false);
            } else {
                toast.success('사용 가능한 아이디입니다.');
                setIsUsernameChecked(true);
            }
        } catch (err) {
            toast.error('중복 확인 중 오류가 발생했습니다.');
        }
    };

    const checkNickname = async () => {
        if (!nickname) {
            toast.error('닉네임을 입력해주세요.');
            return;
        }
        try {
            const res = await fetch(`/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`);
            const data = await res.json();
            if (data.exists) {
                toast.error('이미 사용 중인 닉네임입니다.');
                setIsNicknameChecked(false);
            } else {
                toast.success('사용 가능한 닉네임입니다.');
                setIsNicknameChecked(true);
            }
        } catch (err) {
            toast.error('중복 확인 중 오류가 발생했습니다.');
        }
    };

    const checkEmail = async () => {
        if (!email) {
            toast.error('이메일을 입력해주세요.');
            return;
        }
        try {
            const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (data.exists) {
                toast.error('이미 등록된 이메일입니다.');
                setIsEmailChecked(false);
            } else {
                toast.success('사용 가능한 이메일입니다.');
                setIsEmailChecked(true);
            }
        } catch (err) {
            toast.error('중복 확인 중 오류가 발생했습니다.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!isUsernameChecked) {
            toast.error('아이디 중복 확인이 필요합니다.');
            return;
        }

        if (!isNicknameChecked) {
            toast.error('닉네임 중복 확인이 필요합니다.');
            return;
        }

        if (!isEmailChecked) {
            toast.error('이메일 중복 확인이 필요합니다.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, name, nickname, phone, email, password }),
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
                <div className={styles.row}>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setIsUsernameChecked(false);
                        }}
                        placeholder="사용하실 아이디를 입력하세요"
                        required
                    />
                    <button type="button" onClick={checkUsername} className={styles.checkBtn}>
                        중복 확인
                    </button>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="name">성함</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="성함을 입력하세요"
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="nickname">닉네임</label>
                <div className={styles.row}>
                    <input
                        id="nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                            setIsNicknameChecked(false);
                        }}
                        placeholder="멋진 닉네임을 지어주세요"
                        required
                    />
                    <button type="button" onClick={checkNickname} className={styles.checkBtn}>
                        중복 확인
                    </button>
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="phone">전화번호</label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="010-0000-0000"
                    maxLength={13}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="email">이메일 (아이디)</label>
                <div className={styles.row}>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setIsEmailChecked(false);
                        }}
                        placeholder="example@ncafe.com"
                        required
                    />
                    <button type="button" onClick={checkEmail} className={styles.checkBtn}>
                        중복 확인
                    </button>
                </div>
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
                {isLoading ? '가입 중...' : '나리의 회원가입 완료'}
            </button>
            <div className={styles.links}>
                <span>이미 계정이 있으신가요? </span>
                <Link href="/login" className={styles.link}>로그인</Link>
            </div>
        </form>
    );
}
