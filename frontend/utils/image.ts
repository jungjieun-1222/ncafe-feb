export const STATIC_IMAGES = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png', 'blank.png'];

export const getImageUrl = (url: string | null | undefined) => {
    // 1. 기본/에러 이미지 처리: 무조건 /api/images/ 경로를 타게 합니다.
    if (!url || url === 'blank.png' || url === '') return '/api/images/blank.png';

    // 2. 외부 링크는 그대로
    if (url.startsWith('http')) return url;

    // 3. 이미 /api/images/로 시작하는 경우 그대로 반환
    if (url.startsWith('/api/images/')) return url;

    // 4. 고정 정적 이미지 및 모든 DB 이미지 통합 처리
    // 파일명만 추출해서 무조건 /api/images/파일명 형태로 만듭니다.
    const fileName = url.split('/').pop() || '';
    if (['wolha.png', 'map.png', 'user_male.png', 'user_female.png'].includes(fileName)) {
        return `/images/${fileName}`;
    }

    // 최종적으로 /api/images/파일명 형태로 리턴 -> Next.js rewrite가 가로챔!
    return `/api/images/${fileName}`;
};
