import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8012';

export async function POST(req: NextRequest) {
    const body = await req.json();

    // 1. Spring Boot 로그인 API 호출 (서버 -> 서버)
    // Backend expects 'username' and 'password'
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!loginRes.ok) {
        const error = await loginRes.json().catch(() => ({ message: '로그인에 실패했습니다.' }));
        return NextResponse.json(error, { status: loginRes.status });
    }

    const tokenData = await loginRes.json();
    // We'll normalize this. Backend currently returns 'username' and 'message'.
    // I will update backend to return 'token'.
    const token = tokenData.token || 'mock-jwt-token-for-now';

    // 2. 사용자 정보 조회 (Backend에서 /auth/me 가 세션 기반이면 곤란함)
    // BFF는 JWT를 헤더에 넣어서 정보를 가져올 수 있어야 함.
    const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    let user = null;
    if (meRes.ok) {
        user = await meRes.json();
    }

    // 3. 세션에 저장 (httpOnly 쿠키로 암호화되어 저장됨)
    const session = await getSession();
    session.token = token;
    if (user) {
        session.user = {
            id: user.id || 0,
            email: user.email || '',
            nickname: user.username || user.nickname || '',
            role: user.role || 'ROLE_USER',
        };
    } else {
        // Fallback if /auth/me fails or is still session based
        session.user = {
            id: 0,
            email: '',
            nickname: tokenData.username || 'User',
            role: 'ROLE_USER'
        };
    }
    await session.save();

    return NextResponse.json({ user: session.user });
}
