export const STATIC_IMAGES = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png', 'blank.png'];

export const getImageUrl = (url: string | null | undefined) => {
    if (!url || url === 'blank.png' || url === '') return '/images/blank.png';
    if (url.startsWith('http')) return url;

    // 1. 고정 정적 이미지 처리
    const fileName = url.split('/').pop() || '';
    if (STATIC_IMAGES.includes(fileName)) {
        return url.startsWith('/images/') ? url : `/images/${fileName}`;
    }

    // 2. 이미 /api/images/로 시작하는 경우 그대로 반환
    if (url.startsWith('/api/images/')) return url;

    // 3. /images/로 시작하는 DB 데이터 처리 (핵심 수정!)
    // 백엔드 로그상 /images/ 없이 파일명으로 바로 호출하는 핸들러가 있다면 아래처럼 처리합니다.
    if (url.startsWith('/images/')) {
        const pureFileName = url.replace('/images/', '');
        return `/${pureFileName}`; // 백엔드 로그 로그에 맞춰 /ham-cheese-sandwich.png 형태 반환
    }

    // 4. 그 외의 경우
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    return `/api/images/${cleanUrl}`;
};
