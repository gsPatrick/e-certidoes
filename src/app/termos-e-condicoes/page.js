import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
// Reutilizando o mesmo CSS para manter a consistência
import styles from '../politica-de-privacidade/PrivacyPolicy.module.css';

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Termos e Condições</h1>
          <p className={styles.updateDate}>Última atualização em 07/07/2025.</p>

          <div className={styles.content}>
            <p>
              Boas-vindas ao nosso site! Este documento estabelece os Termos e Condições aplicáveis à utilização da plataforma E-Certidões, administrada e mantida pela Palazzi Sociedade de Advogados, registrada na OAB/SP sob o nº 58133 e inscrita no CNPJ nº 58.995.590/0001-10, com sede no estado de São Paulo. Ao acessar ou utilizar nossos serviços, você declara que leu, compreendeu e concorda integralmente com os termos a seguir.
            </p>

            <h2 className={styles.sectionTitle}>1. Objetivo da Plataforma</h2>
            <p>
              A E-Certidões é uma plataforma digital que atua como intermediadora na solicitação de certidões e documentos públicos junto a cartórios, tabelionatos e órgãos administrativos dos governos estaduais e federal. Oferecemos um serviço privado e independente que visa facilitar esse processo por meio de tecnologia, suporte e praticidade. Não somos um cartório nem mantemos vínculo institucional com tais entidades.
            </p>

            <h2 className={styles.sectionTitle}>2. Cadastro e Acesso</h2>
            <p>Para efetuar um pedido, o usuário deve preencher um formulário com os dados solicitados, incluindo CPF e e-mail válidos.</p>
            <ul>
              <li>O usuário é responsável pela veracidade e atualização das informações fornecidas.</li>
              <li>O acompanhamento dos pedidos ocorre via Central do Cliente, acessível com as credenciais enviadas por e-mail.</li>
              <li>Dados falsos ou inconsistentes podem acarretar o cancelamento da conta e do serviço sem reembolso.</li>
            </ul>

            <h2 className={styles.sectionTitle}>3. Pagamentos</h2>
            <p>O valor total cobrado inclui:</p>
            <ul>
              <li>Taxas oficiais cobradas pelos cartórios e órgãos competentes (emolumentos)</li>
              <li>Taxa de intermediação e suporte prestado pela plataforma</li>
              <li>Despesas adicionais (se aplicáveis), como autenticações, cópias, envio postal, etc.</li>
            </ul>
            <p>
              Aceitamos pagamentos via Pix, cartão de crédito e boleto bancário. Os dados financeiros são processados por empresas terceirizadas especializadas, não sendo armazenados por nós.
            </p>
            <p>
              Em casos de preenchimento incorreto ou recusa de emissão pela entidade emissora, poderá ser retida uma taxa administrativa de R$ 39,90.
            </p>

            <h2 className={styles.sectionTitle}>4. Entrega e Prazos</h2>
            <p>
              Os prazos estimados para emissão e envio variam conforme o tipo de certidão, localidade e órgão emissor. As estimativas são apresentadas na página do pedido e também na Central do Cliente.
            </p>
            <ul>
                <li>Certidões físicas são enviadas pelos Correios ou transportadoras.</li>
                <li>Não nos responsabilizamos por atrasos, extravios ou falhas dos serviços de entrega.</li>
                <li>O reenvio por motivo de endereço incorreto ou não recebimento depende de novo pagamento de frete.</li>
            </ul>

            <h2 className={styles.sectionTitle}>5. Reembolsos</h2>
            <p>Você poderá solicitar reembolso nas seguintes situações:</p>
            <ul>
                <li>Pedido ainda não enviado ao órgão emissor</li>
                <li>Pagamento em duplicidade</li>
                <li>Atraso superior a 10 dias úteis em relação ao prazo informado</li>
            </ul>
            <p>Não haverá reembolso nos seguintes casos:</p>
            <ul>
                <li>Dados preenchidos incorretamente pelo usuário</li>
                <li>Certidões negativas (“nada consta”)</li>
                <li>Recusa de emissão por falta de informações obrigatórias</li>
            </ul>
            <p>Reembolsos serão processados em até 30 dias corridos.</p>
            
            <h2 className={styles.sectionTitle}>6. Responsabilidades</h2>
            <p>
              A E-Certidões atua apenas como intermediadora do processo, e não tem controle sobre prazos, erros ou negativa de emissão por parte das entidades emissoras.
            </p>
            <p>
              Caso haja erro na certidão emitida, a solicitação de retificação deve ser feita diretamente ao órgão responsável.
            </p>
            <p>
              Ao utilizar este site, o usuário reconhece e aceita essas limitações de responsabilidade.
            </p>
            
            <h2 className={styles.sectionTitle}>7. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da plataforma – incluindo textos, marca, identidade visual, estrutura, layout e elementos gráficos – é de uso exclusivo da E-Certidões. A reprodução, distribuição ou qualquer forma de utilização indevida sem autorização prévia poderá ensejar medidas civis e penais.
            </p>

            <h2 className={styles.sectionTitle}>8. Privacidade e Proteção de Dados</h2>
            <p>
              Os dados fornecidos são tratados com confidencialidade e em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD). Para mais informações, consulte nossa Política de Privacidade.
            </p>

            <h2 className={styles.sectionTitle}>9. Atualizações destes Termos</h2>
            <p>
              Este documento pode ser alterado a qualquer momento, sendo a versão vigente sempre disponibilizada nesta página. A utilização contínua do site após qualquer atualização representa aceitação integral dos novos termos.
            </p>

            <h2 className={styles.sectionTitle}>10. Contato</h2>
            <p>
              Em caso de dúvidas, solicitações ou exercício de direitos relacionados ao serviço ou ao tratamento de dados pessoais, entre em contato conosco:
            </p>
            <ul>
                <li>contato@e-certidoes.net.br</li>
                <li>Segunda a sexta, das 9h às 17h</li>
            </ul>

            <h2 className={styles.sectionTitle}>11. Foro</h2>
            <p>
              Fica eleito o foro da Comarca de São Paulo/SP, com renúncia a qualquer outro, por mais privilegiado que seja, para dirimir eventuais controvérsias decorrentes destes Termos.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}