// Salve em: src/components/MultiStepForm/steps/StepFederalDados.js
'use client';

import styles from './StepFederalDados.module.css';

// Função para aplicar a máscara de CPF
const maskCPF = (value) => {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .slice(0, 11)       // Limita a 11 dígitos
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto depois do terceiro dígito
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto depois do sexto dígito
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca hífen depois do nono dígito
};

export default function StepFederalDados({ formData, handleChange, error, productData }) {
  
  const handleCpfChange = (e) => {
    // Aplica a máscara e propaga a mudança para o formulário principal
    handleChange({ target: { name: 'cpf', value: maskCPF(e.target.value) } });
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>1. Dados da Certidão</h3>
      <p className={styles.stepDescription}>
        Informe os dados no formulário abaixo para iniciarmos a solicitação da {productData.name}.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="nome_completo">Nome completo*</label>
        <input
          type="text"
          id="nome_completo"
          name="nome_completo"
          value={formData.nome_completo || ''}
          onChange={handleChange}
          placeholder="Nome completo (registrado civilmente)"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cpf">CPF*</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          value={formData.cpf || ''}
          onChange={handleCpfChange}
          placeholder="000.000.000-00"
          required
        />
        {error && <small className={styles.errorMessage}>{error}</small>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="data_nascimento">Data de Nascimento*</label>
        <input
          type="date"
          id="data_nascimento"
          name="data_nascimento"
          value={formData.data_nascimento || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="nome_mae">Nome da mãe*</label>
        <input
          type="text"
          id="nome_mae"
          name="nome_mae"
          value={formData.nome_mae || ''}
          onChange={handleChange}
          placeholder="Nome completo da mãe"
          required
        />
      </div>
    </div>
  );
}