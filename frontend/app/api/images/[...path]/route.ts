import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'http://backend:8081';

export async function GET(
    req: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const filePath = params.path.join('/');
    const search = req.nextUrl.search;
    
    // Forward directly to the backend. 
    // If path was ['images', 'foo.png'], it becomes 'images/foo.png'.
    // If path was ['foo.png'], it becomes 'foo.png'.
    // The backend serves uploads at /app/upload/ which is mapped to /**.
    const targetUrl = `${API_BASE}/${filePath}${search}`;

    console.log(`[Image Proxy] ${req.nextUrl.pathname} -> ${targetUrl}`);

    try {
        const proxyRes = await fetch(targetUrl);

        if (!proxyRes.ok) {
            console.warn(`[Image Proxy Error] Failed to fetch ${targetUrl}: ${proxyRes.status} ${proxyRes.statusText}`);
            return NextResponse.json({ message: 'Error fetching image', status: proxyRes.status }, { status: proxyRes.status });
        }

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
