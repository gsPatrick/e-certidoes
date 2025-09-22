import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import AuthForm from "@/components/AuthForm/AuthForm";
import styles from './MinhaConta.module.css';

export const metadata = {
  title: "Minha Conta - E-Certidões",
  description: "Acesse sua conta ou cadastre-se para solicitar e acompanhar suas certidões.",
};

export default function MinhaContaPage() {
  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <AuthForm />
      </main>
      <Footer />
    </>
  );
}