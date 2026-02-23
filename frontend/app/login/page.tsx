import LoginForm from '@/components/auth/LoginForm';
import styles from './login.module.css';

export default function LoginPage() {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.titleArea}>
                    <h1>NCafe</h1>
                    <p>관리자 시스템 로그인</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
