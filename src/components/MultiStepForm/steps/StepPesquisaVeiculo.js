// Salve em: src/components/MultiStepForm/steps/StepPesquisaVeiculo.js
'use client';

import styles from './StepPesquisa.module.css'; // Usando o CSS genérico para pesquisas simples

export default function StepPesquisaVeiculo({ formData, handleChange, error, productData }) {
  return (
    <div>
      <h3 className={styles.stepTitle}>{productData.name}</h3>
      <p className={styles.stepDescription}>
        {productData.description}
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="placa">Placa *</label>
        <input
          type="text"
          id="placa"
          name="placa"
          value={formData.placa || ''}
          onChange={handleChange}
          placeholder="Digite a placa do veículo"
          required
        />
        {error && <small className={styles.errorMessage}>{error}</small>}
      </div>
    </div>
  );
}