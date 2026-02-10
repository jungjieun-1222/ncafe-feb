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

    if (isLoading || !menu || !images || images.length === 0) return null;

    return (
        <div className={styles.container}>
            <div className={styles.mainImageWrapper}>
                <Image
                    src={`/images/${images[activeIndex].srcUrl}`}
                    alt={images[activeIndex].altText || menu.korName}
                    fill
                    className={styles.mainImage}
                    priority
                />
            </div>

            <div className={styles.thumbnailList}>
                {images.map((img, index) => (
                    <div
                        key={img.id}
                        className={`${styles.thumbnailWrapper} ${index === activeIndex ? styles.active : ''}`}
                        onClick={() => setActiveIndex(index)}
                    >
                        <Image
                            src={`/images/${img.srcUrl}`}
                            alt={img.altText || menu.korName}
                            fill
                            className={styles.thumbnailImage}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
