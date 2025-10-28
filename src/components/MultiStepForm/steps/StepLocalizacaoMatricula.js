// Salve em: src/components/MultiStepForm/steps/StepLocalizacaoMatricula.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import styles from './StepLocalizacaoMatricula.module.css';

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
    if (!formData.estado_matricula) { // NOVO NOME
      setCidades([]);
      setCartorios([]);
      return;
    }
    setLoading(prev => ({ ...prev, cidades: true }));
    api.get(`/cartorios/estados/${formData.estado_matricula}/cidades`).then(res => setCidades(res.data)).finally(() => setLoading(prev => ({ ...prev, cidades: false }))); // NOVO NOME
  }, [formData.estado_matricula]); // NOVO NOME

  // Busca cartórios
  useEffect(() => {
    if (!formData.estado_matricula || !formData.cidade_matricula) { // NOVOS NOMES
      setCartorios([]);
      return;
    }
    const atribuicaoId = productData?.atribuicaoId;
    setLoading(prev => ({ ...prev, cartorios: true }));
    const params = new URLSearchParams({ estado: formData.estado_matricula, cidade: formData.cidade_matricula }); // NOVOS NOMES
    if (atribuicaoId) params.append('atribuicaoId', atribuicaoId);
    api.get(`/cartorios?${params.toString()}`).then(res => setCartorios(res.data)).finally(() => setLoading(prev => ({ ...prev, cartorios: false })));
  }, [formData.cidade_matricula, formData.estado_matricula, productData?.atribuicaoId]); // NOVOS NOMES

  const handleSelectChange = (e) => {
    handleChange(e);
    if (e.target.name === 'estado_matricula') { // NOVO NOME
      handleChange({ target: { name: 'cidade_matricula', value: '' } }); // NOVO NOME
      handleChange({ target: { name: 'cartorio', value: '' } });
    }
    if (e.target.name === 'cidade_matricula') { // NOVO NOME
      handleChange({ target: { name: 'cartorio', value: '' } });
    }
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>1. Dados para Localização</h3>
      <p className={styles.stepDescription}>
        Informe a localização do cartório e o número da matrícula do imóvel.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="estado_matricula">Estado *</label> {/* NOVO NOME */}
        <select id="estado_matricula" name="estado_matricula" value={formData.estado_matricula || ''} onChange={handleSelectChange} required disabled={loading.estados}> {/* NOVO NOME */}
          <option value="">{loading.estados ? 'Carregando...' : 'Selecione o estado'}</option>
          {estados.map(est => <option key={est} value={est}>{est}</option>)}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cidade_matricula">Cidade *</label> {/* NOVO NOME */}
        <select id="cidade_matricula" name="cidade_matricula" value={formData.cidade_matricula || ''} onChange={handleSelectChange} required disabled={!formData.estado_matricula || loading.cidades}> {/* NOVO NOME */}
          <option value="">{loading.cidades ? 'Carregando...' : 'Selecione a cidade'}</option>
          {cidades.map(cid => <option key={cid} value={cid}>{cid}</option>)}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cartorio">Cartório de Registro de Imóveis *</label>
        <select id="cartorio" name="cartorio" value={formData.cartorio || ''} onChange={handleChange} required disabled={!formData.cidade_matricula || loading.cartorios}> {/* NOVO NOME */}
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