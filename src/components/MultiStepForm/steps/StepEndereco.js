// Salve em: src/components/MultiStepForm/steps/StepEndereco.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './StepEndereco.module.css';
import { countries } from '@/utils/countries';
import SearchableDropdown from './SearchableDropdown'; // Importa o componente de busca

export default function StepEndereco({ formData, handleChange }) {
  // Estados para busca de CEP nacional (BrasilAPI)
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [addressFound, setAddressFound] = useState(!!formData.endereco);

  // Estados para busca de CEP internacional (Zippopotam.us)
  const [intlCepLoading, setIntlCepLoading] = useState(false);
  const [intlAddressFound, setIntlAddressFound] = useState(!!formData.cidade_inter);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const isInternational = formData.entrega_internacional_correios || formData.entrega_internacional_dhl;

  const handleCountryChange = (countryName) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    handleChange({ target: { name: 'pais_nome', value: countryName } });
    handleChange({ target: { name: 'pais', value: selectedCountry ? selectedCountry.code : '' } });
  };
  
  const handleCheckboxChange = useCallback((e) => {
    const { name, checked } = e.target;
    handleChange(e);
    if (checked) {
      if (name === 'entrega_internacional_correios') {
        handleChange({ target: { name: 'entrega_internacional_dhl', checked: false, type: 'checkbox' } });
      }
      if (name === 'entrega_internacional_dhl') {
        handleChange({ target: { name: 'entrega_internacional_correios', checked: false, type: 'checkbox' } });
      }
    }
  }, [handleChange]);

  // Efeito para buscar endereço no Brasil
  useEffect(() => {
    if (isInternational) return;
    const cep = formData.cep?.replace(/\D/g, '');
    if (cep?.length !== 8) { setCepError(''); return; }
    const fetchAddress = async () => {
      setCepLoading(true); setCepError('');
      try {
        const { data } = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`);
        handleChange({ target: { name: 'estado_entrega', value: data.state } }); // NOVO NOME
        handleChange({ target: { name: 'cidade_entrega', value: data.city } }); // NOVO NOME
        handleChange({ target: { name: 'bairro', value: data.neighborhood } });
        handleChange({ target: { name: 'endereco', value: data.street } });
        setAddressFound(true);
      } catch (error) {
        setCepError('CEP não encontrado. Preencha o endereço manualmente.');
        setAddressFound(true);
      } finally { setCepLoading(false); }
    };
    const handler = setTimeout(fetchAddress, 500);
    return () => clearTimeout(handler);
  }, [formData.cep, isInternational, handleChange]);

  // Efeito para buscar endereço internacional com nova lógica de erro
  useEffect(() => {
    if (!isInternational || !formData.pais || !formData.cep_inter?.trim()) return;
    const { pais: countryCode, cep_inter: postalCode } = formData;

    const fetchIntlAddress = async () => {
      setIntlCepLoading(true);
      try {
        const { data } = await axios.get(`https://api.zippopotam.us/${countryCode}/${postalCode.trim()}`);
        const place = data.places[0];
        handleChange({ target: { name: 'cidade_inter', value: place['place name'] } });
        handleChange({ target: { name: 'estado_inter', value: place['state'] || place['state abbreviation'] } });
        setIntlAddressFound(true);
      } catch (error) {
        console.error("Erro ao buscar CEP internacional:", error);
        setIntlAddressFound(false);
        setIsErrorModalOpen(true);
      } finally {
        setIntlCepLoading(false);
      }
    };
    const handler = setTimeout(fetchIntlAddress, 800);
    return () => clearTimeout(handler);
  }, [formData.pais, formData.cep_inter, isInternational, handleChange]);

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2');
    handleChange({ target: { name: 'cep', value } });
  };

  const isIntlFieldDisabled = intlAddressFound && !isErrorModalOpen;

  return (
    <div>
      <h3 className={styles.stepTitle}>ENDEREÇO DE ENTREGA</h3>
      <p className={styles.stepDescription}>Preencha os dados para recebimento do seu documento.</p>
      
      {isInternational ? (
        <div className={`${styles.internationalForm} ${styles.formAnimation}`}>
          <div className={styles.formGroup}>
            <label>País/Country *</label>
            <SearchableDropdown
              options={countries.map(c => c.name)}
              value={formData.pais_nome || ''}
              onChange={handleCountryChange}
              placeholder="Digite para buscar o país"
            />
          </div>
          <div className={styles.formGroup}>
            <label>CEP/Postal Code *</label>
            <input type="text" name="cep_inter" value={formData.cep_inter || ''} onChange={handleChange} placeholder="Digite o CEP/Código Postal" required />
            {intlCepLoading && <small className={styles.cepStatus}>Buscando...</small>}
          </div>
          <div className={styles.formGroup}>
            <label>Estado/State *</label>
            <input type="text" name="estado_inter" value={formData.estado_inter || ''} onChange={handleChange} placeholder={isIntlFieldDisabled ? '' : "Digite o Estado"} required disabled={isIntlFieldDisabled} />
          </div>
          <div className={styles.formGroup}>
            <label>Cidade/City *</label>
            <input type="text" name="cidade_inter" value={formData.cidade_inter || ''} onChange={handleChange} placeholder={isIntlFieldDisabled ? '' : "Digite a Cidade"} required disabled={isIntlFieldDisabled} />
          </div>
          <div className={styles.formGroup}>
            <label>Endereço/Address *</label>
            <input type="text" name="endereco_inter" value={formData.endereco_inter || ''} onChange={handleChange} placeholder="Rua, Avenida, etc." required />
          </div>
        </div>
      ) : (
        <div className={`${styles.brazilForm} ${styles.formAnimation}`}>
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
                <div className={styles.formGroup}><label>Estado *</label><input type="text" name="estado_entrega" value={formData.estado_entrega || ''} onChange={handleChange} required disabled={!cepError} /></div> {/* NOVO NOME */}
                <div className={styles.formGroup}><label>Cidade *</label><input type="text" name="cidade_entrega" value={formData.cidade_entrega || ''} onChange={handleChange} required disabled={!cepError} /></div> {/* NOVO NOME */}
                <div className={styles.formGroup}><label>Bairro *</label><input type="text" name="bairro" value={formData.bairro || ''} onChange={handleChange} required /></div>
                <div className={styles.formGroup}><label>Endereço *</label><input type="text" name="endereco" value={formData.endereco || ''} onChange={handleChange} required /></div>
                <div className={styles.formGroup}><label>Número *</label><input type="text" name="numero" value={formData.numero || ''} onChange={handleChange} required /></div>
                <div className={styles.formGroup}><label>Complemento (opcional)</label><input type="text" name="complemento" value={formData.complemento || ''} onChange={handleChange} /></div>
              </div> 
            )}
        </div>
      )}

      <div className={styles.deliveryOptions}>
        <label className={styles.checkboxLabel}><input type="checkbox" name="entrega_internacional_correios" checked={!!formData.entrega_internacional_correios} onChange={handleCheckboxChange} /> Entrega Internacional - Correios</label>
        <label className={styles.checkboxLabel}><input type="checkbox" name="entrega_internacional_dhl" checked={!!formData.entrega_internacional_dhl} onChange={handleCheckboxChange} /> Entrega Urgente Internacional - DHL</label>
      </div>

      {isErrorModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>Localização não encontrada</h4>
            <p>Não foi possível encontrar uma cidade/estado para o código postal informado. Por favor, verifique se o código está correto ou preencha os campos de localização manualmente.</p>
            <button type="button" onClick={() => setIsErrorModalOpen(false)} className={styles.modalButton}>
              Entendi, vou preencher manualmente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}