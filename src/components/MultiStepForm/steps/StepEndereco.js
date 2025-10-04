// Salve em: src/components/MultiStepForm/steps/StepEndereco.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './StepEndereco.module.css';

export default function StepEndereco({ formData, handleChange }) {
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [addressFound, setAddressFound] = useState(!!formData.endereco);

  // Determina se a entrega selecionada é internacional
  const isInternational = formData.entrega_internacional_correios || formData.entrega_internacional_dhl;

  // Garante que os checkboxes de entrega internacional sejam mutuamente exclusivos
  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    handleChange(e); // Propaga a mudança do checkbox que foi clicado

    // Se uma opção internacional foi marcada, desmarca a outra
    if (checked) {
      if (name === 'entrega_internacional_correios') {
        handleChange({ target: { name: 'entrega_internacional_dhl', checked: false, type: 'checkbox' } });
      }
      if (name === 'entrega_internacional_dhl') {
        handleChange({ target: { name: 'entrega_internacional_correios', checked: false, type: 'checkbox' } });
      }
    }
  }, [handleChange]);

  // Efeito para buscar o endereço via CEP (só roda se não for internacional)
  useEffect(() => {
    if (isInternational) return; // Aborta se a entrega for internacional
    
    const cep = formData.cep?.replace(/\D/g, ''); // Limpa o CEP

    if (cep?.length !== 8) {
      setAddressFound(!!formData.endereco); // Mantém campos visíveis se já foram preenchidos
      setCepError('');
      return;
    }

    const fetchAddress = async () => {
      setCepLoading(true);
      setCepError('');
      try {
        const { data } = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`);
        handleChange({ target: { name: 'estado', value: data.state } });
        handleChange({ target: { name: 'cidade', value: data.city } });
        handleChange({ target: { name: 'bairro', value: data.neighborhood } });
        handleChange({ target: { name: 'endereco', value: data.street } });
        setAddressFound(true);
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        setCepError('CEP não encontrado. Por favor, preencha o endereço manualmente.');
        setAddressFound(true);
      } finally {
        setCepLoading(false);
      }
    };
    
    const handler = setTimeout(() => {
        fetchAddress();
    }, 500);

    return () => clearTimeout(handler);
  }, [formData.cep, isInternational, handleChange]);

  // Função para aplicar a máscara de CEP
  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2');
    handleChange({ target: { name: 'cep', value: value } });
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>ENDEREÇO DE ENTREGA</h3>
      <p className={styles.stepDescription}>
        Preencha os dados referentes ao recebimento de seu documento.
      </p>

      {/* --- INÍCIO DA ALTERAÇÃO --- */}
      {/* Agora o bloco de formulários (Brasil ou Internacional) vem ANTES das opções de checkbox */}
      
      {isInternational ? (
        // --- FORMULÁRIO INTERNACIONAL ---
        <div className={styles.internationalForm}>
          <div className={styles.formGroup}>
            <label>País/Country *</label>
            <select name="pais" value={formData.pais || ''} onChange={handleChange} required>
              <option value="">Select Country</option>
              <option value="USA">United States</option>
              <option value="Portugal">Portugal</option>
              <option value="Spain">Spain</option>
              {/* Adicionar mais países conforme necessário */}
            </select>
          </div>
          <div className={styles.formGroup}><label>Estado/State *</label><input type="text" name="estado_inter" value={formData.estado_inter || ''} onChange={handleChange} placeholder="Digite o Estado" required /></div>
          <div className={styles.formGroup}><label>Cidade/City *</label><input type="text" name="cidade_inter" value={formData.cidade_inter || ''} onChange={handleChange} placeholder="Digite a cidade" required /></div>
          <div className={styles.formGroup}><label>CEP/Postal Code *</label><input type="text" name="cep_inter" value={formData.cep_inter || ''} onChange={handleChange} placeholder="Digite o CEP" required /></div>
          <div className={styles.formGroup}><label>Endereço/Address *</label><input type="text" name="endereco_inter" value={formData.endereco_inter || ''} onChange={handleChange} placeholder="Digite o endereço" required /></div>
          <button type="button" className={styles.calculateButton} onClick={() => alert('Lógica de cálculo de frete a ser implementada!')}>
            Calcular Frete
          </button>
        </div>
      ) : (
        // --- FORMULÁRIO DO BRASIL (CEP) ---
        <div className={styles.brazilForm}>
            <div className={styles.cepContainer}>
                <div className={`${styles.formGroup} ${styles.cepInputGroup}`}>
                    <label htmlFor="cep">CEP *</label>
                    <input type="text" id="cep" name="cep" value={formData.cep || ''} onChange={handleCepChange} placeholder="00000-000" maxLength="9" required />
                    {cepLoading && <small className={styles.cepStatus}>Buscando...</small>}
                    {cepError && <small className={`${styles.cepStatus} ${styles.cepError}`}>{cepError}</small>}
                </div>
                <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" className={styles.cepLink}>não sei o cep</a>
            </div>
            {(addressFound || cepError) && ( 
              <div className={styles.addressFields}>
                <div className={styles.formGroup}><label>Estado *</label><input type="text" name="estado" value={formData.estado || ''} onChange={handleChange} required disabled={!cepError} /></div>
                <div className={styles.formGroup}><label>Cidade *</label><input type="text" name="cidade" value={formData.cidade || ''} onChange={handleChange} required disabled={!cepError} /></div>
                <div className={styles.formGroup}><label>Bairro *</label><input type="text" name="bairro" value={formData.bairro || ''} onChange={handleChange} required /></div>
                <div className={styles.formGroup}><label>Endereço *</label><input type="text" name="endereco" value={formData.endereco || ''} onChange={handleChange} required /></div>
                <div className={styles.formGroup}><label>Número *</label><input type="text" name="numero" value={formData.numero || ''} onChange={handleChange} required /></div>
                <div className={styles.formGroup}><label>Complemento (opcional)</label><input type="text" name="complemento" value={formData.complemento || ''} onChange={handleChange} /></div>
              </div> 
            )}
        </div>
      )}

      {/* As opções de entrega internacional agora ficam abaixo do bloco de formulário */}
      <div className={styles.deliveryOptions}>
        <label className={styles.checkboxLabel}>
            <input 
                type="checkbox" 
                name="entrega_internacional_correios"
                checked={!!formData.entrega_internacional_correios}
                onChange={handleCheckboxChange}
                className={styles.checkboxInput}
            /> 
            Entrega Internacional - Correios
        </label>
        <label className={styles.checkboxLabel}>
            <input 
                type="checkbox" 
                name="entrega_internacional_dhl"
                checked={!!formData.entrega_internacional_dhl}
                onChange={handleCheckboxChange}
                className={styles.checkboxInput}
            /> 
            Entrega Urgente Internacional - DHL
        </label>
      </div>

      {/* --- FIM DA ALTERAÇÃO --- */}
    </div>
  );
}