// Salve em: src/components/MultiStepForm/steps/ImageModal.js
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import styles from './ImageModal.module.css';

export default function ImageModal({ imageSrc, onClose }) {
  // Fecha o modal se a tecla 'Escape' for pressionada
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    // O overlay fecha ao ser clicado
    <div className={styles.overlay} onClick={onClose}>
      <button className={styles.closeButton} onClick={onClose}>×</button>
      {/* O container da imagem impede que o clique feche o modal */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <Image 
          src={imageSrc} 
          alt="Exemplo de documento" 
          width={1200} // Largura de alta resolução (o CSS ajustará)
          height={1680} // Altura de alta resolução (o CSS ajustará)
          className={styles.image}
          priority
        />
      </div>
    </div>
  );
}