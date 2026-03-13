import { NextRequest, NextResponse } from 'next/server';
import http from 'http';

const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL || 'http://agent-server:8000';

export async function POST(req: NextRequest) {
    const path = req.nextUrl.pathname.replace(/^\/api\/agent/, '');
    const targetUrl = new URL(`${AGENT_SERVER_URL}${path}${req.nextUrl.search}`);

    console.log(`[Agent Proxy] POST ${req.nextUrl.pathname} -> ${targetUrl.toString()}`);

    const bodyText = await req.text();

    return new Promise<Response>((resolve, reject) => {
        const httpReq = http.request(
            {
                hostname: targetUrl.hostname,
                port: targetUrl.port,
                path: targetUrl.pathname + targetUrl.search,
                method: 'POST',
                headers: {
                    'Content-Type': req.headers.get('content-type') || 'application/json',
                    'Content-Length': Buffer.byteLength(bodyText),
                },
            },
            (res) => {
                const isStream = res.headers['content-type']?.includes('text/event-stream');

                const stream = new ReadableStream({
                    start(controller) {
                        res.on('data', (chunk) => controller.enqueue(chunk));
                        res.on('end', () => controller.close());
                        res.on('error', (err) => controller.error(err));
                    },
                    cancel() {
                        res.destroy();
                    },
                });

                const responseHeaders: Record<string, string> = {
                    'Cache-Control': 'no-cache, no-transform',
                    'Connection': 'keep-alive',
                    'X-Accel-Buffering': 'no',
                };

                if (res.headers['content-type']) {
                    responseHeaders['Content-Type'] = res.headers['content-type'];
                }

                resolve(new Response(stream, {
                    status: res.statusCode,
                    headers: responseHeaders,
                }));
            }
        );

        httpReq.on('error', (err) => {
            console.error('[Agent Proxy Error]', err);
            resolve(NextResponse.json({ message: 'Error connecting to agent-server', error: err.message }, { status: 500 }));
        });

        httpReq.write(bodyText);
        httpReq.end();
    });
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
