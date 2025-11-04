// Salve em: src/components/ProductPage/ProductHeader.js
'use client';

import Image from 'next/image';
import styles from './ProductPage.module.css';
import { PaymentIcon, CalendarIcon } from './InfoIcons';

// --- MODIFICAÇÃO: O componente agora recebe as funções para abrir os modais ---
const ProductHeader = ({ title, description, imageSrc, onOpenPaymentModal, onOpenDeliveryModal }) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.imageWrapper}>
        <Image 
            src={imageSrc} 
            alt={`Imagem da ${title}`} 
            width={250}
            height={312}
            className={styles.productImage}
            priority 
        />
      </div>

      <div className={styles.detailsWrapper}>
        <h1 className={styles.productTitle}>{title}</h1>
        <p className={styles.productDescription}>{description}</p>
        
        {/* --- MODIFICAÇÃO: O botão "Começar Pedido" foi removido --- */}

        {/* --- MODIFICAÇÃO: Os links foram movidos para cá --- */}
        <div className={styles.quickInfoContainer}>
          <div className={styles.quickInfoLink} onClick={onOpenPaymentModal}>
            <PaymentIcon />
            <span>Veja as formas de pagamento</span>
            <span className={styles.chevron}>&gt;</span>
          </div>
          <div className={styles.quickInfoLink} onClick={onOpenDeliveryModal}>
            <CalendarIcon />
            <span>Calcule o prazo de entrega</span>
            <span className={styles.chevron}>&gt;</span>
          </div>
          {/* Adicione os outros dois links do "E-certidões" se desejar no futuro */}
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;