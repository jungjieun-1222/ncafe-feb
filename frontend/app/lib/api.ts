export async function fetchAPI(endpoint: string, options?: RequestInit) {
    try {
        const res = await fetch(`/api${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options?.headers,
            },
        });

        if (!res.ok) {
            if (res.status === 401 && typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
                return;
            }
            const error: any = new Error(`API Error: ${res.status}`);
            error.status = res.status;
            try {
                const body = await res.json();
                error.message = body.message || error.message;
            } catch { /* no json body */ }
            throw error;
        }

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return res.json();
        }
        return null;
    } catch (error: any) {
        throw error;
    }
}

export const authAPI = {
    login: (username: string, password: string) =>
        fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),

    logout: () =>
        fetchAPI('/auth/logout', { method: 'POST' }),

    getSession: () => fetchAPI('/auth/session'),
};
