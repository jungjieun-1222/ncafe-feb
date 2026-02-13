import React from 'react';
import styles from './Features.module.css';
import { Coffee, Wind, Leaf } from 'lucide-react';

const Features = () => {
    const items = [
        {
            icon: <Coffee size={32} />,
            title: "장인의 스페셜티",
            description: "엄선된 산지에서 온 프리미엄 원두를 장인의 손길로 정성스럽게 로스팅하여 깊은 풍미를 전합니다."
        },
        {
            icon: <Wind size={32} />,
            title: "공간의 조화",
            description: "전통 한옥의 고즈넉함과 현대적인 미학이 어우러진 공간에서 진정한 쉼의 미학을 경험해 보세요."
        },
        {
            icon: <Leaf size={32} />,
            title: "계절의 차림표",
            description: "제철 재료 본연의 맛을 살린 수제 청과 디저트로 사계절의 향긋한 변화를 식탁에 올립니다."
        }
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={`${styles.label} animate-in`}>SPECIAL EXPERIENCE</span>
                    <h2 className={`${styles.title} animate-in`}>엔카페가 제안하는 <br />세 가지 가치</h2>
                </div>

                <div className={styles.grid}>
                    {items.map((item, index) => (
                        <div key={index} className={`${styles.card} animate-in`} style={{ animationDelay: `${index * 0.2}s` }}>
                            <div className={styles.iconWrapper}>
                                {item.icon}
                            </div>
                            <h3 className={styles.cardTitle}>{item.title}</h3>
                            <p className={styles.cardDescription}>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
