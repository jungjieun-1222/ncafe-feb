export const STATIC_IMAGES = ['wolha.png', 'user_male.png', 'user_female.png', 'map.png', 'blank.png'];

export const getImageUrl = (url: string | null | undefined) => {
    if (!url || url === 'blank.png' || url === '') return '/images/blank.png';
    if (url.startsWith('http')) return url;
    
    const fileName = url.split('/').pop() || '';
    if (STATIC_IMAGES.includes(fileName)) {
        return url.startsWith('/') ? url : `/images/${url}`;
    }
    
    // For backend images, ensure we use the proxy
    if (url.startsWith('/api/images/')) return url;
    if (url.startsWith('/images/')) return `/api${url}`;
    
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    return `/api/images/${cleanUrl}`;
};
