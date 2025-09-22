import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import FormSection from "@/components/FormSection/FormSection";

export const metadata = {
  title: "Assessoria Jurídica - E-Certidões",
  description: "Solicite uma consulta por videoconferência com um advogado especialista.",
};

export default function AssessoriaJuridicaPage() {
  // O texto descritivo para a página de assessoria
  const assessoriaDescription = (
    <>
      <p>
        O portal e-Certidões é administrado pela Palazzi Sociedade de Advogados, um escritório renomado estabelecido no estado de São Paulo com atuação em todo território nacional.
      </p>
      <p>
        Prestamos assessoria jurídica especializada no âmbito do direito imobiliário, civil e empresarial.
      </p>
      <p>
        Através do formulário abaixo você poderá solicitar uma consulta por videoconferência com um advogado especialista. Ou fale conosco através do WhatsApp: +55 (19) 99915-8230.
      </p>
    </>
  );

  return (
    // Esta página não precisa do layout de altura total, então usamos uma estrutura padrão
    <>
      <Header />
      <main>
        <FormSection
          imageSrc="/acessor.png"
          imageAlt="Advogado sorrindo em um escritório"
          title="Assessoria Jurídica"
          description={assessoriaDescription}
        />
      </main>
      <Footer />
    </>
  );
}