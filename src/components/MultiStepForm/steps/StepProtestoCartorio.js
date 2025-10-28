// Salve em: src/components/MultiStepForm/steps/StepProtestoCartorio.js
'use client';

import { useState, useEffect } from 'react';
import styles from './StepProtestoCartorio.module.css';
import { protestoCartorios } from '@/utils/protestoCartorios';

export default function StepProtestoCartorio({ formData, handleChange }) {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cartorios, setCartorios] = useState([]);

  // Carrega a lista de estados do nosso arquivo de dados local
  useEffect(() => {
    setEstados(Object.keys(protestoCartorios));
  }, []);

  // Atualiza a lista de cidades quando um estado é selecionado
  useEffect(() => {
    if (formData.estado && protestoCartorios[formData.estado]) {
      setCidades(Object.keys(protestoCartorios[formData.estado]));
    } else {
      setCidades([]);
    }
    handleChange({ target: { name: 'cidade', value: '' } });
  }, [formData.estado, handleChange]);
  
  // Atualiza a lista de cartórios quando uma cidade é selecionada
  useEffect(() => {
     if (formData.cidade && formData.estado && protestoCartorios[formData.estado]?.[formData.cidade]) {
        setCartorios(protestoCartorios[formData.estado][formData.cidade]);
    } else if (formData.cidade) {
        // Se a cidade foi selecionada mas não está na lista, oferece a opção de cartório único
        setCartorios(['(Cartório Único - Serventia Extrajudicial)']);
    } else {
        setCartorios([]);
    }
    handleChange({ target: { name: 'todos_cartorios_protesto', checked: false, type: 'checkbox' } });
    handleChange({ target: { name: 'cartorio_protesto', value: '' } });
  },[formData.cidade, formData.estado, handleChange]);


  // Manipula a mudança no checkbox "Todos os cartórios"
  const handleTodosCartoriosChange = (e) => {
    handleChange(e);
    if (e.target.checked) {
      handleChange({ target: { name: 'cartorio_protesto', value: '' } });
    }
  };
  
  // Manipula a mudança no select de cartório individual
  const handleCartorioChange = (e) => {
      handleChange(e);
      if(e.target.value) {
          handleChange({ target: { name: 'todos_cartorios_protesto', checked: false, type: 'checkbox' } });
      }
  }

  return (
    <div>
      <h3 className={styles.stepTitle}>1. Localização do Cartório de Protesto</h3>
      <div className={styles.infoBox}>Saiba como efetuar o pagamento no seu protesto.</div>
      
      <div className={styles.formGroup}>
        <label>Estado do Cartório</label>
        <select name="estado" value={formData.estado || ''} onChange={handleChange} required>
          <option value="">Selecione o estado</option>
          {estados.map(est => <option key={est} value={est}>{est}</option>)}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Cidade do Cartório</label>
        <select name="cidade" value={formData.cidade || ''} onChange={handleChange} required disabled={!formData.estado}>
          <option value="">Selecione a cidade</option>
          {cidades.map(cid => <option key={cid} value={cid}>{cid}</option>)}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.mainLabel}>Dados do cartório</label>
        <p className={styles.description}>Escolha um ou mais cartórios nos quais deseja fazer a solicitação.</p>
        
        {cartorios.length > 1 && (
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              name="todos_cartorios_protesto" 
              checked={!!formData.todos_cartorios_protesto}
              onChange={handleTodosCartoriosChange}
              disabled={!formData.cidade}
            />
            Todos os cartórios de {formData.cidade} ({cartorios.length} cartórios)
          </label>
        )}

        <select 
          name="cartorio_protesto" 
          value={formData.cartorio_protesto || ''} 
          onChange={handleCartorioChange}
          required={!formData.todos_cartorios_protesto}
          disabled={!formData.cidade || !!formData.todos_cartorios_protesto}
        >
          <option value="">Selecione o Cartório</option>
          {cartorios.map(cart => <option key={cart} value={cart}>{cart}</option>)}
        </select>
      </div>
    </div>
  );
}