// AddToCartModal.js
'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AddToCartModal.module.css';

const AddToCartModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h3 className={styles.title}>Produto adicionado ao carrinho!</h3>
        <div className={styles.itemDetails}>
          <Image src={item.imageSrc} alt={item.name} width={80} height={100} className={styles.itemImage} />
          <div className={styles.itemInfo}>
            <p className={styles.itemName}>{item.name}</p>
            <p className={styles.itemPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.continueButton}>Continuar Comprando</button>
          <Link href="/carrinho" onClick={onClose} className={styles.cartButton}>Ver Carrinho</Link>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;