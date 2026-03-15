import { NextRequest, NextResponse } from 'next/server';
import http from 'http';

const AGENT_SERVER_URL = process.env.AGENT_URL || process.env.AGENT_SERVER_URL || 'http://agent-server:8000';

export async function POST(req: NextRequest) {
    let path = req.nextUrl.pathname.replace(/^\/api\/agent/, '');
    
    // FastAPI redirect prevention: Add trailing slash for base endpoints
    if (path === '/knowledge') path = '/knowledge/';
    
    const targetUrl = `${AGENT_SERVER_URL}${path}${req.nextUrl.search}`;

    console.log(`[Agent Proxy] POST ${req.nextUrl.pathname} -> ${targetUrl}`);

    const headers = new Headers();
    req.headers.forEach((value, key) => {
        const k = key.toLowerCase();
        // Allow content-type but let fetch set boundary for multipart
        if (['host', 'connection', 'content-length'].includes(k)) return;
        if (k === 'content-type' && value.includes('multipart/form-data')) return;
        headers.set(key, value);
    });

    try {
        const isChat = path.includes('/chat');
        const isMultipart = req.headers.get('content-type')?.includes('multipart/form-data');
        let body: any;
        
        if (isChat || isMultipart) {
            body = req.body;
            // Multipart인 경우 헤더를 수동으로 다시 설정해줘야 합니다 (boundary가 포함된 원본 유지)
            if (isMultipart) {
                headers.set('Content-Type', req.headers.get('content-type')!);
            }
        } else {
            // For knowledge registration/search, read body first to avoid stream re-read issues on redirects
            body = await req.clone().arrayBuffer();
        }
        
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers,
            body,
            // @ts-ignore
            duplex: (isChat || isMultipart) ? 'half' : undefined,
            redirect: 'follow',
        });

        // SSE 대응 (챗봇 스트리밍)
        if (response.headers.get('content-type')?.includes('text/event-stream')) {
            return new Response(response.body, {
                status: response.status,
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache, no-transform',
                    'Connection': 'keep-alive',
                    'X-Accel-Buffering': 'no',
                },
            });
        }

        const data = await response.json().catch(() => null);
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
        const response = await fetch(targetUrl, { redirect: 'follow' });
        if (response.status === 204) return new Response(null, { status: 204 });
        const data = await response.json().catch(() => null);
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
        const response = await fetch(targetUrl, { 
            method: 'DELETE',
            redirect: 'follow'
        });
        if (response.status === 204) return new Response(null, { status: 204 });
        const data = await response.json().catch(() => null);
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        console.error('[Agent Proxy Error]', error);
        return NextResponse.json({ message: 'Error connecting to agent-server', error: error.message }, { status: 500 });
    }
}
