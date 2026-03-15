export const STATIC_IMAGES = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png', 'blank.png'];

export const getImageUrl = (url: string | null | undefined) => {
    // 1. URL이 없거나 blank 면 /images/blank.png 반환 (백엔드에서 서빙)
    if (!url || url === '' || url === 'blank.png') return '/images/blank.png';

    // 2. 외부 링크는 그대로 반환
    if (url.startsWith('http')) return url;

    // 3. 이미 /images/ 로 시작하면 그대로 반환
    if (url.startsWith('/images/')) return url;

    // 4. /api/images/ -> /images/ (통합 서빙 경로로 변경)
    if (url.startsWith('/api/images/')) {
        return url.replace('/api/images/', '/images/');
    }

    // 5. 폴더 경로를 유지하면서 /images/를 붙임 (중요: split/pop 하지 않음!)
    // 이래야 menu_upload/cake.png 같은 경로도 백엔드에서 찾을 수 있습니다.
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    return `/images/${cleanPath}`;
};
