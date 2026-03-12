import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'http://backend:8081';

export async function GET(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const search = req.nextUrl.search;
    
    // Forward /images/... directly to the backend
    const targetUrl = `${API_BASE}${path}${search}`;

    console.log(`[Image Proxy] ${path} -> ${targetUrl}`);

    // Skip proxying for known static assets in public/images
    const staticAssets = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png'];
    const fileName = path.split('/').pop() || '';
    
    if (staticAssets.includes(fileName)) {
        console.log(`[Image Proxy] Skipping proxy for static asset: ${fileName}`);
        // Returning 404 here will allow Next.js to potentially serve from public if configured, 
        // but better to just return the 404 and fix the path in calling components if needed.
        // Actually, in app router, if we have a route, it MUST handle it. 
        // So we can try to fetch it from the frontend itself or just return 404 and rely on the calling component to use the correct path.
        // Given ChatWidget uses /images/wolha.png, this route IS the problem.
        // To fix, we should actually fetch it from our own public folder if needed, but that's complex.
        // The most robust way is to just NOT shadown /images/ if we want public/images/ to work.
        // But since we need to proxy backend images...
        return NextResponse.json({ message: 'Static asset' }, { status: 404 });
    }

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
