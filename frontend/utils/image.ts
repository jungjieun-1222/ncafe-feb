export const STATIC_IMAGES = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png', 'blank.png'];

export const getImageUrl = (url: string | null | undefined) => {
    // 1. URL이 없으면 기본 이미지
    if (!url || url === '' || url === 'blank.png') return '/images/blank.png';

    // 2. 외부 링크는 그대로 반환
    if (url.startsWith('http')) return url;

    // 3. 이미 /images/ 로 시작하면 그대로 반환
    if (url.startsWith('/images/')) return url;

    // 4. /api/images/ -> /images/ (BFF 대응 및 통합)
    if (url.startsWith('/api/images/')) {
        return url.replace('/api/images/', '/images/');
    }

    // 5. 모든 이미지를 /images/ 경로로 통합 (계층 구조/폴더명 보존!!)
    // 이 요청은 Next.js rewrite를 통해 백엔드로 전달되고, 
    // 백엔드는 upload 폴더와 extra-static(public) 폴더에서 파일을 찾습니다.
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    return `/images/${cleanPath}`;
};
