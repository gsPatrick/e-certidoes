// Salve em: src/components/MultiStepForm/steps/StepFormato.js
'use client';

import { useEffect } from 'react';
import styles from './StepFormato.module.css';

const toSlug = (str) => {
  if (!str) return '';
  const normalizedStr = str.normalize('NFD');
  const withoutAccents = normalizedStr.replace(/[\u0300-\u036f]/g, '');
  return withoutAccents.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
};

export default function StepFormato({ formData, handleChange, productData }) {

  let formatOptions = [];
  const isEscritura = productData?.category === 'Tabelionato de Notas (Escrituras)';
  const isProtesto = productData?.slug === toSlug('Certidão de Protesto');
  // 1. ADICIONADA VERIFICAÇÃO PARA REGISTRO CIVIL
  const isRegistroCivil = productData?.category === 'Cartório de Registro Civil';

  if (isProtesto) {
    formatOptions = [
      { 
        value: 'Certidão eletrônica', 
        label: 'Certidão eletrônica', 
        description: 'Será disponibilizada no painel do usuário e enviada ao e-mail.',
        price_add: null,
      },
    ];
  } else if (isEscritura) {
    formatOptions = [
      { 
        value: 'Certidão Transcrita', 
        label: 'Certidão Transcrita', 
        description: 'Trata-se de certidão digitada (datilografada), com todos os dados do livro. Será enviada ao endereço do solicitante.',
        price_add: null,
      },
      { 
        value: 'Certidão Reprográfica', 
        label: 'Certidão Reprográfica', 
        description: 'Trata-se de imagem fiel do livro (scanner). Constará, inclusive, as assinaturas das partes e testemunhas.', 
        price_add: 20.00,
      },
    ];
  // 2. ADICIONADO BLOCO CONDICIONAL PARA REGISTRO CIVIL COM OS NOVOS TEXTOS
  } else if (isRegistroCivil) {
    formatOptions = [
      { 
        value: 'Certidão eletrônica', 
        label: 'Certidão eletrônica', 
        description: 'Emitida em breve relato. É a mais pedida e usual. será disponibilizada no painel do usuário e enviada ao e-mail.',
        price_add: null,
        isMostPopular: true
      },
      { 
        value: 'Certidão em papel', 
        label: 'Certidão em papel', 
        description: 'Emitida em inteiro teor contendo todos os dados do livro de assento. Necessária em casos de cidadania. Será enviada através dos Correios', 
        price_add: 40.00,
      },
    ];
  } else {
    // 3. LÓGICA ORIGINAL MANTIDA PARA OS DEMAIS CASOS (EX: REGISTRO DE IMÓVEIS)
    formatOptions = [
      { 
        value: 'Certidão eletrônica', 
        label: 'Certidão eletrônica', 
        description: 'É a mais pedida e usual. Será disponibilizada no painel do usuário e enviada ao e-mail.',
        price_add: null,
        isMostPopular: true
      },
      { 
        value: 'Certidão em papel', 
        label: 'Certidão em papel', 
        description: 'Será enviada no endereço informado através dos Correios. Contém todos os dados registrados no livro do assento.', 
        price_add: 40.00,
      },
    ];
  }

  const selectedValue = formData.formato || formatOptions[0].value;

  useEffect(() => {
    if (!formData.formato || !formatOptions.some(opt => opt.value === formData.formato)) {
      handleChange({ target: { name: 'formato', value: formatOptions[0].value } });
    }
  }, [formData.formato, handleChange, formatOptions]);

  const stepNumber = isProtesto ? '3' : '3';

  return (
    <div>
      <h3 className={styles.stepTitle}>{stepNumber}. Formato</h3>
      
      <div className={styles.radioGroupContainer}>
        {formatOptions.map(opt => (
          <label key={opt.value} className={styles.radioOption}>
            {opt.isMostPopular && (
              <div className={styles.mostPopularTag}>A MAIS PEDIDA</div>
            )}
            <input
              type="radio"
              name="formato"
              value={opt.value}
              checked={selectedValue === opt.value}
              onChange={handleChange}
              required
            />
            <div className={styles.radioDetails}>
              <strong>{opt.label}</strong>
              <small>{opt.description}</small>
            </div>
            {opt.price_add && (
              <span className={styles.priceAdd}>
                + R$ {opt.price_add.toFixed(2).replace('.', ',')}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}