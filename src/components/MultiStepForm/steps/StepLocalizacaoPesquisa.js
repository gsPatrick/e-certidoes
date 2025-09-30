// Salve em: src/components/MultiStepForm/steps/StepLocalizacaoPesquisa.js
'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import styles from './StepLocalizacaoPesquisa.module.css';

export default function StepLocalizacaoPesquisa({ formData, handleChange }) {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cartorios, setCartorios] = useState([]);
  const [loading, setLoading] = useState({ estados: false, cidades: false });

  // Busca estados na montagem
  useEffect(() => {
    setLoading(prev => ({ ...prev, estados: true }));
    api.get('/cartorios/estados')
      .then(res => setEstados(res.data))
      .finally(() => setLoading(prev => ({ ...prev, estados: false })));
  }, []);

  // Busca cidades quando o estado muda
  useEffect(() => {
    if (!formData.estado) {
      setCidades([]);
      return;
    }
    setLoading(prev => ({ ...prev, cidades: true }));
    api.get(`/cartorios/estados/${formData.estado}/cidades`)
      .then(res => setCidades(res.data))
      .finally(() => setLoading(prev => ({ ...prev, cidades: false })));
  }, [formData.estado]);
  
  const handleSelectChange = (e) => {
    handleChange(e);
    if (e.target.name === 'estado') {
      handleChange({ target: { name: 'cidade', value: '' } });
      handleChange({ target: { name: 'cartorio', value: '' } });
      handleChange({ target: { name: 'todos_cartorios', value: false, type: 'checkbox', checked: false } });
    }
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>1. LOCALIZAÇÃO DA PESQUISA DE IMÓVEIS</h3>
      
      <div className={styles.formGroup}>
        <label htmlFor="estado">Estado da pesquisa</label>
        <select id="estado" name="estado" value={formData.estado || ''} onChange={handleSelectChange} required disabled={loading.estados}>
          <option value="">{loading.estados ? 'Carregando...' : 'Selecione o estado'}</option>
          {estados.map(est => <option key={est} value={est}>{est}</option>)}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cidade">Cidade da pesquisa</label>
        <select id="cidade" name="cidade" value={formData.cidade || ''} onChange={handleChange} required disabled={!formData.estado || loading.cidades}>
          <option value="">{loading.cidades ? 'Carregando...' : 'Selecione a cidade'}</option>
          {cidades.map(cid => <option key={cid} value={cid}>{cid}</option>)}
        </select>
      </div>

      <h4 className={styles.subSectionTitle}>Dados do cartório</h4>
      <p className={styles.subSectionDescription}>Escolha um ou mais cartórios nos quais deseja fazer a pesquisa.</p>

      {formData.cidade && (
        <label className={styles.checkboxAllLabel}>
          <input
            type="checkbox"
            name="todos_cartorios"
            checked={!!formData.todos_cartorios}
            onChange={handleChange}
            className={styles.checkboxAllInput}
          />
          Todos os cartórios de {formData.cidade}
        </label>
      )}

      {/* A lógica para selecionar cartórios individuais foi removida para simplificar,
          conforme o design que prioriza "Todos os cartórios".
          Se for necessário, um dropdown pode ser adicionado aqui, sendo desabilitado
          quando "todos_cartorios" for true. */}
    </div>
  );
}