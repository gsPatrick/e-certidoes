
// Salve em: src/components/MultiStepForm/steps/StepFormato.js
'use client';

import styles from './StepFormato.module.css';

export default function StepFormato({ formData, handleChange }) {

  const formatOptions = [
    { 
      value: 'Certidão em papel', 
      label: 'Certidão em papel', 
      description: 'Enviada no endereço', 
      price_add: 20.00 
    },
    { 
      value: 'Certidão eletrônica', 
      label: 'Certidão eletrônica', 
      description: 'Enviada por e-mail em PDF',
      price_add: null
    },
    { 
      value: 'Certidão em papel + eletrônica', 
      label: 'Certidão em papel + eletrônica', 
      description: 'Enviada no endereço e por e-mail em PDF',
      price_add: 289.90
    },
  ];

  // Define um valor padrão se nenhum estiver selecionado ainda
  const selectedValue = formData.formato || 'Certidão eletrônica';

  return (
    <div>
      <h3 className={styles.stepTitle}>3. FORMATO</h3>
      
      <div className={styles.radioGroupContainer}>
        {formatOptions.map(opt => (
          <label key={opt.value} className={styles.radioOption}>
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