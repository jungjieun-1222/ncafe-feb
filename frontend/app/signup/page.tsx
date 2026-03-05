import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';
import styles from '../login/login.module.css';

export default function SignupPage() {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <Link href="/" className={styles.titleArea}>
                    <h1 className="calligraphy">🍵 엔카페</h1>
                    <p>전통의 정취가 묻어나는 새로운 인연의 시작</p>
                </Link>
                <SignupForm />
            </div>
        </div>
    );
}
