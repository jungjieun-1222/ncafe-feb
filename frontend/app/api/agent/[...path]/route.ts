import { NextRequest, NextResponse } from 'next/server';

const AGENT_BASE = process.env.AGENT_SERVER_URL || 'http://agent-server:8000';

export async function proxyRequest(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const search = req.nextUrl.search;

    // Remove /api/agent prefix
    const targetPath = path.replace(/^\/api\/agent/, '');
    const targetUrl = `${AGENT_BASE}${targetPath}${search}`;

    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
        if (!['host', 'connection'].includes(key.toLowerCase())) {
            headers[key] = value;
        }
    });

    try {
        let body: BodyInit | null = null;
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            const contentType = req.headers.get('content-type');
            if (contentType?.includes('multipart/form-data')) {
                body = await req.blob();
            } else {
                body = await req.text();
            }
        }

        console.log(`[BFF Agent Proxy] ${req.method} ${path} -> ${targetUrl}`);

        const proxyRes = await fetch(targetUrl, {
            method: req.method,
            headers,
            body,
        });

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
        console.error('[BFF Agent Proxy Error]', error);
        return NextResponse.json({ message: 'Internal Server Error (Agent Proxy)', error: error.message }, { status: 500 });
    }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
