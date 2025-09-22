import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
// Reutilizaremos o CSS das páginas de texto para manter a consistência
import styles from '../politica-de-privacidade/PrivacyPolicy.module.css';

export const metadata = {
  title: "Sobre Nós - E-Certidões",
  description: "Conheça a E-Certidões, uma plataforma digital privada que atua na intermediação da solicitação de certidões e documentos oficiais em todo o território brasileiro.",
};

export default function SobreNosPage() {
  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Sobre Nós</h1>

          <div className={styles.content}>
            <p>
              A E-Certidões é uma plataforma digital privada que atua na intermediação da solicitação de certidões e documentos oficiais em todo o território brasileiro. Administrada pela Palazzi Sociedade Individual de Advocacia, registrada na OAB/SP sob o nº 58133, a plataforma tem como missão tornar esse processo mais rápido, acessível e seguro, eliminando barreiras como deslocamentos presenciais, filas em cartórios e dificuldades técnicas.
            </p>
            <p>
              Contamos com uma equipe multidisciplinar, formada por profissionais das áreas jurídica, administrativa e tecnológica, o que nos permite oferecer um atendimento completo, com respaldo legal, precisão e alto padrão de qualidade em todas as etapas. Cada solicitação é analisada individualmente por nossos especialistas, garantindo o correto envio dos dados aos cartórios, tabelionatos ou órgãos públicos competentes.
            </p>
            <p>
              Prezamos pela privacidade e proteção dos dados pessoais, seguindo rigorosamente os princípios da Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD). As informações fornecidas são armazenadas de forma segura, criptografadas e acessadas exclusivamente por profissionais autorizados, sendo utilizadas apenas para fins específicos da emissão dos documentos requeridos.
            </p>
            <p>
              Nosso site foi desenvolvido com foco na experiência do usuário, oferecendo navegação simples, comunicação clara e eficiência nos prazos. O acompanhamento dos pedidos é feito diretamente pelo painel do cliente, com envio de notificações por e-mail e suporte ativo via WhatsApp com atendimento humano.
            </p>
            <p>
              Com apenas alguns cliques, você pode solicitar certidões de nascimento, casamento, óbito, protesto, matrícula de imóvel, entre outras, recebendo o documento com segurança — de forma digital ou pelos Correios, no conforto da sua casa.
            </p>
            <p>
              Nosso compromisso é entregar um serviço confiável, transparente e eficiente, respeitando a seriedade dos documentos solicitados e garantindo a tranquilidade de quem confia na E-Certidões.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}