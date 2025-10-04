// Salve em: src/components/MultiStepForm/steps/StepCartorio.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import styles from './StepCartorio.module.css';
import SearchableDropdown from './SearchableDropdown';

// --- ALTERAÇÃO INICIADA: Ícones adicionados ---
const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
// --- ALTERAÇÃO FINALIZADA ---

export default function StepCartorio({ formData, handleChange, productData }) {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cartorios, setCartorios] = useState([]);
  const [loading, setLoading] = useState({ estados: false, cidades: false, cartorios: false });
  const [showManualCartorio, setShowManualCartorio] = useState(false);
  
  // --- ALTERAÇÃO INICIADA: Lógica de upload de arquivo ---
  const [selectedFile, setSelectedFile] = useState(null);
  const isRegistroCivil = productData?.category === 'Cartório de Registro Civil';
  // --- ALTERAÇÃO FINALIZADA ---

  useEffect(() => {
    setLoading(prev => ({ ...prev, estados: true }));
    api.get('/cartorios/estados').then(res => setEstados(res.data)).finally(() => setLoading(prev => ({ ...prev, estados: false })));
  }, []);

  useEffect(() => {
    if (!formData.estado) {
      setCidades([]);
      setCartorios([]);
      return;
    }
    setLoading(prev => ({ ...prev, cidades: true }));
    api.get(`/cartorios/estados/${formData.estado}/cidades`).then(res => setCidades(res.data)).finally(() => setLoading(prev => ({ ...prev, cidades: false })));
  }, [formData.estado]);

  useEffect(() => {
    if (!formData.estado || !formData.cidade) {
      setCartorios([]);
      return;
    }
    // --- ALTERAÇÃO INICIADA: Lógica para pegar ID da atribuição foi refinada ---
    const atribuicaoId = productData?.atribuicaoId;
    // --- ALTERAÇÃO FINALIZADA ---
    setLoading(prev => ({ ...prev, cartorios: true }));
    const params = new URLSearchParams({ estado: formData.estado, cidade: formData.cidade });
    if (atribuicaoId) params.append('atribuicaoId', atribuicaoId);
    api.get(`/cartorios?${params.toString()}`).then(res => setCartorios(res.data)).finally(() => setLoading(prev => ({ ...prev, cartorios: false })));
  }, [formData.cidade, formData.estado, productData?.atribuicaoId]);

  const handleDropdownChange = (name, value) => {
    if (formData[name] === value) return;
    handleChange({ target: { name, value } });
    if (name === 'estado') {
      handleChange({ target: { name: 'cidade', value: '' } });
      handleChange({ target: { name: 'cartorio', value: '' } });
    }
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

  // --- ALTERAÇÃO INICIADA: Novas funções para "Não sei o cartório" ---
  const handleNaoSeiCartorioChange = (e) => {
    const { checked } = e.target;
    handleChange(e);
    if (checked) {
      handleChange({ target: { name: 'cartorio', value: '' } });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("O arquivo excede o tamanho máximo de 2MB.");
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      handleChange({ target: { name: 'anexo_busca_nome', value: file.name } });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    handleChange({ target: { name: 'anexo_busca_nome', value: '' } });
    document.getElementById('file-upload').value = '';
  };
  
  const certidaoTipo = productData.name.split(' de ')[1]?.toLowerCase() || 'documento';
  // --- ALTERAÇÃO FINALIZADA ---

  return (
    <div>
      <h3 className={styles.stepTitle}>1. Localização do Cartório</h3>
      
      {/* --- ALTERAÇÃO INICIADA: Box de informação condicional --- */}
      {isRegistroCivil && (
        <div className={styles.infoBox}>
          <span className={styles.lightbulb}>💡</span>
          <span>A certidão de {certidaoTipo} geralmente informa em qual cartório o ato foi registrado, incluindo o endereço da serventia.</span>
        </div>
      )}
      {/* --- ALTERAÇÃO FINALIZADA --- */}

      <div className={styles.formGroup}>
        <label htmlFor="estado">Estado do Cartório *</label>
        <SearchableDropdown options={estados} value={formData.estado || ''} onChange={(value) => handleDropdownChange('estado', value)} placeholder="Digite ou selecione o estado" loading={loading.estados} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cidade">Cidade do Cartório *</label>
        <SearchableDropdown options={cidades} value={formData.cidade || ''} onChange={(value) => handleDropdownChange('cidade', value)} placeholder="Digite ou selecione a cidade" disabled={!formData.estado} loading={loading.cidades} />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cartorio">Cartório *</label>
        <SearchableDropdown 
          options={cartorios.map(c => c.label)}
          value={formData.cartorio || ''}
          onChange={(value) => handleDropdownChange('cartorio', value)}
          placeholder={loading.cartorios ? 'Buscando...' : 'Selecione o Cartório'}
          disabled={!formData.cidade || loading.cartorios || showManualCartorio || formData.nao_sei_cartorio}
        />
      </div>
      
      {/* --- ALTERAÇÃO INICIADA: Lógica para "Não sei o cartório" e fallback --- */}
      {isRegistroCivil ? (
        <div className={styles.naoSeiCartorioWrapper}>
            <label className={styles.naoSeiCartorioCheck}>
                <input type="checkbox" name="nao_sei_cartorio" checked={!!formData.nao_sei_cartorio} onChange={handleNaoSeiCartorioChange} />
                <span>Não sei o cartório</span>
            </label>

            {formData.nao_sei_cartorio && (
                <div className={styles.buscaWrapper}>
                    <h4 className={styles.buscaTitle}>SERVIÇO DE BUSCA</h4>
                    <p className={styles.buscaDescription}>Para facilitar a localização de registros com dados incompletos, o anexo de documentos auxilia em nossa busca.</p>
                    <p className={styles.buscaExemplos}>Anexe uma foto de um documento oficial:</p>
                    <ul className={styles.buscaList}>
                        <li>✓ Certidão de casamento</li>
                        <li>✓ Verso do RG</li>
                        <li>✓ Certidão de óbito</li>
                        <li>✓ Carteira de trabalho</li>
                    </ul>

                    {selectedFile ? (
                      <div className={styles.fileDisplay}><span className={styles.fileName}>{selectedFile.name}</span><button type="button" onClick={handleRemoveFile} className={styles.fileRemoveButton}><CloseIcon /></button></div>
                    ) : (
                      <label htmlFor="file-upload" className={styles.uploadLabel}><UploadIcon />Selecione uma foto</label>
                    )}
                    
                    <input id="file-upload" name="anexo_busca" type="file" className={styles.fileInput} onChange={handleFileChange} accept="image/png, image/jpeg, .pdf" />
                    <small className={styles.uploadHint}>Tamanho máximo: 2MB. <a href="#">Saiba como enviar uma foto</a>.</small>
                </div>
            )}
        </div>
      ) : (
        <div className={styles.fallbackContainer}>
            <p className={styles.fallbackTitle}>Não localizou o cartório na lista ou não sabe informar?</p>
            <div className={styles.fallbackActions}>
            <Link href="/certidoes/pesquisa-previa" className={styles.fallbackButton}>Pesquise pelo CPF/CNPJ antes</Link>
            <button type="button" onClick={toggleManualCartorio} className={styles.fallbackButton}>{showManualCartorio ? 'Voltar para a lista' : 'Informe manualmente clicando aqui'}</button>
            </div>

            {showManualCartorio && (
            <div className={styles.manualInputWrapper}>
                <p className={styles.manualInputWarning}>Atenção: A responsabilidade pela informação é sua. Não haverá estorno caso o cartório informado esteja incorreto.</p>
                <div className={styles.formGroup}>
                <label htmlFor="cartorio_manual">Digite o nome e/ou endereço do cartório *</label>
                <input type="text" id="cartorio_manual" name="cartorio_manual" value={formData.cartorio_manual || ''} onChange={handleChange} required={showManualCartorio} placeholder="Ex: 1º Oficial de Registro de Imóveis de Anadia" />
                </div>
            </div>
            )}
        </div>
      )}
      {/* --- ALTERAÇÃO FINALIZADA --- */}
    </div>
  );
}