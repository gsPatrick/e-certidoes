// Salve em: src/components/MultiStepForm/steps/StepRequerente.js
'use client';

import styles from './StepRequerente.module.css';

// Funções para aplicar máscaras
const maskCPF = (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskTelefone = (value) => {
    let v = value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    if (v.length > 2) return v.replace(/(\d{2})(\d*)/, '($1) $2');
    return v.replace(/(\d*)/, '($1');
};

export default function StepRequerente({ formData, handleChange, error }) {
  
  const handleCpfChange = (e) => handleChange({ target: { name: 'requerente_cpf', value: maskCPF(e.target.value) } });
  const handleTelefoneChange = (e) => handleChange({ target: { name: 'requerente_telefone', value: maskTelefone(e.target.value) } });

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
        <input type="tel" id="requerente_telefone" name="requerente_telefone" value={formData.requerente_telefone || ''} onChange={handleTelefoneChange} placeholder="(00) 00000-0000" required />
      </div>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="requerente_cpf">CPF *</label>
          <input type="text" id="requerente_cpf" name="requerente_cpf" value={formData.requerente_cpf || ''} onChange={handleCpfChange} placeholder="000.000.000-00" required />
          {error && <small className={styles.errorMessage}>{error}</small>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="requerente_rg">RG *</label>
          <input type="text" id="requerente_rg" name="requerente_rg" value={formData.requerente_rg || ''} onChange={handleChange} placeholder="Digite seu RG" required />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="requerente_email">E-mail *</label>
        <input type="email" id="requerente_email" name="requerente_email" value={formData.requerente_email || ''} onChange={handleChange} placeholder="E-mail para receber informações do pedido" required />
      </div>
    </div>
  );
}