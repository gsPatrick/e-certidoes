// Salve em: src/components/MultiStepForm/steps/StepProtestoCartorio.js
'use client';

import { useState, useEffect } from 'react';
import styles from './StepProtestoCartorio.module.css';
import { protestoCartorios } from '@/utils/protestoCartorios';

export default function StepProtestoCartorio({ formData, handleChange }) {
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cartorios, setCartorios] = useState([]);

  useEffect(() => {
    setEstados(Object.keys(protestoCartorios));
  }, []);

  useEffect(() => {
    if (formData.estado_cartorio && protestoCartorios[formData.estado_cartorio]) {
      setCidades(Object.keys(protestoCartorios[formData.estado_cartorio]));
    } else {
      setCidades([]);
    }
    if (formData.cidade_cartorio) {
        handleChange({ target: { name: 'cidade_cartorio', value: '' } });
    }
  }, [formData.estado_cartorio, handleChange]);
  
  useEffect(() => {
    const cartoriosDaCidade = protestoCartorios[formData.estado_cartorio]?.[formData.cidade_cartorio];
    const cartorioUnicoOption = 'CARTÓRIO ÚNICO - SERVENTIA EXTRAJUDICIAL';

    if (cartoriosDaCidade && cartoriosDaCidade.length > 1) {
      setCartorios(cartoriosDaCidade);
    } else if (cartoriosDaCidade && cartoriosDaCidade.length === 1) {
      setCartorios([cartoriosDaCidade[0], cartorioUnicoOption]);
    } else {
      setCartorios([cartorioUnicoOption]);
      if(formData.cidade_cartorio) {
        handleChange({ target: { name: 'cartorio_protesto', value: cartorioUnicoOption } });
      }
    }
    
    handleChange({ target: { name: 'todos_cartorios_protesto', checked: false, type: 'checkbox' } });
    if (!cartoriosDaCidade && formData.cidade_cartorio) {
        handleChange({ target: { name: 'cartorio_protesto', value: cartorioUnicoOption } });
    } else {
        handleChange({ target: { name: 'cartorio_protesto', value: '' } });
    }
    
  },[formData.cidade_cartorio, formData.estado_cartorio, handleChange]);


  const handleTodosCartoriosChange = (e) => {
    handleChange(e);
    if (e.target.checked) {
      handleChange({ target: { name: 'cartorio_protesto', value: '' } });
    }
  };
  
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
        <select name="estado_cartorio" value={formData.estado_cartorio || ''} onChange={handleChange} required>
          <option value="">Selecione o estado</option>
          {estados.map(est => <option key={est} value={est}>{est}</option>)}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Cidade do Cartório</label>
        <select name="cidade_cartorio" value={formData.cidade_cartorio || ''} onChange={handleChange} required disabled={!formData.estado_cartorio}>
          <option value="">Selecione a cidade</option>
          {cidades.map(cid => <option key={cid} value={cid}>{cid}</option>)}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.mainLabel}>Dados do cartório</label>
        <p className={styles.description}>Escolha um ou mais cartórios nos quais deseja fazer a solicitação.</p>
        
        {cartorios.length > 1 && !cartorios.includes('CARTÓRIO ÚNICO - SERVENTIA EXTRAJUDICIAL') && (
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              name="todos_cartorios_protesto" 
              checked={!!formData.todos_cartorios_protesto}
              onChange={handleTodosCartoriosChange}
              disabled={!formData.cidade_cartorio}
            />
            Todos os cartórios de {formData.cidade_cartorio} ({cartorios.length} cartórios)
          </label>
        )}

        <select 
          name="cartorio_protesto" 
          value={formData.cartorio_protesto || ''} 
          onChange={handleCartorioChange}
          required={!formData.todos_cartorios_protesto}
          disabled={!formData.cidade_cartorio || !!formData.todos_cartorios_protesto}
        >
          <option value="">Selecione o Cartório</option>
          {cartorios.map(cart => <option key={cart} value={cart}>{cart}</option>)}
        </select>
      </div>
    </div>
  );
}