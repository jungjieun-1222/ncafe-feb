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

    if (isLoading || !menu) return <div className={styles.loading}>이미지를 불러오는 중...</div>;

    // Use menu.imageSrc as fallback if no specific images are found
    const displayImages = images.length > 0 ? images : [
        { id: 0, menuId: Number(id), srcUrl: menu.imageSrc, sortOrder: 0 } as any
    ];

    const getImageUrl = (url: string) => {
        if (!url) return '/images/blank.png';
        if (url.startsWith('/images/')) return url;
        if (url.startsWith('http')) return url;
        return `/images/${url}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainImageWrapper}>
                <Image
                    src={getImageUrl(displayImages[activeIndex].srcUrl)}
                    alt={displayImages[activeIndex].altText || menu.korName}
                    fill
                    className={styles.mainImage}
                    priority
                />
            </div>

            {displayImages.length > 1 && (
                <div className={styles.thumbnailList}>
                    {displayImages.map((img, index) => (
                        <div
                            key={img.id || index}
                            className={`${styles.thumbnailWrapper} ${index === activeIndex ? styles.active : ''}`}
                            onClick={() => setActiveIndex(index)}
                        >
                            <Image
                                src={getImageUrl(img.srcUrl)}
                                alt={img.altText || menu.korName}
                                fill
                                className={styles.thumbnailImage}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
