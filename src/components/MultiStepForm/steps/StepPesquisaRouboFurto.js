// Salve em: src/components/MultiStepForm/steps/StepPesquisaRouboFurto.js
'use client';

import styles from './StepPesquisa.module.css';

export default function StepPesquisaRouboFurto({ formData, handleChange, error, productData }) {
  return (
    <div>
      <h3 className={styles.stepTitle}>{productData.name}</h3>
      <p className={styles.stepDescription}>
        Preencha ao menos um dos campos abaixo para realizar a pesquisa.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="placa">Placa</label>
        <input
          type="text"
          id="placa"
          name="placa"
          value={formData.placa || ''}
          onChange={handleChange}
          placeholder="Digite a placa"
        />
      </div>

      <div className={styles.formGroup}>
        {/* *** LABEL CORRIGIDA AQUI *** */}
        <label htmlFor="chassi">Chassi</label>
        <input
          type="text"
          id="chassi"
          name="chassi"
          value={formData.chassi || ''}
          onChange={handleChange}
          placeholder="Digite o Chassi"
        />
      </div>
      
      {error && <small className={styles.errorMessage}>{error}</small>}
      <p className={styles.infoText}>Ao menos 1 (um) campo deverá ser preenchido.</p>
    </div>
  );
}