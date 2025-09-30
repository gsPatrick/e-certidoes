// Salve em: src/components/MultiStepForm/steps/StepCartorio.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import styles from './StepCartorio.module.css';
import SearchableDropdown from './SearchableDropdown';

export default function StepCartorio({ formData, handleChange, productData }) {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cartorios, setCartorios] = useState([]);
  const [loading, setLoading] = useState({ estados: false, cidades: false, cartorios: false });
  const [showManualCartorio, setShowManualCartorio] = useState(false);

  // Busca estados na montagem do componente
  useEffect(() => {
    setLoading(prev => ({ ...prev, estados: true }));
    api.get('/cartorios/estados').then(res => setEstados(res.data)).finally(() => setLoading(prev => ({ ...prev, estados: false })));
  }, []);

  // Busca cidades sempre que o estado no formulário muda
  useEffect(() => {
    if (!formData.estado) {
      setCidades([]);
      setCartorios([]);
      return;
    }
    setLoading(prev => ({ ...prev, cidades: true }));
    api.get(`/cartorios/estados/${formData.estado}/cidades`).then(res => setCidades(res.data)).finally(() => setLoading(prev => ({ ...prev, cidades: false })));
  }, [formData.estado]);

  // Busca cartórios sempre que a cidade ou estado mudam
  useEffect(() => {
    if (!formData.estado || !formData.cidade) {
      setCartorios([]);
      return;
    }
    const atribuicaoId = productData?.atribuicaoId;
    setLoading(prev => ({ ...prev, cartorios: true }));
    const params = new URLSearchParams({ estado: formData.estado, cidade: formData.cidade });
    if (atribuicaoId) params.append('atribuicaoId', atribuicaoId);
    api.get(`/cartorios?${params.toString()}`).then(res => setCartorios(res.data)).finally(() => setLoading(prev => ({ ...prev, cartorios: false })));
  }, [formData.cidade, formData.estado, productData?.atribuicaoId]);

  // Função adaptada para receber valores diretos do SearchableDropdown
  const handleDropdownChange = (name, value) => {
    // Verifica se o valor realmente mudou para evitar buscas desnecessárias
    if (formData[name] === value) return;
  
    handleChange({ target: { name, value } });

    // Se o estado mudou, limpa os campos dependentes
    if (name === 'estado') {
      handleChange({ target: { name: 'cidade', value: '' } });
      handleChange({ target: { name: 'cartorio', value: '' } });
    }
    // Se a cidade mudou, limpa o campo dependente
    if (name === 'cidade') {
      handleChange({ target: { name: 'cartorio', value: '' } });
    }
  };
  
  const toggleManualCartorio = () => {
    const isOpening = !showManualCartorio;
    setShowManualCartorio(isOpening);
    if (isOpening) {
        handleChange({ target: { name: 'cartorio', value: '' } });
    } else {
        handleChange({ target: { name: 'cartorio_manual', value: '' } });
    }
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>1. LOCALIZAÇÃO DO CARTÓRIO</h3>
      <p className={styles.stepDescription}>Informe o estado, cidade e cartório onde o documento foi registrado.</p>

      <div className={styles.formGroup}>
        <label htmlFor="estado">Estado *</label>
        <SearchableDropdown
          options={estados}
          value={formData.estado || ''}
          onChange={(value) => handleDropdownChange('estado', value)}
          placeholder="Digite ou selecione o estado"
          loading={loading.estados}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cidade">Cidade *</label>
        <SearchableDropdown
          options={cidades}
          value={formData.cidade || ''}
          onChange={(value) => handleDropdownChange('cidade', value)}
          placeholder="Digite ou selecione a cidade"
          disabled={!formData.estado}
          loading={loading.cidades}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cartorio">Cartório *</label>
        <select 
          id="cartorio" 
          name="cartorio" 
          className={styles.selectNative} /* Usando uma classe específica para o select */
          value={formData.cartorio || ''} 
          onChange={handleChange} 
          required={!showManualCartorio} 
          disabled={!formData.cidade || loading.cartorios || showManualCartorio}
        >
          <option value="">{loading.cartorios ? 'Buscando...' : 'Selecione o cartório'}</option>
          {cartorios.map(cart => <option key={cart.value} value={cart.label}>{cart.label}</option>)}
        </select>
      </div>
      
      <div className={styles.fallbackContainer}>
        <p className={styles.fallbackTitle}>Não localizou o cartório na lista ou não sabe informar?</p>
        <div className={styles.fallbackActions}>
          <Link href="/certidoes/pesquisa-de-imoveis" className={styles.fallbackButton}>
            Pesquise pelo CPF/CNPJ antes
          </Link>
          <button type="button" onClick={toggleManualCartorio} className={styles.fallbackButton}>
            {showManualCartorio ? 'Voltar para a lista' : 'Informe manualmente clicando aqui'}
          </button>
        </div>

        {showManualCartorio && (
          <div className={styles.manualInputWrapper}>
            <p className={styles.manualInputWarning}>
              Atenção: A responsabilidade pela informação é sua. Não haverá estorno caso o cartório informado esteja incorreto.
            </p>
            <div className={styles.formGroup}>
              <label htmlFor="cartorio_manual">Digite o nome e/ou endereço do cartório *</label>
              <input 
                type="text" 
                id="cartorio_manual" 
                name="cartorio_manual" 
                value={formData.cartorio_manual || ''}
                onChange={handleChange}
                required={showManualCartorio}
                placeholder="Ex: 1º Oficial de Registro de Imóveis de Anadia"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}