import Image from 'next/image';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>
              Certidões online: fácil, rápido e seguro
            </h1>
          </div>
          <p className={styles.subtitle}>
            Em poucos cliques você solicita certidões de cartórios,
            tabelionatos e Tribunais de todo o Brasil.
          </p>
          <button className={styles.ctaButton}>
            Solicite Agora
          </button>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/hero.png"
            alt="Mulher apontando para um notebook com uma certidão na tela"
            width={700}
            height={600}
            className={styles.heroImage}
            priority
          />
        </div>
      </div>
      <div className={styles.waveContainer}>
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,99.98 C240,40.00 480,40.00 720,69.98 C960,100.00 1200,100.00 1440,89.98 L1440,100.00 L0,100.00 Z"
            style={{ stroke: 'none', fill: '#FFFFFF' }}
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;