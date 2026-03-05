import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionUser {
    id: number;
    email: string;
    nickname: string;
    role: string;
}

export interface SessionData {
    token: string;
    user: SessionUser;
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET || 'default-secret-change-in-production-32-chars-min',
    cookieName: 'app_session',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24,
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    return getIronSession<SessionData>(cookieStore, sessionOptions);
}
