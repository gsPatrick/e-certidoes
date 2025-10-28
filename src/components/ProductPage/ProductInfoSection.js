// Salve em: src/components/ProductPage/ProductInfoSection.js
import Image from 'next/image';
import styles from './ProductInfoSection.module.css';
import { PaymentIcon, CalendarIcon } from './InfoIcons';

const ProductInfoSection = () => {
  return (
    <section className={styles.infoSection}>
      <div className={styles.infoGrid}>
        {/* Coluna de Formas de Pagamento */}
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>
            <PaymentIcon />
            <span>Formas de pagamento</span>
          </h3>
          <ul className={styles.infoList}>
            <li>
              <strong>Cartão de crédito</strong>
              {/* CORREÇÃO: Removido "sem juros" */}
              <p>Parcele suas compras em até 3X no cartão de crédito.</p>
              <div className={styles.paymentMethods}>
                {/* CORREÇÃO: Adicionadas logomarcas */}
                <Image src="/payment-logos/visa.png" alt="Visa" width={40} height={25} />
                <Image src="/payment-logos/mastercard.png" alt="Mastercard" width={40} height={25} />
                <Image src="/payment-logos/elo.png" alt="Elo" width={40} height={25} />
                <Image src="/payment-logos/hiper.png" alt="Hipercard" width={40} height={25} />
                <Image src="/payment-logos/amex.png" alt="American Express" width={40} height={25} />
              </div>
            </li>
            <li>
              <strong>Boleto</strong>
              {/* CORREÇÃO: Removido desconto */}
              <p>Realize o pagamento via Boleto Bancário. A compensação pode levar até 2 dias úteis.</p>
            </li>
            <li>
              <strong>Pix</strong>
              <p>Efetue o pagamento via PIX e tenha aprovação imediata.</p>
            </li>
          </ul>
        </div>

        {/* Coluna de Prazos de Entrega */}
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>
            <CalendarIcon />
            <span>Prazo de entrega</span>
          </h3>
          <ul className={styles.infoList}>
            <li>Certidões Digitais: entre 1 a 5 dias úteis.</li>
            <li>Certidões Físicas (papel): entre 5 a 20 dias úteis + o prazo de envio dos Correios.</li>
            <li>Certidões do Estado e da União: entre 1 a 15 dias úteis</li>
            <li>Pesquisa Prévia por CPF/CNPJ: dentro de 24 horas</li>
            <li>Pesquisa Qualificada por CPF/CNPJ: entre 5 a 20 dias úteis.</li>
          </ul>
          <p className={styles.obsText}>
            <strong>Obs.:</strong> Cada órgão da administração tem o seu próprio procedimento no levantamento de informações e emissão de certidões. Assim, o prazo de entrega poderá aumentar ou diminuir a depender do órgão requerido.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductInfoSection;