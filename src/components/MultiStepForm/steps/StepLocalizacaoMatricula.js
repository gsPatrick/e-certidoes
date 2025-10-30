// Salve em: src/components/MultiStepForm/steps/StepLocalizacaoMatricula.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import styles from './StepLocalizacaoMatricula.module.css';
import { getPrice } from '@/utils/pricingData'; // 1. Importar a função de busca de preço

export default function StepLocalizacaoMatricula({ formData, handleChange, productData }) {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cartorios, setCartorios] = useState([]);
  const [loading, setLoading] = useState({ estados: false, cidades: false, cartorios: false });
  const [isServiceAvailable, setIsServiceAvailable] = useState(true); // 2. Novo estado para controlar a disponibilidade

  // Efeito para verificar a disponibilidade do serviço ao mudar o estado
  useEffect(() => {
    if (formData.estado_matricula) {
      const price = getPrice('registro_imoveis_pesquisas', 'estado', formData.estado_matricula, 'visualizacao_matricula');
      setIsServiceAvailable(price !== null);
    } else {
      setIsServiceAvailable(true); // Reseta quando o estado é limpo
    }
  }, [formData.estado_matricula]);

  // Busca estados
  useEffect(() => {
    setLoading(prev => ({ ...prev, estados: true }));
    api.get('/cartorios/estados').then(res => setEstados(res.data)).finally(() => setLoading(prev => ({ ...prev, estados: false })));
  }, []);

  // Busca cidades
  useEffect(() => {
    if (!formData.estado_matricula) {
      setCidades([]);
      setCartorios([]);
      return;
    }
    setLoading(prev => ({ ...prev, cidades: true }));
    api.get(`/cartorios/estados/${formData.estado_matricula}/cidades`).then(res => setCidades(res.data)).finally(() => setLoading(prev => ({ ...prev, cidades: false })));
  }, [formData.estado_matricula]);

  // Busca cartórios
  useEffect(() => {
    if (!formData.estado_matricula || !formData.cidade_matricula) {
      setCartorios([]);
      return;
    }
    const atribuicaoId = productData?.atribuicaoId;
    setLoading(prev => ({ ...prev, cartorios: true }));
    const params = new URLSearchParams({ estado: formData.estado_matricula, cidade: formData.cidade_matricula });
    if (atribuicaoId) params.append('atribuicaoId', atribuicaoId);
    api.get(`/cartorios?${params.toString()}`).then(res => setCartorios(res.data)).finally(() => setLoading(prev => ({ ...prev, cartorios: false })));
  }, [formData.cidade_matricula, formData.estado_matricula, productData?.atribuicaoId]);

  const handleSelectChange = (e) => {
    handleChange(e);
    if (e.target.name === 'estado_matricula') {
      handleChange({ target: { name: 'cidade_matricula', value: '' } });
      handleChange({ target: { name: 'cartorio', value: '' } });
    }
    if (e.target.name === 'cidade_matricula') {
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
        <label htmlFor="estado_matricula">Estado *</label>
        <select id="estado_matricula" name="estado_matricula" value={formData.estado_matricula || ''} onChange={handleSelectChange} required disabled={loading.estados}>
          <option value="">{loading.estados ? 'Carregando...' : 'Selecione o estado'}</option>
          {estados.map(est => <option key={est} value={est}>{est}</option>)}
        </select>
      </div>

      {/* 3. Renderização condicional dos campos ou da mensagem de fallback */}
      {isServiceAvailable ? (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="cidade_matricula">Cidade *</label>
            <select id="cidade_matricula" name="cidade_matricula" value={formData.cidade_matricula || ''} onChange={handleSelectChange} required disabled={!formData.estado_matricula || loading.cidades}>
              <option value="">{loading.cidades ? 'Carregando...' : 'Selecione a cidade'}</option>
              {cidades.map(cid => <option key={cid} value={cid}>{cid}</option>)}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cartorio">Cartório de Registro de Imóveis *</label>
            <select id="cartorio" name="cartorio" value={formData.cartorio || ''} onChange={handleChange} required disabled={!formData.cidade_matricula || loading.cartorios}>
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
              <Link href="/certidoes/pesquisa-previa-de-imoveis-por-cpf-cnpj" className={styles.fallbackButton}>
                Pesquise pelo CPF/CNPJ antes
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.unavailableBox}>
          <h4>Serviço Indisponível para este Estado</h4>
          <p>
            A visualização de matrícula automatizada não está disponível para o estado de <strong>{formData.estado_matricula}</strong> no momento.
          </p>
          <p>
            Para solicitar uma cotação manual, por favor, entre em contato com nosso atendimento.
          </p>
          <Link href="/contato" className={styles.contactButton}>Falar com Atendimento</Link>
        </div>
      )}
    </div>
  );
}