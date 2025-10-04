// Salve em: src/components/MultiStepForm/steps/StepFormato.js
'use client';

import { useEffect } from 'react';
import styles from './StepFormato.module.css';

export default function StepFormato({ formData, handleChange, productData }) {

  // --- ALTERAÇÃO INICIADA: Lógica condicional para formato ---
  let formatOptions = [];
  const isEscritura = productData?.category === 'Tabelionato de Notas (Escrituras)';

  if (isEscritura) {
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
  } else {
    formatOptions = [
      { 
        value: 'Certidão eletrônica', 
        label: 'Certidão eletrônica', 
        description: 'É a mais pedida e usual. Emitida em breve relato de forma mais rápida. Será disponibilizada no painel do usuário e enviada ao e-mail.',
        price_add: null,
        isMostPopular: true
      },
      { 
        value: 'Certidão em papel', 
        label: 'Certidão em papel', 
        description: 'Necessária em casos de cidadania. Será enviada no endereço informado através dos Correios. Contém todos os dados registrados no livro do assento.', 
        price_add: 20.00,
      },
    ];
  }
  // --- ALTERAÇÃO FINALIZADA ---

  const selectedValue = formData.formato || formatOptions[0].value;

  useEffect(() => {
    if (!formData.formato) {
      handleChange({ target: { name: 'formato', value: formatOptions[0].value } });
    }
  }, [formData.formato, handleChange, formatOptions]);

  return (
    <div>
      <h3 className={styles.stepTitle}>3. Formato</h3>
      
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