// Salve em: src/components/MultiStepForm/steps/StepFormato.js
'use client';

import { useEffect } from 'react'; // Importamos o useEffect
import styles from './StepFormato.module.css';

export default function StepFormato({ formData, handleChange }) {

  const formatOptions = [
    { 
      value: 'Certidão eletrônica', 
      label: 'Certidão eletrônica', 
      // Removemos "É a mais usual" do texto, pois agora será uma tag visual.
      description: 'Enviada ao painel do usuário e no e-mail em PDF.',
      price_add: null,
      isMostPopular: true // Adicionamos uma flag para identificar a opção
    },
    { 
      value: 'Certidão em papel', 
      label: 'Certidão em papel', 
      description: 'Enviada no endereço', 
      price_add: 20.00,
      isMostPopular: false
    },
  ];

  const selectedValue = formData.formato || formatOptions[0].value;

  useEffect(() => {
    if (!formData.formato) {
      handleChange({ target: { name: 'formato', value: formatOptions[0].value } });
    }
  }, [formData.formato, handleChange]);

  return (
    <div>
      <h3 className={styles.stepTitle}>3. FORMATO</h3>
      
      <div className={styles.radioGroupContainer}>
        {formatOptions.map(opt => (
          <label key={opt.value} className={styles.radioOption}>
            
            {/* === RENDERIZAÇÃO CONDICIONAL DA TAG === */}
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