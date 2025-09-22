// Salve em: src/components/WhatsAppButton/WhatsAppButton.js
'use client';

import Link from 'next/link';
import Image from 'next/image'; // 1. Importe o componente Image do Next.js
// import WhatsAppIcon from './WhatsAppIcon'; // 2. Remova a importação do ícone antigo
import styles from './WhatsAppButton.module.css';

const WhatsAppButton = () => {
  const whatsappLink = "https://api.whatsapp.com/send/?phone=5519996537342&text&type=phone_number&app_absent=0";

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsAppButton}
      aria-label="Fale conosco pelo WhatsApp"
    >
      {/* 3. Substitua o ícone pelo componente Image */}
      <Image 
        src="/WhatsApp.png" 
        alt="Ícone do WhatsApp" 
        width={32} 
        height={32} 
      />
    </Link>
  );
};

export default WhatsAppButton;