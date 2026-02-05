'use client';

import { ReactNode, useEffect } from 'react';
import { useAdminHeaderStore } from '@/stores/useAdminHeaderStore';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
}

/**
 * 이 컴포넌트는 페이지 내에서 Admin Header의 제목과 작업을 설정하는 데 사용됩니다.
 * 자체적으로는 아무것도 렌더링하지 않지만, 레이아웃에 정의된 헤더를 업데이트합니다.
 */
export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
    const setHeader = useAdminHeaderStore((state) => state.setHeader);
    const clearHeader = useAdminHeaderStore((state) => state.clearHeader);

    useEffect(() => {
        setHeader(title, subtitle, children || null);

        // 페이지를 벗어날 때 헤더를 비웁니다 (URL 기반 타이틀과 충돌 방지)
        return () => clearHeader();
    }, [title, subtitle, children, setHeader, clearHeader]);

    return null;
}
