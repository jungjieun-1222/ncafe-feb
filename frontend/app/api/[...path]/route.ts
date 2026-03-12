import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

const API_BASE = process.env.API_BASE_URL || 'http://backend:8081';

async function proxyRequest(req: NextRequest) {
    const session = await getSession();
    const path = req.nextUrl.pathname;
    const search = req.nextUrl.search;

    // Remove /api prefix but keep /images prefix for backend matching
    const targetPath = path.replace(/^\/api/, '');
    const targetUrl = `${API_BASE}${targetPath}${search}`;

    const headers: Record<string, string> = {};
    const excludedHeaders = ['host', 'connection', 'content-length', 'transfer-encoding'];
    
    req.headers.forEach((value, key) => {
        if (!excludedHeaders.includes(key.toLowerCase())) {
            headers[key] = value;
        }
    });

    // Add Authorization header from session if not already present
    if (session.token && !headers['authorization']) {
        headers['Authorization'] = `Bearer ${session.token}`;
    }

    let body: BodyInit | null = null;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        const contentType = req.headers.get('content-type');
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
    } catch (error: any) {
        console.error('[BFF Proxy Error]', error);
        return NextResponse.json({ message: 'Internal Server Error (Proxy)', error: error.message || String(error) }, { status: 500 });
    }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
