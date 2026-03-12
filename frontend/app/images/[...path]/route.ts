import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'http://backend:8081';

export async function GET(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const search = req.nextUrl.search;
    
    // Forward /images/... directly to the backend
    const targetUrl = `${API_BASE}${path}${search}`;

    console.log(`[Image Proxy] ${path} -> ${targetUrl}`);

    try {
        const proxyRes = await fetch(targetUrl);

        const responseHeaders = new Headers();
        const resContentType = proxyRes.headers.get('content-type');
        if (resContentType) {
            responseHeaders.set('Content-Type', resContentType);
        }
        // Cache images for performance
        responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');

        return new NextResponse(proxyRes.body, {
            status: proxyRes.status,
            statusText: proxyRes.statusText,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error('[Image Proxy Error]', error);
        return NextResponse.json({ message: 'Error fetching image', error: error.message }, { status: 500 });
    }
}
