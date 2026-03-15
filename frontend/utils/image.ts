export const STATIC_IMAGES = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png', 'blank.png'];

export const getImageUrl = (url: string | null | undefined) => {
    // 1. URL이 없으면 기본 이미지
    if (!url || url === '' || url === 'blank.png') return '/images/blank.png';

    // 2. 외부 링크는 그대로 반환
    if (url.startsWith('http')) return url;

    // 3. /api/images/ -> /images/ (이동 전 경로 호환성 및 BFF 대응)
    if (url.startsWith('/api/images/')) {
        return url.replace('/api/images/', '/images/');
    }

    // 4. 이미 /images/ 로 시작하면 그대로 반환
    if (url.startsWith('/images/')) return url;

    // 5. 그 외 모든 상대 경로는 /images/ 를 붙여서 반환 (계층 구조 보존!!)
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    return `/images/${cleanPath}`;
};
