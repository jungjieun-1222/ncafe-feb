import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const AGENT_SERVER_URL = process.env.AGENT_URL || process.env.AGENT_SERVER_URL || 'http://agent-server:8000';

export async function POST(req: NextRequest) {
    let path = req.nextUrl.pathname.replace(/^\/api\/agent/, '');
    
    // FastAPI redirect prevention: Add trailing slash for base endpoints
    if (path === '/knowledge') path = '/knowledge/';
    
    const targetUrl = `${AGENT_SERVER_URL}${path}${req.nextUrl.search}`;
    const isChat = path.includes('/chat');
    const isMultipart = req.headers.get('content-type')?.includes('multipart/form-data');

    console.log(`[Agent Proxy] POST ${req.nextUrl.pathname} -> ${targetUrl}`);

    const headers = new Headers();
    req.headers.forEach((value, key) => {
        const k = key.toLowerCase();
        if (['host', 'connection', 'content-length'].includes(k)) return;
        if (k === 'content-type' && value.includes('multipart/form-data')) return;
        headers.set(key, value);
    });

    try {
        let body: any;
        
        if (isMultipart) {
            body = req.body;
            headers.set('Content-Type', req.headers.get('content-type')!);
        } else {
            // chat 포함 모든 JSON 요청: body를 텍스트로 먼저 읽어서 stream 호환성 문제 방지
            body = await req.text();
        }
        
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers,
            body,
            // @ts-ignore
            duplex: isMultipart ? 'half' : undefined,
            redirect: 'follow',
        });

        // SSE 대응 (챗봇 스트리밍) - ReadableStream 수동 파이핑으로 Next.js 버퍼링 우회
        if (response.headers.get('content-type')?.includes('text/event-stream')) {
            const upstream = response.body;
            if (!upstream) {
                return NextResponse.json({ error: 'No response body from agent' }, { status: 502 });
            }
            
            const stream = new ReadableStream({
                async start(controller) {
                    const reader = upstream.getReader();
                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            controller.enqueue(value);
                        }
                    } catch (err) {
                        console.error('[Agent Proxy SSE] Stream error:', err);
                    } finally {
                        controller.close();
                        reader.releaseLock();
                    }
                },
            });

            return new Response(stream, {
                status: response.status,
                headers: {
                    'Content-Type': 'text/event-stream; charset=utf-8',
                    'Cache-Control': 'no-cache, no-store, no-transform, must-revalidate',
                    'Connection': 'keep-alive',
                    'X-Accel-Buffering': 'no',
                    'Transfer-Encoding': 'chunked',
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
