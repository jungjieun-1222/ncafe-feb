import React from 'react';
import styles from './Gallery.module.css';

const Gallery = () => {
    const images = [
        {
            url: 'https://images.unsplash.com/photo-1647168588863-177a8bb143ca?q=80&w=1000&auto=format&fit=crop',
            title: '고즈넉한 처마 밑',
            tag: 'ARCHITECTURE'
        },
        {
            url: 'https://images.unsplash.com/photo-1641124944608-a299ff6a2f1a?q=80&w=1000&auto=format&fit=crop',
            title: '정성으로 내린 커피',
            tag: 'SENSORY'
        },
        {
            url: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=1000&auto=format&fit=crop',
            title: '햇살 드는 공간',
            tag: 'INTERIOR'
        },
        {
            url: 'https://images.unsplash.com/photo-1649427449743-65a49b7eb395?q=80&w=1000&auto=format&fit=crop',
            title: '계절의 조각',
            tag: 'NATURE'
        }
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.label}>GALLERY</span>
                    <h2 className={styles.title}>엔카페의 감성을 담다</h2>
                    <p className={styles.description}>머무는 것만으로도 위로가 되는 <br />엔카페만의 순간들을 기록합니다.</p>
                </div>

                <div className={styles.grid}>
                    {images.map((img, index) => (
                        <div key={index} className={styles.item}>
                            <div className={styles.imageWrapper}>
                                <img src={img.url} alt={img.title} className={styles.image} />
                                <div className={styles.overlay}>
                                    <span className={styles.itemTag}>{img.tag}</span>
                                    <h4 className={styles.itemTitle}>{img.title}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
