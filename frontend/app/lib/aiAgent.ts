export async function* sendMessageStream(
    messageHistory: { role: string; content: string }[],
    userId: string | number | null = null
): AsyncGenerator<any, void, unknown> {
    const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId ? String(userId) : null,
            messages: messageHistory,
            stream: true,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to connect to AI server');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder('utf-8', { fatal: false });
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // stream: true - 멀티바이트 문자가 청크 경계에서 잘리는 것 방지
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        // 마지막 요소는 불완전한 라인일 수 있으므로 버퍼에 유지 (핵심 로직)
        buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
                const dataStr = trimmed.slice(6).trim();
                if (dataStr === '[DONE]') continue;

                try {
                    const data = JSON.parse(dataStr);
                    yield data;
                } catch (e) {
                    console.warn('Failed to parse SSE data:', dataStr, e);
                }
            }
        }
    }
}
