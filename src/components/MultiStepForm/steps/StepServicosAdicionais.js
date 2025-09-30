// Salve em: src/components/MultiStepForm/steps/StepServicosAdicionais.js
'use client';

import styles from './StepServicosAdicionais.module.css';

export default function StepServicosAdicionais({ formData, handleChange }) {

  // A lista de serviços já está filtrada conforme a documentação
  const additionalServices = [
    {
      id: 'apostilamento',
      label: 'Apostilamento',
      description: 'É um certificado de autenticidade, emitido da Convenção de Haia.'
    },
    {
      id: 'aviso_recebimento',
      label: 'Aviso de recebimento (A.R)',
      description: 'Recibo dos correios que comprova a entrega do documento para o remetente.'
    }
  ];

  return (
    <div>
      <h3 className={styles.stepTitle}>4. SERVIÇOS ADICIONAIS</h3>
      
      <div className={styles.checkboxGroupContainer}>
        {additionalServices.map(service => (
          <label key={service.id} className={styles.checkboxOption}>
            <input 
              type="checkbox"
              id={service.id}
              name={service.id}
              checked={!!formData[service.id]} // !! garante que será true ou false
              onChange={handleChange}
              className={styles.checkboxInput}
            />
            <div className={styles.checkboxDetails}>
              <span className={styles.checkboxLabel}>{service.label}</span>
              <p className={styles.checkboxDescription}>{service.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}