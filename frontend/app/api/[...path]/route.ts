import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:8081';

async function proxyRequest(req: NextRequest) {
    const session = await getSession();
    const path = req.nextUrl.pathname;
    const search = req.nextUrl.search;

    // Remove /api prefix for forwarding to backend
    const targetPath = path.replace(/^\/api/, '');
    const targetUrl = `${API_BASE}${targetPath}${search}`;

    const headers: Record<string, string> = {};

    // Copy standard headers
    const contentType = req.headers.get('content-type');
    if (contentType) headers['Content-Type'] = contentType;

    const accept = req.headers.get('accept');
    if (accept) headers['Accept'] = accept;

    // Add Authorization header from session
    if (session.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
    }

    let body: BodyInit | null = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (contentType?.includes('multipart/form-data')) {
            body = await req.blob();
        } else {
            body = await req.text();
        }
    }

    console.log(`[BFF Proxy] ${req.method} ${path} -> ${targetUrl}`);

    try {
        const proxyRes = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
        });

        if (proxyRes.status === 401 && session.token) {
            session.destroy();
        }

        const responseHeaders = new Headers();
        const resContentType = proxyRes.headers.get('content-type');
        if (resContentType) {
            responseHeaders.set('Content-Type', resContentType);
        }

        return new NextResponse(proxyRes.body, {
            status: proxyRes.status,
            statusText: proxyRes.statusText,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('[BFF Proxy Error]', error);
        return NextResponse.json({ message: 'Internal Server Error (Proxy)' }, { status: 500 });
    }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
