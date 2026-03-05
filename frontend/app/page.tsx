import Hero from "../components/Hero";
import Features from "../components/Features";
import Gallery from "../components/Gallery";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main>
        <Hero />
        <Features />
        <Gallery />

        {/* Scoped CTA Section for the landing page */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>고즈넉한 한옥에서의 <br />아침을 예약하세요</h2>
            <p>전통의 결이 살아있는 공간에서 정성을 다해 내린 시그니처 커피 한 잔의 여유를 선사합니다.</p>
            <button className={styles.ctaBtn}>커뮤니티 가입하기</button>
          </div>
        </section>
      </main>
    </div>
  );
}
