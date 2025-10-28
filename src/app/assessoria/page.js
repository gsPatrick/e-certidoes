// Salve em: src/app/assessoria/page.js

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import FormSection from "@/components/FormSection/FormSection";
import styles from '../contato/ContactPage.module.css'; // Reutiliza o estilo da página de contato

export const metadata = {
  title: "Assessoria Jurídica - E-Certidões",
  description: "Solicite uma consulta por videoconferência com um advogado especialista.",
};

export default function AssessoriaJuridicaPage() {
  const assessoriaDescription = (
    <>
      <p>
        O portal e-Certidões é administrado pela Palazzi Sociedade de Advogados, um escritório renomado estabelecido no estado de São Paulo com atuação em todo território nacional.
      </p>
      <p>
        Prestamos assessoria jurídica especializada no âmbito do direito imobiliário, civil e empresarial.
      </p>
      <p>
        Através do formulário abaixo você poderá solicitar uma consulta por videoconferência com um advogado especialista. Ou fale conosco através do WhatsApp: <strong>(19) 99915-8230</strong>.
      </p>
    </>
  );

  return (
    <div className={styles.fullPageContainer}>
      <Header />
      <FormSection
        imageSrc="/acessor.png"
        imageAlt="Advogado sorrindo em um escritório"
        title="Assessoria Jurídica"
        description={assessoriaDescription}
      />
      <Footer />
    </div>
  );
}