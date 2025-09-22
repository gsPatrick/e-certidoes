// Salve em: src/app/certidoes/[slug]/page.js
'use client';

import { notFound, useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { allCertificates } from '@/components/CertificatesList/certificatesData';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductHeader from '@/components/ProductPage/ProductHeader';
import ProductForm from '@/components/ProductPage/ProductForm';
import ProductTabs from '@/components/ProductPage/ProductTabs';
import styles from '@/components/ProductPage/ProductPage.module.css';

export default function CertidaoPage() {
  const params = useParams();
  const { slug } = params;
  const certificate = allCertificates.find(c => c.slug === slug);
  const { addToCart } = useCart();
  
  if (!certificate) {
    return notFound();
  }

  const handleAddToCart = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData.entries());

    const item = {
      ...certificate,
      price: parseFloat(formProps.preco_final) || 0,
      formData: formProps,
    };

    addToCart(item);
  };

  return (
    <>
      <Header />
      <main className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          
          {/* Componente que exibe o cabeçalho do produto com título e imagem */}
          <ProductHeader 
            title={certificate.name}
            description={certificate.description}
            imageSrc={certificate.imageSrc}
          />
          
          {/* O formulário envolve o componente ProductForm e define a função de submissão */}
          <form onSubmit={handleAddToCart}>
            <ProductForm 
              productData={certificate}
            />
          </form>

          {/* Componente que renderiza as abas de "Descrição" e "Dúvidas Frequentes" */}
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