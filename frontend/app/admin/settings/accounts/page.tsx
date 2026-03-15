'use client';

import { useState, useEffect } from 'react';
import PageHeader from '../../menus/_components/MenuList/PageHeader/PageHeader';
import { Shield, Users, UserPlus, Trash2, Eye, EyeOff } from 'lucide-react';
import styles from '../settings.module.css';
import toast from 'react-hot-toast';

interface Account {
    id: string;
    username: string;
    name: string;
    role: string;
}

export default function AccountSettingsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newAccount, setNewAccount] = useState({ username: '', password: '', name: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'ADMIN' | 'USER'>('ADMIN');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordAdd, setShowPasswordAdd] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await fetch('/api/admin/accounts');
            if (res.ok) {
                const data = await res.json();
                setAccounts(data);
            }
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
            toast.error('계정 정보를 불러오는 데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/accounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAccount)
            });
            if (res.ok) {
                toast.success('스태프 계정이 생성되었습니다.');
                setIsAdding(false);
                setNewAccount({ username: '', password: '', name: '' });
                fetchAccounts();
            } else {
                throw new Error('생성 실패');
            }
        } catch (error) {
            toast.error('계정 생성 중 오류가 발생했습니다.');
        }
    };

    const handleDeleteAccount = async (id: string) => {
        if (!confirm('정말로 이 계정을 삭제하시겠습니까?')) return;
        try {
            const res = await fetch(`/api/admin/accounts/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('계정이 삭제되었습니다.');
                fetchAccounts();
            }
        } catch (error) {
            toast.error('삭제 중 오류가 발생했습니다.');
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/accounts/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword })
            });
            if (res.ok) {
                toast.success('비밀번호가 변경되었습니다.');
                setIsChangingPassword(false);
                setNewPassword('');
            }
        } catch (error) {
            toast.error('비밀번호 변경 중 오류가 발생했습니다.');
        }
    };

    const filteredAccounts = accounts.filter(acc => {
        if (activeTab === 'ADMIN') return acc.role.includes('MASTER') || acc.role.includes('STAFF');
        return acc.role === 'ROLE_USER';
    });

    if (isLoading) return <div className={styles.container}>로딩 중...</div>;

    return (
        <div className={styles.container}>
            <PageHeader 
                title="사용자 및 권한 관리" 
                subtitle="관리자 및 일반 사용자 계정을 관리하고 권한을 설정합니다."
            />

            <div className={styles.card}>
                <h3 className={styles.sectionTitle}><Shield size={20} /> 관리자 보안</h3>
                <div className={styles.policyRow}>
                    <div className={styles.policyInfo}>
                        <h4>비밀번호 변경</h4>
                        <p>현재 로그인된 마스터 관리자 계정의 비밀번호를 업데이트합니다.</p>
                    </div>
                    <button className={styles.saveBtn} onClick={() => setIsChangingPassword(true)}>변경하기</button>
                </div>

                {isChangingPassword && (
                    <form onSubmit={handleChangePassword} style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1rem' }}>
                        <div className={styles.field}>
                            <label className={styles.label}>새 비밀번호</label>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className={styles.input}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="새로운 비밀번호를 입력하세요"
                                    required
                                    style={{ width: '100%', paddingRight: '3rem' }}
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
                        <div className={styles.actions}>
                            <button type="button" onClick={() => setIsChangingPassword(false)}>취소</button>
                            <button type="submit" className={styles.saveBtn}>저장</button>
                        </div>
                    </form>
                )}
            </div>

            <div className={styles.card}>
                <div className={styles.tabGroup}>
                    <div 
                        className={`${styles.tab} ${activeTab === 'ADMIN' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('ADMIN')}
                    >
                        관리자 및 스태프
                    </div>
                    <div 
                        className={`${styles.tab} ${activeTab === 'USER' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('USER')}
                    >
                        일반 사용자
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                        {activeTab === 'ADMIN' ? <Users size={20} /> : <Users size={20} />} 
                        {activeTab === 'ADMIN' ? '운영팀 목록' : '고객 목록'}
                    </h3>
                    {activeTab === 'ADMIN' && (
                        <button className={styles.saveBtn} onClick={() => setIsAdding(true)}>
                            <UserPlus size={18} style={{ marginRight: '0.5rem' }} /> 스태프 추가
                        </button>
                    )}
                </div>

                <table className={styles.accountTable}>
                    <thead>
                        <tr>
                            <th>이름 (닉네임)</th>
                            <th>아이디</th>
                            <th>권한</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAccounts.map(account => (
                            <tr key={account.id}>
                                <td>{account.name}</td>
                                <td>{account.username}</td>
                                <td>
                                    <span className={`
                                        ${styles.roleBadge} 
                                        ${account.role.includes('MASTER') ? styles.roleMaster : 
                                          account.role.includes('STAFF') ? styles.roleStaff : 
                                          styles.roleUser}
                                    `}>
                                        {account.role.includes('MASTER') ? '마스터' : 
                                         account.role.includes('STAFF') ? '스태프' : '일반사용자'}
                                    </span>
                                </td>
                                <td>
                                    {!account.role.includes('MASTER') && (
                                        <button 
                                            onClick={() => handleDeleteAccount(account.id)}
                                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAdding && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <form onSubmit={handleCreateAccount} className={styles.card} style={{ width: '400px', marginBottom: 0 }}>
                        <h3 className={styles.sectionTitle}><UserPlus size={20} /> 새 스태프 추가</h3>
                        <div className={styles.formGrid} style={{ gridTemplateColumns: '1fr' }}>
                            <div className={styles.field}>
                                <label className={styles.label}>이름</label>
                                <input className={styles.input} value={newAccount.name} onChange={e => setNewAccount({...newAccount, name: e.target.value})} required />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>아이디</label>
                                <input className={styles.input} value={newAccount.username} onChange={e => setNewAccount({...newAccount, username: e.target.value})} required />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>비밀번호</label>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <input 
                                        type={showPasswordAdd ? "text" : "password"} 
                                        className={styles.input} 
                                        value={newAccount.password} 
                                        onChange={e => setNewAccount({...newAccount, password: e.target.value})} 
                                        required 
                                        style={{ width: '100%', paddingRight: '3rem' }}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPasswordAdd(!showPasswordAdd)}
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
                                        {showPasswordAdd ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <button type="button" onClick={() => setIsAdding(false)}>취소</button>
                            <button type="submit" className={styles.saveBtn}>생성하기</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
