import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
// Atualize o import para o novo nome do componente
import FormSection from "@/components/FormSection/FormSection";
import styles from './ContactPage.module.css';

export const metadata = {
  title: "Contato - E-Certidões",
  description: "Fale com a nossa equipe. Tire suas dúvidas sobre certidões e pedidos.",
};

export default function ContatoPage() {
  const contactDescription = (
    <p>
      Tem dúvidas sobre sua certidão, precisa de ajuda com um pedido ou quer informações sobre prazos e documentos? Preencha o formulário abaixo e responderemos o mais breve possível.
    </p>
  );

  return (
    <div className={styles.fullPageContainer}>
      <Header />
      {/* Passe o conteúdo via props */}
      <FormSection
        imageSrc="/contato.png"
        imageAlt="Pessoa trabalhando em um laptop com documentos"
        title="Fale com a nossa equipe"
        description={contactDescription}
      />
      <Footer />
    </div>
  );
}