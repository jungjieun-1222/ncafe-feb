import { NextRequest, NextResponse } from 'next/server';

const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL || 'http://agent-server:8000';

export async function POST(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/agent/, '');
    const targetUrl = `${AGENT_SERVER_URL}${path}${req.nextUrl.search}`;

    console.log(`[Agent Proxy] POST ${req.nextUrl.pathname} -> ${targetUrl}`);

    try {
        const body = await req.json();
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
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
