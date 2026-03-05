import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import styles from './login.module.css';

export default function LoginPage() {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <Link href="/" className={styles.titleArea}>
                    <h1 className="calligraphy">🍵 엔카페</h1>
                    <p>전통의 정취가 묻어나는 공간으로의 초대</p>
                </Link>
                <LoginForm />
            </div>
        </div>
    );
}
