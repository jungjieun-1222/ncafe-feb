import React from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';
import Link from 'next/link';
import { ArrowRight, Coffee } from 'lucide-react';

const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1647168585205-e56ebb24a669?q=80&w=2070&auto=format&fit=crop";

const Hero = () => {
    return (
        <section className={styles.hero}>
            <Image
                src={HERO_IMAGE_URL}
                alt="Hanok Cafe Spring Background"
                fill
                className={styles.heroBackground}
                priority
            />
            <div className={styles.overlay}></div>

            {/* Falling Petals */}
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

            <div className={styles.content}>
                <div className={`${styles.badge} animate-in`}>
                    <Coffee size={16} />
                    <span>벚꽃 흩날리는 한옥에서의 고요한 휴식</span>
                </div>

                <h1 className={`${styles.title} animate-in`}>
                    흐드러진 벚꽃 아래 <br />
                    <span className={styles.myeongjo}>따스한 봄을 마시다</span>
                </h1>

                <p className={`${styles.description} animate-in`}>
                    전통의 아름다움과 스페셜한 커피가 만나는 곳 <br />
                    가장 한국적인 공간에서 당신만의 평온한 순간을 발견해보세요.
                </p>

                <div className={`${styles.actions} animate-in`}>
                    <Link href="/menus" className={styles.primaryBtn}>
                        오늘의 음료 주문하기 <ArrowRight size={18} />
                    </Link>
                    <button className={styles.secondaryBtn}>
                        한옥 공간 둘러보기
                    </button>
                </div>
            </div>

            <div className={styles.scrollIndicator}>
                <span>SCROLL DOWN</span>
                <div className={styles.mouse}>
                    <div className={styles.wheel}></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
