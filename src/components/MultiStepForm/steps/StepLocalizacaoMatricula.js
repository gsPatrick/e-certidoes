// Salve em: src/components/MultiStepForm/steps/StepLocalizacaoMatricula.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import styles from './StepCartorio.module.css'; // Reutilizando o CSS

export default function StepLocalizacaoMatricula({ formData, handleChange, productData }) {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cartorios, setCartorios] = useState([]);
  const [loading, setLoading] = useState({ estados: false, cidades: false, cartorios: false });

  // Busca estados
  useEffect(() => {
    setLoading(prev => ({ ...prev, estados: true }));
    api.get('/cartorios/estados').then(res => setEstados(res.data)).finally(() => setLoading(prev => ({ ...prev, estados: false })));
  }, []);

  // Busca cidades
  useEffect(() => {
    if (!formData.estado) {
      setCidades([]);
      setCartorios([]);
      return;
    }
    setLoading(prev => ({ ...prev, cidades: true }));
    api.get(`/cartorios/estados/${formData.estado}/cidades`).then(res => setCidades(res.data)).finally(() => setLoading(prev => ({ ...prev, cidades: false })));
  }, [formData.estado]);

  // Busca cartórios
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

  const handleSelectChange = (e) => {
    handleChange(e);
    if (e.target.name === 'estado') {
      handleChange({ target: { name: 'cidade', value: '' } });
      handleChange({ target: { name: 'cartorio', value: '' } });
    }
    if (e.target.name === 'cidade') {
      handleChange({ target: { name: 'cartorio', value: '' } });
    }
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>1. DADOS PARA LOCALIZAÇÃO</h3>
      <p className={styles.stepDescription}>
        Informe a localização do cartório e o número da matrícula do imóvel.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="estado">Estado *</label>
        <select id="estado" name="estado" value={formData.estado || ''} onChange={handleSelectChange} required disabled={loading.estados}>
          <option value="">{loading.estados ? 'Carregando...' : 'Selecione o estado'}</option>
          {estados.map(est => <option key={est} value={est}>{est}</option>)}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cidade">Cidade *</label>
        <select id="cidade" name="cidade" value={formData.cidade || ''} onChange={handleSelectChange} required disabled={!formData.estado || loading.cidades}>
          <option value="">{loading.cidades ? 'Carregando...' : 'Selecione a cidade'}</option>
          {cidades.map(cid => <option key={cid} value={cid}>{cid}</option>)}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cartorio">Cartório de Registro de Imóveis *</label>
        <select id="cartorio" name="cartorio" value={formData.cartorio || ''} onChange={handleChange} required disabled={!formData.cidade || loading.cartorios}>
          <option value="">{loading.cartorios ? 'Buscando...' : 'Selecione o cartório'}</option>
          {cartorios.map(cart => <option key={cart.value} value={cart.label}>{cart.label}</option>)}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="numero_matricula">Número da Matrícula *</label>
        <input
            type="text"
            id="numero_matricula"
            name="numero_matricula"
            value={formData.numero_matricula || ''}
            onChange={handleChange}
            placeholder="Digite o número da matrícula"
            required
        />
      </div>

      <div className={styles.fallbackContainer}>
        <p className={styles.fallbackTitle}>Não localizou o cartório na lista ou não sabe informar?</p>
        <div className={styles.fallbackActions}>
          <Link href="/certidoes/pesquisa-previa" className={styles.fallbackButton}>
            Pesquise pelo CPF/CNPJ antes
          </Link>
        </div>
      </div>
    </div>
  );
}