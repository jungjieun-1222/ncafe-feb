import { NextRequest, NextResponse } from 'next/server';

const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL || 'http://agent-server:8000';

export async function POST(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/agent/, '');
    const targetUrl = `${AGENT_SERVER_URL}${path}${req.nextUrl.search}`;

    console.log(`[Agent Proxy] POST ${req.nextUrl.pathname} -> ${targetUrl}`);

    try {
        const contentType = req.headers.get('content-type');
        const headers: Record<string, string> = {};
        if (contentType) headers['Content-Type'] = contentType;

        // Use the original body (stream) directly to support multipart/form-data
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers,
            body: req.body,
            // @ts-ignore - duplex is needed for streaming body in fetch
            duplex: 'half'
        });

        // For streaming responses (like chat)
        if (response.headers.get('content-type')?.includes('text/event-stream')) {
            return new Response(response.body, {
                status: response.status,
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        console.error('[Agent Proxy Error]', error);
        return NextResponse.json({ message: 'Error connecting to agent-server', error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/agent/, '');
    const targetUrl = `${AGENT_SERVER_URL}${path}${req.nextUrl.search}`;

    console.log(`[Agent Proxy] GET ${req.nextUrl.pathname} -> ${targetUrl}`);

    try {
        const response = await fetch(targetUrl);
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        console.error('[Agent Proxy Error]', error);
        return NextResponse.json({ message: 'Error connecting to agent-server', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/agent/, '');
    const targetUrl = `${AGENT_SERVER_URL}${path}${req.nextUrl.search}`;

    console.log(`[Agent Proxy] DELETE ${req.nextUrl.pathname} -> ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, { method: 'DELETE' });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        console.error('[Agent Proxy Error]', error);
        return NextResponse.json({ message: 'Error connecting to agent-server', error: error.message }, { status: 500 });
    }
}
