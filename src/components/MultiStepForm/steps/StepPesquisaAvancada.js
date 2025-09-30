// Salve em: src/components/MultiStepForm/steps/StepPesquisaAvancada.js
'use client';

import { useState, useEffect } from 'react';
import styles from './StepPesquisaAvancada.module.css';
import SearchableDropdown from './SearchableDropdown';
import api from '@/services/api';

export default function StepPesquisaAvancada({ formData, handleChange, productData }) {
  // A lógica de diferenciação agora é baseada na flag 'pesquisaType' vinda do productData
  const isQualificada = productData.pesquisaType === 'qualificada';
  
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cartorios, setCartorios] = useState([]);
  const [loading, setLoading] = useState({ estados: false, cidades: false, cartorios: false });

  // Busca estados na montagem
  useEffect(() => {
    setLoading(p => ({ ...p, estados: true }));
    api.get('/cartorios/estados')
      .then(res => setEstados(res.data))
      .finally(() => setLoading(p => ({ ...p, estados: false })));
  }, []);

  // Busca cidades (apenas se for Pesquisa Qualificada)
  useEffect(() => {
    if (!formData.estado_pesquisa || !isQualificada) {
      setCidades([]);
      return;
    }
    setLoading(p => ({ ...p, cidades: true }));
    api.get(`/cartorios/estados/${formData.estado_pesquisa}/cidades`)
      .then(res => setCidades(res.data))
      .finally(() => setLoading(p => ({ ...p, cidades: false })));
  }, [formData.estado_pesquisa, isQualificada]);

  // Busca cartórios (apenas se for Pesquisa Qualificada)
  useEffect(() => {
    if (!formData.cidade_pesquisa || !isQualificada) {
      setCartorios([]);
      return;
    }
    setLoading(p => ({ ...p, cartorios: true }));
    api.get(`/cartorios?estado=${formData.estado_pesquisa}&cidade=${formData.cidade_pesquisa}&atribuicaoId=4`)
      .then(res => setCartorios(res.data))
      .finally(() => setLoading(p => ({ ...p, cartorios: false })));
  }, [formData.cidade_pesquisa, formData.estado_pesquisa, isQualificada]);

  const handleDropdownChange = (name, value) => {
    handleChange({ target: { name, value } });
  };

  const finalidades = [
    "Investigação jurídico-econômica sobre crédito, solvência ou responsabilidade civil.",
    "Investigação jurídica sobre o imóvel, sua titularidade ou limitações ao direito de propriedade.",
    "Investigação para contratação ou interposição de ações judiciais.",
    "O solicitante da pesquisa é titular de algum direito real registrado sobre o imóvel."
  ];

  return (
    <div>
      <h3 className={styles.stepTitle}>{productData.name}</h3>
      <p style={{marginTop: '-1.5rem', marginBottom: '2rem', color: '#6c757d'}}>Preencha os campos para realizar a pesquisa.</p>
      
      <div className={styles.formGroup}>
        <label>Indique o número do CPF/CNPJ a ser pesquisado *</label>
        <div className={styles.cpfGroup}>
          <div className={styles.formGroup}>
            <input type="text" name="cpf_cnpj_pesquisa" value={formData.cpf_cnpj_pesquisa || ''} onChange={handleChange} placeholder="Digite apenas números" required />
          </div>
          {/* O botão "Carregar Nome" pode ser implementado no futuro se houver uma API para isso */}
          {/* <button type="button" className={styles.loadButton}>Carregar Nome</button> */}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Estado *</label>
        <SearchableDropdown options={estados} value={formData.estado_pesquisa || ''} onChange={(v) => handleDropdownChange('estado_pesquisa', v)} placeholder="Selecione o estado" loading={loading.estados} />
      </div>

      {isQualificada && (
        <>
          <div className={styles.formGroup}>
            <label>Cidade(s) *</label>
            <SearchableDropdown options={cidades} value={formData.cidade_pesquisa || ''} onChange={(v) => handleDropdownChange('cidade_pesquisa', v)} placeholder="Selecione a cidade" disabled={!formData.estado_pesquisa} loading={loading.cidades} />
          </div>
          <div className={styles.formGroup}>
            <label>Cartório(s) *</label>
            <select name="cartorio_pesquisa" value={formData.cartorio_pesquisa || ''} onChange={handleChange} disabled={!formData.cidade_pesquisa || loading.cartorios} required>
              <option value="">{loading.cartorios ? 'Carregando...' : 'Selecione o cartório'}</option>
              {cartorios.map(c => <option key={c.value} value={c.label}>{c.label}</option>)}
            </select>
          </div>
        </>
      )}

      <div className={styles.formGroup}>
        <label>Informe a finalidade da pesquisa *</label>
        <select name="finalidade_pesquisa" value={formData.finalidade_pesquisa || ''} onChange={handleChange} required>
          <option value="">Selecione o tipo de finalidade da pesquisa</option>
          {finalidades.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <p className={styles.advertencia}>
        <strong>ADVERTÊNCIA:</strong> O titular dos dados pesquisados poderá solicitar ao ONR informações relativas à identificação do solicitante e indicação da finalidade (Provimento CNJ n. 134/2022, art. 50, Parágrafo único).
      </p>

      {/* O campo de reCAPTCHA pode ser adicionado aqui no futuro */}

      <div className={styles.finalConfirm}>
        <input type="checkbox" id="ciente" name="ciente" checked={!!formData.ciente} onChange={handleChange} required />
        <label htmlFor="ciente">Li, e estou ciente.</label>
      </div>
    </div>
  );
}