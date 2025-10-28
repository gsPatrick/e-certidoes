// Salve em: src/components/MultiStepForm/steps/StepConsultaJuridica.js
'use client';

import styles from './StepConsultaJuridica.module.css'; // Crie este CSS também
import Link from 'next/link';

// Funções para aplicar máscaras de formatação
const maskTelefone = (value) => {
  let v = value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  if (v.length > 2) return v.replace(/(\d{2})(\d*)/, '($1) $2');
  return v.replace(/(\d*)/, '($1');
};

export default function StepConsultaJuridica({ formData, handleChange, productData }) {

  const handleTelefoneChange = (e) => {
    handleChange({ target: { name: 'telefone_contato', value: maskTelefone(e.target.value) } });
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>1. Dados para Contato</h3>
      <p className={styles.stepDescription}>
        Informe seus dados para que um de nossos advogados possa entrar em contato para agendar sua consulta.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="nome_completo_contato">Nome completo*</label>
        <input
          type="text"
          id="nome_completo_contato"
          name="nome_completo_contato"
          value={formData.nome_completo_contato || ''}
          onChange={handleChange}
          placeholder="Seu nome completo"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email_contato">E-mail*</label>
        <input
          type="email"
          id="email_contato"
          name="email_contato"
          value={formData.email_contato || ''}
          onChange={handleChange}
          placeholder="Seu melhor e-mail"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="telefone_contato">Telefone*</label>
        <input
          type="tel"
          id="telefone_contato"
          name="telefone_contato"
          value={formData.telefone_contato || ''}
          onChange={handleTelefoneChange}
          placeholder="(00) 00000-0000"
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="assunto_contato">Assunto da Consulta*</label>
        <select
          id="assunto_contato"
          name="assunto_contato"
          value={formData.assunto_contato || ''}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Selecione um assunto</option>
          <option value="imobiliario">Direito Imobiliário</option>
          <option value="familia">Direito de Família</option>
          <option value="contratos">Contratos e Obrigações</option>
          <option value="outro">Outro assunto</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="mensagem_contato">Descreva brevemente sua dúvida (opcional)</label>
        <textarea
          id="mensagem_contato"
          name="mensagem_contato"
          value={formData.mensagem_contato || ''}
          onChange={handleChange}
          placeholder="Ex: Dúvida sobre compra de imóvel, divórcio, etc."
          rows="4"
        />
      </div>

      <div className={styles.infoBox}>
        <p>
          Para agilizar seu atendimento, você também pode entrar em contato diretamente pelo WhatsApp:
        </p>
        <p className={styles.whatsappNumber}>
          (19) 99915-8230
        </p>
        <Link 
          href="https://api.whatsapp.com/send?phone=5519999158230&text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20consulta%20jur%C3%ADdica." 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.whatsappButton}
        >
          Falar no WhatsApp
        </Link>
      </div>
    </div>
  );
}