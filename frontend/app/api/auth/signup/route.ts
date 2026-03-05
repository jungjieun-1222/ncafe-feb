import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8012';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const signupRes = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!signupRes.ok) {
        const error = await signupRes.json().catch(() => ({ message: '회원가입에 실패했습니다.' }));
        return NextResponse.json(error, { status: signupRes.status });
    }

    const data = await signupRes.json();
    return NextResponse.json(data);
}
