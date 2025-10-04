// Salve em: src/app/certidoes/[slug]/page.js
'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { allCertificates } from '@/components/CertificatesList/certificatesData';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductHeader from '@/components/ProductPage/ProductHeader';
import MultiStepForm from '@/components/MultiStepForm/MultiStepForm';
import ProductTabs from '@/components/ProductPage/ProductTabs';
import InfoModal from '@/components/ProductPage/InfoModal';
import Image from 'next/image';
import styles from '@/components/ProductPage/ProductPage.module.css';
import modalStyles from '@/components/ProductPage/ProductInfoSection.module.css';

export default function CertidaoPage() {
  const params = useParams();
  const { slug } = params;
  const certificate = allCertificates.find(c => c.slug === slug);

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isDeliveryModalOpen, setDeliveryModalOpen] = useState(false);
  
  if (!certificate) {
    return notFound();
  }

  return (
    <>
      <Header />
      <main className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <ProductHeader 
            title={certificate.name}
            description={certificate.description}
            imageSrc={certificate.imageSrc}
            // --- MODIFICAÇÃO: Passando as funções para o ProductHeader ---
            onOpenPaymentModal={() => setPaymentModalOpen(true)}
            onOpenDeliveryModal={() => setDeliveryModalOpen(true)}
          />
          
          {/* --- MODIFICAÇÃO: A seção de links separada foi removida daqui --- */}

          <div id="form-inicio">
            {!certificate.isPlaceholder && (
              <MultiStepForm productData={certificate} />
            )}
          </div>

          <ProductTabs
            descriptionContent={certificate.longDescription}
            faqContent={certificate.faq}
          />
        </div>
      </main>
      <Footer />

      {/* MODAIS (permanecem iguais) */}
      <InfoModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)}
        title="Formas de pagamento"
      >
        <ul className={modalStyles.infoList}>
          <li><strong>Cartão de crédito</strong><p>Parcele em até 3X sem juros no cartão de crédito.</p><div className={modalStyles.paymentMethods}><Image src="/payment-logos/visa.png" alt="Visa" width={40} height={25} /><Image src="/payment-logos/mastercard.png" alt="Mastercard" width={40} height={25} /><Image src="/payment-logos/elo.png" alt="Elo" width={40} height={25} /><Image src="/payment-logos/hiper.png" alt="Hipercard" width={40} height={25} /><Image src="/payment-logos/alelo.png" alt="Alelo" width={40} height={25} /></div></li>
          <li><strong>Boleto</strong><p>Receba 5% de desconto pagando via Boleto.</p></li>
          <li><strong>Pix</strong><p>Efetue o pagamento via PIX e tenha aprovação imediata.</p></li>
        </ul>
      </InfoModal>

      <InfoModal 
        isOpen={isDeliveryModalOpen} 
        onClose={() => setDeliveryModalOpen(false)}
        title="Prazo de entrega"
      >
        <ul className={modalStyles.infoList}>
          <li>Certidões Digitais: entre 1 a 5 dias úteis.</li>
          <li>Certidões Físicas (papel): entre 5 a 20 dias úteis + o prazo de envio dos Correios.</li>
          <li>Certidões do Estado e da União: entre 1 a 15 dias úteis</li>
          <li>Pesquisa Prévia por CPF/CNPJ: dentro de 24 horas</li>
          <li>Pesquisa Qualificada por CPF/CNPJ: entre 5 a 20 dias úteis.</li>
        </ul>
        <p className={modalStyles.obsText}>
          <strong>Obs.:</strong> Cada órgão da administração tem o seu próprio procedimento. Assim, o prazo de entrega poderá aumentar ou diminuir a depender do órgão requerido.
        </p>
      </InfoModal>
    </>
  );
}