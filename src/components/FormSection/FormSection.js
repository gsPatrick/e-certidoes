// Salve em: src/components/FormSection/FormSection.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FormSection.module.css';

const FormSection = ({ imageSrc, imageAlt, title, description }) => {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('Você precisa concordar com a Política de Privacidade.');
      return;
    }
    alert('Formulário enviado com sucesso!');
  };

  return (
    <section className={styles.contactWrapper}>
      <div className={styles.imageColumn}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
      <div className={styles.formColumn}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.description}>
            {description}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">Seu nome <span className={styles.required}>(obrigatório)</span></label>
                <input type="text" id="firstName" name="firstName" placeholder="Nome" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.hiddenLabel}>Sobrenome</label>
                <input type="text" id="lastName" name="lastName" placeholder="Sobrenome" required />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Seu telefone <span className={styles.required}>(obrigatório)</span></label>
                <input type="tel" id="phone" name="phone" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="bestTime">Melhor hora para te ligar <span className={styles.required}>(obrigatório)</span></label>
                <select id="bestTime" name="bestTime" required>
                  <option value="" disabled selected>Selecione um horário</option>
                  <option value="manha">Manhã (09h-12h)</option>
                  <option value="tarde">Tarde (13h-17h)</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Seu endereço de email <span className={styles.required}>(obrigatório)</span></label>
                <input type="email" id="email" name="email" placeholder="Digite um e-mail" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="confirmEmail" className={styles.hiddenLabel}>Confirmar e-mail</label>
                <input type="email" id="confirmEmail" name="confirmEmail" placeholder="Confirmar e-mail" required />
              </div>
            </div>

            <div className={styles.formRow}>
               <div className={styles.formGroup}>
                <label htmlFor="contactMethod">Método preferido de contato</label>
                <select id="contactMethod" name="contactMethod" required>
                  <option value="" disabled selected>Selecione uma opção</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="ligacao">Ligação Telefônica</option>
                  <option value="email">E-mail</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="subject">Assunto <span className={styles.required}>(obrigatório)</span></label>
                <select id="subject" name="subject" required>
                  <option value="" disabled selected>Selecione uma opção</option>
                  <option value="duvida">Dúvida sobre um serviço</option>
                  <option value="pedido">Ajuda com um pedido</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Descreva o motivo da sua mensagem <span className={styles.required}>(obrigatório)</span></label>
              <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="privacy" name="privacy" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required/>
              <label htmlFor="privacy">
                Eu concordo com a <Link href="/politica-de-privacidade">Política de Privacidade</Link>. <span className={styles.required}>(obrigatório)</span>
              </label>
            </div>

            <button type="submit" className={styles.submitButton}>Enviar</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FormSection;