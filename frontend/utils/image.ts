export const STATIC_IMAGES = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png', 'blank.png'];

export const getImageUrl = (url: string | null | undefined) => {
    // 1. URL이 없거나 blank 면 /api/images/blank.png 반환 (백엔드 통합 서빙)
    if (!url || url === '' || url === 'blank.png') return '/api/images/blank.png';

    // 2. 외부 링크는 그대로 반환
    if (url.startsWith('http')) return url;

    // 3. 모든 이미지 요청을 BFF(/api/images/...) 경로로 단일화합니다.
    // 이는 이미지 업로드 폴더와 정적 폴더를 모두 뒤져서 파일을 찾아주는 가장 안전한 방법입니다.
    if (url.startsWith('/api/images/')) return url;
    if (url.startsWith('/images/')) {
        return url.replace('/images/', '/api/images/');
    }

    // 4. 폴더 경로를 완벽히 유지하며 접두어를 붙입니다.
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    return `/api/images/${cleanPath}`;
};
