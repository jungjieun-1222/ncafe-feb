'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useMenuDetail } from '../MenuDetailInfo/useMenuDetail';
import { useMenuImages } from './useMenuImages';
import styles from './MenuDetailImage.module.css';
import { useState } from 'react';


export default function MenuDetailImage({ menuId }: { menuId: number }) {
    const { id } = useParams();
    const menu = useMenuDetail(id as string);
    const { images, isLoading } = useMenuImages(id as string);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = '/images/blank.png';
    };

    const getImageUrl = (url: string | undefined) => {
        if (!url || url === 'blank.png' || url.includes('blank.png')) return '/images/blank.png';
        if (url.startsWith('/images/')) return url;
        if (url.startsWith('http')) return url;
        return `/images/${url}`;
    };

    const handleSetPrimary = async () => {
        if (activeIndex === 0) return;
        
        setIsUpdating(true);
        try {
            // Mock API call to update primary image (reorder images)
            // In a real implementation, this would call a backend endpoint
            alert('대표 이미지 변경 기능은 준비 중입니다. (ID: ' + id + ')');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading || !menu) return <div className={styles.loading}>이미지를 불러오는 중...</div>;

    // Use menu.imageSrc as fallback if no specific images are found
    const displayImages = images.length > 0 ? images.map(img => img.srcUrl) : [menu.imageSrc || 'blank.png'];

    const mainImageUrl = getImageUrl(displayImages[activeIndex]);

    return (
        <div className={styles.container}>
            <div className={styles.mainImageWrapper}>
                <img
                    src={mainImageUrl}
                    alt={menu.korName}
                    className={styles.mainImage}
                    onError={handleImageError}
                />
                {activeIndex !== 0 && (
                    <button 
                        className={styles.setPrimaryBtn}
                        onClick={handleSetPrimary}
                        disabled={isUpdating}
                    >
                        이 이미지를 대표 이미지로 설정
                    </button>
                )}
                {activeIndex === 0 && (
                    <div className={styles.primaryBadge}>대표 이미지</div>
                )}
            </div>

            <div className={styles.subImageList}>
                {displayImages.map((src, index) => (
                    <div
                        key={index}
                        className={`${styles.subImageWrapper} ${index === activeIndex ? styles.active : ''}`}
                        onClick={() => setActiveIndex(index)}
                    >
                        <img
                            src={getImageUrl(src)}
                            alt={`${menu.korName} ${index + 1}`}
                            className={styles.subImage}
                            onError={handleImageError}
                        />
                        {index === 0 && <span className={styles.miniBadge}>대표</span>}
                    </div>
                ))}
            </div>
            
            {displayImages.length === 0 && (
                <div className={styles.subImageList}>
                    <div className={`${styles.subImageWrapper} ${styles.active}`}>
                        <img
                            src="/upload/blank.png"
                            alt="no image"
                            className={styles.subImage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
