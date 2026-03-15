export const STATIC_IMAGES = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png', 'blank.png'];

export const getImageUrl = (url: string | null | undefined) => {
    // 1. URL이 없으면 기본 이미지
    if (!url || url === '' || url === 'blank.png') return '/images/blank.png';

    // 2. 외부 링크는 그대로 반환
    if (url.startsWith('http')) return url;

    // 3. 파일명만 추출 (기존 시스템이 파일명만으로 업로드 폴더에서 찾기 때문)
    const fileName = url.split('/').pop() || '';

    // 4. 고정 정적 이미지 (map, wolha 등) -> /images/ 경로 사용 (주소창 직접 접근 지원)
    if (STATIC_IMAGES.includes(fileName)) {
        return `/images/${fileName}`;
    }

    // 5. 그 외 메뉴 이미지 등 -> /api/images/ 경로 사용 (기존 BFF 호환성 유지)
    // 이 요청은 BFF를 통해 백엔드의 /images/fileName 으로 전달됩니다.
    return `/api/images/${fileName}`;
};
