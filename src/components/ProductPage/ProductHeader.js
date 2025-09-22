// Salve em: src/components/ProductPage/ProductHeader.js
import Image from 'next/image';
import Link from 'next/link'; // Usaremos Link para o botão
import styles from './ProductPage.module.css';

const ProductHeader = ({ title, description, imageSrc }) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.imageWrapper}>
        <Image 
            src={imageSrc} 
            alt={`Imagem da ${title}`} 
            width={250} // Diminuído para melhor encaixe
            height={312} // Mantendo proporção 4:5
            className={styles.productImage}
            priority 
        />
      </div>
      <div className={styles.detailsWrapper}>
        <h1 className={styles.productTitle}>{title}</h1>
        <p className={styles.productDescription}>{description}</p>
        {/* O botão agora é um link que rola para o formulário */}
        <Link href="#form-inicio" className={styles.ctaButton}>
            Começar Pedido
        </Link>
      </div>
    </div>
  );
};

export default ProductHeader;