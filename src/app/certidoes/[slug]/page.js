// Salve em: src/app/certidoes/[slug]/page.js
'use client';

import { notFound, useParams } from 'next/navigation';
import { allCertificates } from '@/components/CertificatesList/certificatesData';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductHeader from '@/components/ProductPage/ProductHeader';
import MultiStepForm from '@/components/MultiStepForm/MultiStepForm'; // ATUALIZADO
import ProductTabs from '@/components/ProductPage/ProductTabs';
import styles from '@/components/ProductPage/ProductPage.module.css';

export default function CertidaoPage() {
  const params = useParams();
  const { slug } = params;
  const certificate = allCertificates.find(c => c.slug === slug);
  
  if (!certificate) {
    return notFound();
  }

  // A LÓGICA DE SUBMISSÃO AGORA VIVE DENTRO DO MULTISTEPFORM
  
  return (
    <>
      <Header />
      <main className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <ProductHeader 
            title={certificate.name}
            description={certificate.description}
            imageSrc={certificate.imageSrc}
          />
          
          {/* O FORMULÁRIO ANTIGO FOI SUBSTITUÍDO PELO NOVO COMPONENTE */}
          <MultiStepForm productData={certificate} />

          <ProductTabs
            descriptionContent={certificate.longDescription}
            faqContent={certificate.faq}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}