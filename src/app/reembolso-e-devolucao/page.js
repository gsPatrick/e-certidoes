import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
// Reutilizando o mesmo CSS da página de privacidade para manter a consistência
import styles from '../politica-de-privacidade/PrivacyPolicy.module.css';

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Política de Reembolso e Devolução</h1>
          <p className={styles.updateDate}>Última atualização em 07/07/2025.</p>

          <div className={styles.content}>
            <p>
              A E-Certidões preza pela transparência, responsabilidade e clareza na relação com seus usuários. Esta política estabelece as condições para reembolsos, estornos e devoluções de valores referentes aos serviços contratados por meio da plataforma, administrada pela Palazzi Sociedade Individual de Advocacia, registrada na OAB/SP sob o nº 58133.
            </p>

            <h2 className={styles.sectionTitle}>1. Quando é possível solicitar reembolso?</h2>
            <p>Você poderá solicitar reembolso nas seguintes situações:</p>
            <ul>
              <li>O pedido ainda não foi processado ou enviado ao cartório, tabelionato ou órgão público competente</li>
              <li>Houve pagamento em duplicidade</li>
              <li>O prazo estimado de entrega foi ultrapassado em mais de 10 dias úteis, sem justificativa oficial por parte do órgão emissor</li>
            </ul>

            <h2 className={styles.sectionTitle}>2. Situações que não geram reembolso</h2>
            <p>Não serão concedidos reembolsos nos seguintes casos:</p>
            <ul>
              <li>Dados preenchidos incorretamente pelo usuário</li>
              <li>Recusa de emissão da certidão por falta de informações obrigatórias</li>
              <li>Retorno de documento com certidão negativa (“nada consta”)</li>
              <li>Cancelamento solicitado após o início do processo junto ao cartório ou órgão emissor</li>
              <li>Custos de envio (frete) em caso de devolução por endereço incorreto ou ausência no recebimento</li>
            </ul>

            <h2 className={styles.sectionTitle}>3. Como solicitar o reembolso?</h2>
            <p>
              Se o seu caso se enquadra nas situações previstas na seção 1, você poderá solicitar o reembolso preenchendo o formulário disponível em nossa plataforma, informando:
            </p>
            <p>
              O pedido será analisado em até 5 dias úteis. Em caso de aprovação, o reembolso será efetuado em até 30 dias corridos, conforme o método de pagamento utilizado.
            </p>

            <h2 className={styles.sectionTitle}>4. Reembolso parcial</h2>
            <p>
              Poderá ser concedido reembolso parcial nos casos em que o serviço já tenha sido iniciado e tenham sido gerados custos administrativos e operacionais, tais como:
            </p>
            <ul>
                <li>Taxas de intermediação</li>
                <li>Processamento parcial do pedido junto ao cartório ou órgão competente</li>
                <li>Retorno de certidão negativa com despesas operacionais já executadas</li>
            </ul>

            <h2 className={styles.sectionTitle}>5. Contato</h2>
            <p>
              Em caso de dúvidas sobre esta política ou para acompanhar a sua solicitação, entre em contato com nosso time de atendimento:
            </p>
            <ul>
                <li>contato@e-certidoes.net.br</li>
                <li>Segunda a sexta, das 9h às 17h</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}