// Salve em: src/app/certidoes/[slug]/page.js
'use client';

import { useState, Suspense } from 'react'; // 1. IMPORTAR O SUSPENSE
import { notFound, useParams } from 'next/navigation';
import { allCertificates } from '@/components/CertificatesList/certificatesData';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductHeader from '@/components/ProductPage/ProductHeader';
import MultiStepForm from '@/components/MultiStepForm/MultiStepForm';
import ProductTabs from '@/components/ProductPage/ProductTabs';
import InfoModal from '@/components/ProductPage/InfoModal';
import Image from 'next/image';
import PageLoader from '@/components/PageLoader/PageLoader'; // 2. IMPORTAR O LOADER
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

  const imageSrc = certificate.imageSrc || '/certidoes/default-placeholder.png';

  return (
    <>
      <Header />
      <main className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <ProductHeader 
            title={certificate.name}
            description={certificate.description}
            imageSrc={imageSrc}
            onOpenPaymentModal={() => setPaymentModalOpen(true)}
            onOpenDeliveryModal={() => setDeliveryModalOpen(true)}
          />
          
          <div id="form-inicio">
            {!certificate.isPlaceholder ? (
              // 3. ENVOLVER O MULTISTEPFORM COM O SUSPENSE
              <Suspense fallback={<PageLoader />}>
                <MultiStepForm productData={certificate} />
              </Suspense>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h3>Serviço em Breve</h3>
                <p>Este serviço está sendo finalizado para oferecer a você a melhor experiência. Volte em breve!</p>
              </div>
            )}
          </div>

          <ProductTabs
            descriptionContent={certificate.longDescription}
            faqContent={certificate.faq}
          />
        </div>
      </main>
      <Footer />

      <InfoModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)}
        title="Formas de pagamento"
      >
        <ul className={modalStyles.infoList}>
          <li>
            <strong>Cartão de crédito</strong>
            <p>Parcele suas compras em até 3X no cartão de crédito.</p>
            <div className={modalStyles.paymentMethods}>
              <Image src="/payment-logos/bandeiras.png" alt="Bandeiras de Cartão" width={200} height={30} />
            </div>
          </li>
          <li>
            <strong>Boleto</strong>
            <p>Realize o pagamento via Boleto Bancário. A compensação pode levar até 2 dias úteis.</p>
          </li>
          <li>
            <strong>Pix</strong>
            <p>Efetue o pagamento via PIX e tenha aprovação imediata.</p>
          </li>
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