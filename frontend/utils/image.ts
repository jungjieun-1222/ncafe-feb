export const STATIC_IMAGES = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png', 'blank.png'];

export const getImageUrl = (url: string | null | undefined) => {
    // 1. URL이 없으면 기본 이미지 (프론트엔드 public/images 에 있는 blank.png 사용)
    if (!url || url === '' || url === 'blank.png') return '/images/blank.png';

    // 2. 외부 링크는 그대로 반환
    if (url.startsWith('http')) return url;

    // 3. 고유 정적 이미지들은 프론트엔드 public/images에서 직접 서빙 (이미지 주소 지원)
    const fileName = url.split('/').pop() || '';
    if (STATIC_IMAGES.includes(fileName)) {
        return `/images/${fileName}`;
    }

    // 4. DB에서 온 메뉴 이미지 등은 BFF(/api/images/...)를 통해 백엔드에서 가져옴
    // 이 경로는 app/api/[...path]/route.ts 가 처리하여 백엔드의 /images/... 로 보냅니다.
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    
    // 이미 /api/images/ 로 시작하면 그대로 반환
    if (url.startsWith('/api/images/')) return url;
    
    return `/api/images/${cleanPath}`;
};
