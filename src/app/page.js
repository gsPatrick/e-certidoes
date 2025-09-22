import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import CertificatesList from "@/components/CertificatesList/CertificatesList";
import Footer from "@/components/Footer/Footer"; // 1. Importe o Footer

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <CertificatesList />
      <Footer /> {/* 2. Adicione o Footer no final */}
    </main>
  );
}