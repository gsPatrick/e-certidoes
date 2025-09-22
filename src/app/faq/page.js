
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import FaqAccordion from "@/components/FaqAccordion/FaqAccordion";
import styles from './FaqPage.module.css';

export const metadata = {
  title: "Tire suas Dúvidas - E-Certidões",
  description: "Encontre respostas para as perguntas mais frequentes sobre nossos serviços de certidões, prazos, pagamentos e muito mais.",
};

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Tire suas dúvidas</h1>
          <p className={styles.subtitle}>
            Encontre aqui as respostas para as perguntas mais frequentes sobre nossos serviços. Se sua dúvida não for esclarecida, entre em contato com nossa equipe.
          </p>
          
          <div className={styles.accordionContainer}>
            <FaqAccordion />
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}