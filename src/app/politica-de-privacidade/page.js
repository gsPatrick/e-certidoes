import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from './PrivacyPolicy.module.css';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Política de Privacidade</h1>
          <p className={styles.updateDate}>Última atualização em 07/07/2025.</p>

          <div className={styles.content}>
            <p>
              Esta Política de Privacidade tem como objetivo informar, de forma clara e objetiva, como os dados pessoais dos usuários são coletados, utilizados e protegidos pela E-Certidões, plataforma administrada pela Palazzi Sociedade Individual de Advocacia, registrada na OAB/SP sob o nº 58133 e inscrita no CNPJ nº 58.995.590/0001-10, com sede no estado de São Paulo.
            </p>
            <p>
              A E-Certidões atua em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD) e adota práticas de segurança, transparência e responsabilidade no tratamento das informações.
            </p>

            <h2 className={styles.sectionTitle}>1. Quem somos</h2>
            <p>
              A E-Certidões é uma plataforma privada que atua como intermediadora na solicitação de certidões e documentos junto a cartórios, tabelionatos e órgãos administrativos dos governos estaduais e federal. Os dados fornecidos pelos usuários são tratados com o mais alto nível de segurança e confidencialidade, com o apoio de uma equipe especializada e respaldo jurídico.
            </p>

            <h2 className={styles.sectionTitle}>2. Quais dados são coletados</h2>
            <p>
              Durante a navegação ou uso dos serviços da plataforma, podemos coletar os seguintes dados pessoais:
            </p>
            <ul>
              <li>Nome completo</li>
              <li>CPF</li>
              <li>E-mail</li>
              <li>Endereço</li>
              <li>Telefone</li>
              <li>Informações da certidão solicitada (ex: nomes de terceiros, número de registro, datas etc.)</li>
              <li>Dados de pagamento (via processadoras externas)</li>
              <li>Endereço IP, navegador e informações do dispositivo</li>
            </ul>
            <p>
              Esses dados podem ser fornecidos diretamente pelo usuário ou coletados automaticamente durante o uso da plataforma.
            </p>

            <h2 className={styles.sectionTitle}>3. Como os dados são usados</h2>
            <p>
              Os dados pessoais coletados são utilizados com as seguintes finalidades:
            </p>
            <ul>
                <li>Processamento de pedidos de certidões e documentos</li>
                <li>Realização de atendimento e suporte ao cliente</li>
                <li>Cumprimento de obrigações legais ou regulatórias</li>
                <li>Envio de notificações e atualizações de status do pedido</li>
                <li>Emissão de notas fiscais</li>
                <li>Prevenção de fraudes e uso indevido da plataforma</li>
                <li>Melhoria contínua da experiência de navegação</li>
            </ul>
            <p>
              O tratamento é realizado com base nas hipóteses legais do Art. 7º da LGPD, como o consentimento do titular, execução de contrato, cumprimento de obrigação legal e legítimo interesse.
            </p>

            <h2 className={styles.sectionTitle}>4. Compartilhamento de dados</h2>
            <p>
              Seus dados poderão ser compartilhados com terceiros exclusivamente para fins de execução dos serviços contratados ou cumprimento de obrigações legais, incluindo:
            </p>
            <ul>
                <li>Cartórios, tabelionatos e órgãos públicos administrativos estaduais ou federais</li>
                <li>Equipe interna autorizada e parceiros técnicos confiáveis</li>
                <li>Plataformas de pagamento</li>
                <li>Autoridades públicas, quando exigido por lei ou por decisão judicial</li>
            </ul>
            <p>
              Não vendemos, alugamos ou comercializamos seus dados pessoais.
            </p>

            <h2 className={styles.sectionTitle}>5. Proteção dos dados</h2>
            <p>
              A E-Certidões adota medidas técnicas e organizacionais para proteger os dados pessoais, tais como:
            </p>
            <ul>
                <li>Uso de criptografia em conexões seguras (SSL)</li>
                <li>Controles de acesso e autenticação</li>
                <li>Armazenamento seguro em ambientes controlados</li>
                <li>Treinamento de equipe e auditorias internas de segurança</li>
            </ul>
            <p>
              O acesso às informações é restrito a pessoas autorizadas e com finalidade legítima.
            </p>

            <h2 className={styles.sectionTitle}>6. Direitos do usuário</h2>
            <p>
              Nos termos da LGPD, você tem o direito de:
            </p>
            <ul>
                <li>Confirmar se tratamos seus dados</li>
                <li>Acessar e corrigir informações pessoais</li>
                <li>Solicitar a exclusão ou anonimização de dados, quando aplicável</li>
                <li>Revogar o consentimento fornecido</li>
                <li>Solicitar portabilidade ou limitação do tratamento</li>
            </ul>
            <p>
              Para exercer esses direitos, entre em contato por meio do canal indicado ao final desta política.
            </p>

            <h2 className={styles.sectionTitle}>7. Uso de cookies</h2>
            <p>
              Utilizamos cookies e tecnologias semelhantes para melhorar a experiência do usuário, personalizar conteúdo e analisar o uso da plataforma. O usuário pode configurar o navegador para desabilitar cookies, ciente de que certas funcionalidades podem ser afetadas.
            </p>

            <h2 className={styles.sectionTitle}>8. Retenção de dados</h2>
            <p>
              Seus dados pessoais serão armazenados apenas pelo tempo necessário para a prestação dos serviços ou cumprimento de obrigações legais. Após esse período, serão eliminados ou anonimizados de forma segura.
            </p>

            <h2 className={styles.sectionTitle}>9. Alterações nesta política</h2>
            <p>
              Esta Política de Privacidade pode ser atualizada a qualquer momento para refletir alterações legais ou operacionais. A versão mais recente estará sempre disponível nesta página. Recomendamos a leitura periódica.
            </p>

            <h2 className={styles.sectionTitle}>10. Contato</h2>
            <p>
              Em caso de dúvidas, solicitações ou para exercer seus direitos relacionados aos dados pessoais, entre em contato com nossa equipe:
            </p>
            <ul>
                <li>contato@e-certidoes.net.br</li>
                <li>Segunda a sexta, das 9h às 17h</li>
            </ul>
            <p>
              A E-Certidões reafirma seu compromisso com a segurança, privacidade e transparência no tratamento dos dados pessoais de seus usuários.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}