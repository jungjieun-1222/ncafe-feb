export const STATIC_IMAGES = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png', 'blank.png'];

export const getImageUrl = (url: string | null | undefined) => {
    // 1. 기본/에러 이미지 처리
    if (!url || url === 'blank.png' || url === '') return '/images/blank.png';

    // 2. 외부 링크는 그대로
    if (url.startsWith('http')) return url;

    // 3. 이미 /images/로 시작하는 경우 그대로 반환
    if (url.startsWith('/images/')) return url;

    // 4. 경로 정규화: /api/images/ 등으로 시작하는 경우 /images/로 강제 변환하거나 파일명만 추출
    const fileName = url.split('/').pop() || '';
    
    // 최종적으로 /images/파일명 형태로 리턴 -> Next.js rewrite가 백엔드의 /images/** 로 보내줍니다.
    return `/images/${fileName}`;
};
