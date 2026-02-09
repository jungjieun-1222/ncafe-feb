'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useMenuDetail } from '../MenuDetailInfo/useMenuDetail';
import { useMenuImages } from './useMenuImages';
import styles from './MenuDetailImage.module.css';
import { use } from 'react';

export default function MenuDetailImage({ menuId }: { menuId: number }) {
    const { id } = useParams();
    const menu = useMenuDetail(id as string);
    const { images, isLoading } = useMenuImages(id as string);

    if (isLoading || !menu) return null;

    const primaryImage = images[0]; // Assuming the first image is primary

    return (
        <div className={styles.imageSection}>
            {primaryImage ? (
                <Image
                    src={`http://localhost:8080/${primaryImage.srcUrl}`}
                    alt={primaryImage.altText || menu.korName}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority
                />
            ) : (
                <div className={styles.image} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                    이미지 없음
                </div>
            )}
        </div>
    );
}
