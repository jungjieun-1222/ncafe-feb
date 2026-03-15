'use client';

import React from 'react';
import Image from 'next/image';
import styles from './location.module.css';
import { useSettingsStore } from '@/stores/useSettingsStore';

export default function LocationContent() {
    const settings = useSettingsStore(state => state.settings);

    return (
        <div className={styles.locationPage}>
            {/* Background Falling Petals */}
            <div className={styles.petalsContainer}>
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={styles.petal}
                        style={{
                            left: `${Math.random() * 100}%`,
                            width: `${8 + Math.random() * 8}px`,
                            height: `${6 + Math.random() * 6}px`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${12 + Math.random() * 8}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className={styles.container}>
                {/* Left Column: Information */}
                <div className={`${styles.leftColumn} animate-in`}>
                    <div className={styles.badge} style={{ marginBottom: '32px' }}>
                        📍 오시는 길
                    </div>

                    <h1 className={styles.title}>
                        안개 숲 너머, <br />
                        <span className={styles.myeongjo}>{settings?.name || '엔카페'}를 찾는 법</span>
                    </h1>

                    <p className={styles.description}>
                        이보게, 우리 카페는 복잡한 도심에서 살짝 벗어나 <br/>
                        달그림자와 안개가 가장 먼저 몸을 섞는 산자락에 숨어있다네. ✨
                    </p>
                    
                    <p className={styles.addressMain}>
                        주소: {settings?.address || '경기도 달빛마을 서당길 12 (깊은 산자락)'}
                    </p>

                    <div className={styles.infoCardContainer}>
                        <div className={styles.infoSection}>
                            <div className={styles.iconWrapper}>🧭</div>
                            <div className={styles.textWrapper}>
                                <div className={styles.infoTitle}>길 안내</div>
                                <div className={styles.infoDesc}>
                                    벚꽃 나무가 흐드러진 골목을 지나, 오래된 느티나무 아래 서면 솔바람이 불어올 것이네. 그 바람 소리를 이정표 삼아 한 걸음씩 쉬어가며 걷다 보면 어느새... 🌸
                                </div>
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <div className={styles.iconWrapper}>🚙</div>
                            <div className={styles.textWrapper}>
                                <div className={styles.infoTitle}>주차 안내</div>
                                <div className={styles.infoDesc}>
                                    대문 앞 빈터에 차를 세우셔도 좋으나, 네 발 달린 친구들과 산책하는 이들이 많으니 천천히 드나드시게. 🕯️
                                e</div>
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <div className={styles.iconWrapper}>ℹ️</div>
                            <div className={styles.textWrapper}>
                                <div className={styles.infoTitle}>참고 및 영업 시간</div>
                                <div className={styles.infoDesc}>
                                    {settings?.operatingHours && (
                                        <div style={{ marginBottom: '8px', fontWeight: 'bold', color: 'var(--k-gold)' }}>
                                            영업: {settings.operatingHours}
                                        </div>
                                    )}
                                    네 발 달린 식구들을 위한 시원한 물그릇이 항상 준비되어 있고, 비 오는 날에는 젖은 발을 닦을 비단 수건도 내어드린다네. 🐾✨
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${styles.rightColumn} animate-in`}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src="/images/map.png"
                            alt="Antique Hanok Location Map"
                            fill
                            className={styles.locationImage}
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
