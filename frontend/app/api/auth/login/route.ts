import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://backend:8081';

export async function POST(req: NextRequest) {
    const body = await req.json();

    // 1. Spring Boot 로그인 API 호출 (서버 -> 서버)
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!loginRes.ok) {
        const error = await loginRes.json().catch(() => ({ message: '로그인에 실패했습니다.' }));
        return NextResponse.json(error, { status: loginRes.status });
    }

    const loginData = await loginRes.json();
    const token = loginData.token || 'mock-jwt-token';

    // 2. 사용자 정보 조회 (/auth/me -> /auth/session 으로 변경됨)
    const sessionRes = await fetch(`${API_BASE}/auth/session`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    let user = loginData.user || null;
    if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        if (sessionData.user) {
            user = sessionData.user;
        }
    }

    // 3. 세션에 저장 (httpOnly 쿠키로 암호화되어 저장됨)
    const session = await getSession();
    session.token = token;
    if (user) {
        session.user = {
            id: user.id || '',
            email: user.email || '',
            nickname: user.nickname || user.username || 'User',
            role: user.role || 'ROLE_USER',
        };
    } else {
        // Fallback
        session.user = {
            id: '',
            email: '',
            nickname: 'User',
            role: 'ROLE_USER'
        };
    }
    await session.save();

    return NextResponse.json({ user: session.user });
}
