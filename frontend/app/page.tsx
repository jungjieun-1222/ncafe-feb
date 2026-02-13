import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Gallery from "../components/Gallery";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={`${styles.page} heritage-theme`}>
      <Navbar />
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

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3>엔카페 <span>.</span></h3>
            <p>한 잔의 커피에 정성을 담아, 당신의 일상에 쉼표를 찍습니다.</p>
          </div>
          <div className={styles.footerInfo}>
            <p>© 2026 NCafe Heritage. 모든 권리는 엔카페(NCafe)에 있습니다.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
