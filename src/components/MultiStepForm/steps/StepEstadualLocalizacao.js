// Salve em: src/components/MultiStepForm/steps/StepEstadualLocalizacao.js
'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import styles from './StepEstadualLocalizacao.module.css';
import SearchableDropdown from './SearchableDropdown';

export default function StepEstadualLocalizacao({ formData, handleChange, productData }) {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEstados = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/cartorios/estados');
        setEstados(data);
      } catch (error) {
        console.error("Erro ao buscar a lista de estados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEstados();
  }, []);

  const handleEstadoChange = (value) => {
    handleChange({ target: { name: 'estado', value } });
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>1. Localização da Certidão</h3>
      <p className={styles.stepDescription}>
        Selecione o Estado em que deseja realizar a pesquisa para verificar quais dados são necessários para obter a {productData.name}.
      </p>

      <div className={styles.formGroup}>
        <label htmlFor="estado">Estado</label>
        <SearchableDropdown
          options={estados}
          value={formData.estado || ''}
          onChange={handleEstadoChange}
          placeholder="Selecione o Estado"
          loading={loading}
          disabled={loading}
        />
      </div>
    </div>
  );
}