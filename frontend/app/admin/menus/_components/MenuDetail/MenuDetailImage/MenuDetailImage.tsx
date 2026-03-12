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
    const { images, isLoading, refresh } = useMenuImages(id as string);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = '/images/blank.png';
    };

    const getImageUrl = (url: string | undefined) => {
        if (!url || url === 'blank.png' || url.includes('blank.png')) return '/images/blank.png';
        if (url.startsWith('/images/')) return url;
        if (url.startsWith('http')) return url;
        return `/images/${url}`;
    };

    const handleAddImage = async () => {
        if (!selectedFile) return;
        setIsAdding(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            
            const res = await fetch(`/api/admin/menus/${id}/images`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Failed to add image');
            setSelectedFile(null);
            // Reset file input if needed (usually handled by state or uncontrollable input)
            await refresh();
            const toast = (await import('react-hot-toast')).default;
            toast.success('이미지가 추가되었습니다.');
        } catch (error) {
            console.error(error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteImage = async (imageId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('이 이미지를 삭제하시겠습니까?')) return;
        try {
            const res = await fetch(`/api/admin/menus/images/${imageId}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete image');
            await refresh();
            if (activeIndex >= images.length - 1) setActiveIndex(0);
            const toast = (await import('react-hot-toast')).default;
            toast.success('이미지가 삭제되었습니다.');
        } catch (error) {
            console.error(error);
        }
    };

    const handleSetPrimary = async () => {
        if (activeIndex === 0) return;
        setIsUpdating(true);
        try {
            // This could be implemented by updating sort orders or setting a primary flag
            alert('대표 이미지 변경 기능은 준비 중입니다.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading || !menu) return <div className={styles.loading}>이미지를 불러오는 중...</div>;

    const displayImages = images.length > 0 ? images : [{ id: 0, srcUrl: menu.imageSrc || 'blank.png', sortOrder: 1 }];

    return (
        <div className={styles.container}>
            <div className={styles.mainImageWrapper}>
                <img
                    src={getImageUrl(displayImages[activeIndex]?.srcUrl)}
                    alt={menu.korName}
                    className={styles.mainImage}
                    onError={handleImageError}
                />
                
                {images.length > 0 && displayImages[activeIndex]?.id !== 0 && (
                    <button 
                        className={styles.deleteBtn}
                        onClick={(e) => handleDeleteImage(displayImages[activeIndex].id, e)}
                        style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255,0,0,0.7)', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
                    >
                        삭제
                    </button>
                )}

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
                {displayImages.map((img, index) => (
                    <div
                        key={img.id || index}
                        className={`${styles.subImageWrapper} ${index === activeIndex ? styles.active : ''}`}
                        onClick={() => setActiveIndex(index)}
                    >
                        <img
                            src={getImageUrl(img.srcUrl)}
                            alt={`${menu.korName} ${index + 1}`}
                            className={styles.subImage}
                            onError={handleImageError}
                        />
                        {index === 0 && <span className={styles.miniBadge}>대표</span>}
                    </div>
                ))}
                
                {/* Add Image UI */}
                <div className={styles.addImageWrapper} style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '150px' }}>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        style={{ fontSize: '0.8rem', padding: '4px' }}
                    />
                    <button 
                        onClick={handleAddImage} 
                        disabled={isAdding || !selectedFile}
                        style={{ fontSize: '0.8rem', padding: '4px', backgroundColor: '#4B3621', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        + 추가
                    </button>
                </div>
            </div>
        </div>
    );
}
