// Salve em: src/components/MultiStepForm/steps/StepEndereco.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './StepEndereco.module.css';

export default function StepEndereco({ formData, handleChange }) {
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [addressFound, setAddressFound] = useState(!!formData.endereco); // Inicia como true se o endereço já existe

  // Efeito para buscar o endereço quando o CEP tiver 8 dígitos
  useEffect(() => {
    const cep = formData.cep?.replace(/\D/g, ''); // Limpa o CEP

    if (cep?.length !== 8) {
      setAddressFound(false);
      setCepError('');
      return;
    }

    const fetchAddress = async () => {
      setCepLoading(true);
      setCepError('');
      try {
        const { data } = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`);
        
        // Dispara UMA única atualização de estado no pai com todos os dados
        handleChange({ target: { name: 'estado', value: data.state } });
        handleChange({ target: { name: 'cidade', value: data.city } });
        handleChange({ target: { name: 'bairro', value: data.neighborhood } });
        handleChange({ target: { name: 'endereco', value: data.street } });
        setAddressFound(true);

      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        setCepError('CEP não encontrado. Por favor, preencha o endereço manualmente.');
        // Limpa os campos para preenchimento manual
        handleChange({ target: { name: 'estado', value: '' } });
        handleChange({ target: { name: 'cidade', value: '' } });
        handleChange({ target: { name: 'bairro', value: '' } });
        handleChange({ target: { name: 'endereco', value: '' } });
        setAddressFound(true); // Permite o preenchimento manual mesmo com erro
      } finally {
        setCepLoading(false);
      }
    };
    
    const handler = setTimeout(() => {
        fetchAddress();
    }, 500); // Adiciona um pequeno delay para evitar requisições a cada tecla

    return () => clearTimeout(handler);

  }, [formData.cep, handleChange]);

  // Função para aplicar a máscara de CEP
  const handleCepChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
    value = value.replace(/^(\d{5})(\d)/, '$1-$2'); // Coloca hífen depois do 5º dígito
    handleChange({ target: { name: 'cep', value: value } });
  };


  return (
    <div>
      <h3 className={styles.stepTitle}>ENDEREÇO DE ENTREGA</h3>
      <p className={styles.stepDescription}>
        Preencha os dados referentes ao recebimento de seu documento.
      </p>

      <div className={styles.cepContainer}>
        <div className={`${styles.formGroup} ${styles.cepInputGroup}`}>
          <label htmlFor="cep">CEP</label>
          <input
            type="text"
            id="cep"
            name="cep"
            value={formData.cep || ''}
            onChange={handleCepChange} // Usa a função com máscara
            placeholder="00000-000"
            maxLength="9"
            required
          />
          {cepLoading && <small className={styles.cepStatus}>Buscando...</small>}
          {cepError && <small className={`${styles.cepStatus} ${styles.cepError}`}>{cepError}</small>}
        </div>
        <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" className={styles.cepLink}>
          não sei o cep
        </a>
      </div>

      {addressFound && (
        <div className={styles.addressFields}>
          <div className={styles.formGroup}>
            <label>Estado</label>
            <input type="text" name="estado" value={formData.estado || ''} onChange={handleChange} required disabled={!cepError} />
          </div>
          <div className={styles.formGroup}>
            <label>Cidade</label>
            <input type="text" name="cidade" value={formData.cidade || ''} onChange={handleChange} required disabled={!cepError} />
          </div>
          <div className={styles.formGroup}>
            <label>Bairro</label>
            <input type="text" name="bairro" value={formData.bairro || ''} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Endereço</label>
            <input type="text" name="endereco" value={formData.endereco || ''} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Número *</label>
            <input type="text" name="numero" value={formData.numero || ''} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label>Complemento (opcional)</label>
            <input type="text" name="complemento" value={formData.complemento || ''} onChange={handleChange} />
          </div>
        </div>
      )}
    </div>
  );
}