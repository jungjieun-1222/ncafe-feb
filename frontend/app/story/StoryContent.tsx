'use client';

import React from 'react';
import Image from 'next/image';
import styles from './story.module.css';

// Changed to a beautiful, moody 'moonlight night' (달빛 아래) aesthetic background
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1619193099934-3cbd46f6f02f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGtvcmVhbiUyMGhvdXNlfGVufDB8fDB8fHww";

export default function StoryContent() {
    return (
        <div className={styles.storyPage}>
            <div className={styles.heroBackgroundWrapper}>
                <Image
                    src="https://images.unsplash.com/photo-1619193099934-3cbd46f6f02f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGtvcmVhbiUyMGhvdXNlfGVufDB8fDB8fHww"
                    alt="Modern Hanok Interior"
                    fill
                    className={styles.heroBackground}
                    priority
                />
                <div className={styles.overlay}></div>

                {/* Falling Petals Restored */}
                <div className={styles.petalsContainer}>
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.petal}
                            style={{
                                left: `${Math.random() * 100}%`,
                                width: `${10 + Math.random() * 10}px`,
                                height: `${8 + Math.random() * 8}px`,
                                animationDelay: `${Math.random() * 12}s`,
                                animationDuration: `${10 + Math.random() * 10}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <div className={styles.heroContent}>
                <h1 className={`${styles.title} animate-in`}>
                    인연, 그리고 <br />
                    <span className={styles.myeongjo}>반려견과 휴식</span>
                </h1>
                <p className={`${styles.subtitle} animate-in`} style={{ marginTop: '20px', animationDelay: '0.2s' }}>
                    도심의 소음을 뒤로하고, 오직 서로에게 집중하는 시간.
                </p>
            </div>

            <main className={styles.container}>
                <div className={`${styles.section} animate-in`}>

                    {/* Chapter 1: Human Connection */}
                    <div className={styles.magazineLayout}>
                        <img
                            src="https://plus.unsplash.com/premium_photo-1723651324812-f11facac564f?w=1200&auto=format&fit=crop"
                            alt="Modern Tea Space"
                            className={styles.chapterImage}
                        />
                        <div className={styles.textColumn}>
                            <div className={styles.chapterHeader}>
                                <h3 className={`${styles.chapterTitle} ${styles.myeongjo}`}>人連. <br />사람과 사람이 <br />마주하는 순간</h3>
                                <div className={styles.stamp}>緣</div>
                            </div>
                            <div className={styles.paragraph}>
                                <p>바쁜 도심 속, 잠시 숨을 고르며 서로의 안부를 묻는 곳.</p>
                                <p>정갈한 찻잔 속에 담긴 따스한 대화가</p>
                                <p>어색한 공기를 허물고 새로운 인연의 실타래를 풀어냅니다.</p>
                                <p>우리는 이곳에서 단순히 차를 마시는 것이 아니라,</p>
                                <p>서로의 계절을 공유하고 있습니다.</p>
                            </div>
                        </div>
                    </div>

                    {/* Chapter 2: Life with Dogs */}
                    <div className={styles.magazineLayout}>
                        <img
                            src="https://plus.unsplash.com/premium_photo-1739452950207-584969f8eab9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE0fHxjYWZlJTIwZG9nfGVufDB8fDB8fHww"
                            alt="Dog in Hanok"
                            className={styles.chapterImage}
                        />
                        <div className={styles.textColumn}>
                            <div className={styles.chapterHeader}>
                                <h3 className={`${styles.chapterTitle} ${styles.myeongjo}`}>伴侶. <br />반려견과 함께하는 <br />슬로우 라이프</h3>
                                <div className={styles.stamp}>愛</div>
                            </div>
                            <div className={styles.paragraph}>
                                <p>네 발 달린 친구가 전해주는 무해한 사랑의 온기.</p>
                                <p>툇마루 아래 쏟아지는 햇살을 나누어 누리며</p>
                                <p>우리의 소중한 반려견들도 느린 시간의 미학을 배워갑니다.</p>
                                <p>따스한 봄볕 아래, 당신의 동반자와 함께하는</p>
                                <p>가장 평화로운 오후를 선물합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
