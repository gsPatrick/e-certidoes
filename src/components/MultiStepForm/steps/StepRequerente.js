// Salve em: src/components/MultiStepForm/steps/StepRequerente.js
'use client';

import styles from './StepRequerente.module.css';

// Função para aplicar a máscara de CPF
const maskCPF = (value) => {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .slice(0, 11) // Limita a 11 dígitos
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto depois do terceiro dígito
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto depois do sexto dígito
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca hífen depois do nono dígito
};

export default function StepRequerente({ formData, handleChange, error }) {
  
  const handleCpfChange = (e) => {
    // Aplica a máscara e propaga a mudança
    handleChange({ target: { name: 'requerente_cpf', value: maskCPF(e.target.value) } });
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>IDENTIFIQUE-SE PARA PROSSEGUIR</h3>
      <p className={styles.stepDescription}>
        Informe seus dados para acompanhar o andamento e receber atualizações do seu serviço.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="requerente_nome">Nome completo do(a) solicitante *</label>
        <input type="text" id="requerente_nome" name="requerente_nome" value={formData.requerente_nome || ''} onChange={handleChange} placeholder="Escreva o nome do(a) solicitante" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="requerente_telefone">Telefone *</label>
        <input type="tel" id="requerente_telefone" name="requerente_telefone" value={formData.requerente_telefone || ''} onChange={handleChange} placeholder="Telefone do solicitante" required />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="requerente_cpf">CPF *</label>
        <input type="text" id="requerente_cpf" name="requerente_cpf" value={formData.requerente_cpf || ''} onChange={handleCpfChange} placeholder="000.000.000-00" required />
        {/* Exibe a mensagem de erro se ela existir */}
        {error && <small className={styles.errorMessage}>{error}</small>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="requerente_email">E-mail *</label>
        <input type="email" id="requerente_email" name="requerente_email" value={formData.requerente_email || ''} onChange={handleChange} placeholder="E-mail para receber informações do pedido" required />
      </div>
    </div>
  );
}