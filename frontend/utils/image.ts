export const STATIC_IMAGES = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png', 'blank.png'];

export const getImageUrl = (url: string | null | undefined) => {
    // 1. 예외 처리: 데이터가 없으면 무조건 기본 이미지 반환
    if (!url || url === '' || url === 'blank.png') return '/blank.png';

    // 2. 외부 링크(http...)는 수정 없이 그대로 사용
    if (url.startsWith('http')) return url;

    // 3. 파일명만 추출해서 정적 이미지(STATIC_IMAGES)인지 확인
    // 예: "/images/map.png" -> "map.png"
    const fileName = url.split('/').pop() || '';

    if (STATIC_IMAGES.includes(fileName)) {
        // ✅ [핵심] 정적 이미지는 Nginx 설정을 피하기 위해 /파일명 으로 즉시 반환
        return `/${fileName}`;
    }

    // 4. 나머지(사용자 업로드 메뉴 등)는 백엔드(BFF) 경로로 통일
    // 중복 방지를 위해 기존 접두어(/images/, /api/images/)를 제거하고 새로 붙임
    const cleanPath = url.replace(/^\/?(api\/images\/|images\/)?/, '');
    return `/api/images/${cleanPath}`;
};