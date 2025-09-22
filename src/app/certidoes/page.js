import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import CertificatesList from "@/components/CertificatesList/CertificatesList";

// Metadata para SEO e título da aba do navegador
export const metadata = {
  title: "Certidões - E-Certidões",
  description: "Filtre e encontre todas as certidões disponíveis. Solicite online de forma fácil, rápida e segura.",
};

export default function CertidoesPage() {
  return (
    <>
      <Header />
      <main>
        {/* 
          O componente CertificatesList já possui seu próprio espaçamento interno 
          e cor de fundo, então podemos usá-lo diretamente aqui.
        */}
        <CertificatesList />
      </main>
      <Footer />
    </>
  );
}