// Salve em: src/components/ProductPage/ProductForm.js
'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import styles from './ProductForm.module.css';

// --- Componente interno para renderizar campos de formulário simples ---
const FormField = ({ field, value, onChange }) => {
    // Validação de e-mail padrão do HTML5
    const emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

    switch (field.type) {
        case 'text':
            return (
                <div className={styles.formGroup}>
                    <label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label>
                    <input type="text" id={field.id} name={field.id} required={field.required} />
                </div>
            );
        case 'email':
          return (
            <div className={styles.formGroup}>
              <label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label>
              <input type="email" id={field.id} name={field.id} required={field.required} pattern={emailPattern} title="Digite um e-mail válido."/>
            </div>
          );
        // Usamos 'tel' para CPF e Telefone para melhor semântica e compatibilidade com teclados mobile
        case 'tel':
            return (
                <div className={styles.formGroup}>
                    <label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label>
                    <input type="tel" id={field.id} name={field.id} required={field.required} value={value} onChange={onChange} maxLength={field.maxLength} pattern={field.pattern} title={field.title} placeholder={field.placeholder}/>
                </div>
            );
        case 'date':
            return (
                <div className={styles.formGroup}>
                    <label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label>
                    <input type="date" id={field.id} name={field.id} required={field.required} />
                </div>
            );
        case 'textarea':
           return (
            <div className={styles.formGroup}>
              <label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label>
              <textarea id={field.id} name={field.id} required={field.required} rows="4"></textarea>
            </div>
          );
        case 'radio':
          return (
            <div className={styles.formGroup}>
              <label>{field.label} {field.required && <span>*</span>}</label>
              <div className={styles.radioGroup}>
                {field.options.map(option => (
                  <label key={option} className={styles.radioLabel}>
                    <input type="radio" name={field.id} value={option} required={field.required} defaultChecked={field.options.indexOf(option) === 0} />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          );
        default:
          return null;
      }
};


// --- Componente Principal do Formulário ---
const ProductForm = ({ productData }) => {
  const { formFields, atribuicaoId } = productData;

  // Estados para dados dinâmicos da API
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cartorios, setCartorios] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [loadingCartorios, setLoadingCartorios] = useState(false);
  
  // Estados para controle de seleção do usuário
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  
  // Estados para os campos com máscara e validação
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  // Estado para a funcionalidade de fallback do cartório
  const [showManualCartorio, setShowManualCartorio] = useState(false);

  // --- Funções de Máscara ---
  const handleCpfChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
    let maskedValue = value.slice(0, 11); // Limita a 11 dígitos
    maskedValue = maskedValue.replace(/(\d{3})(\d)/, '$1.$2');
    maskedValue = maskedValue.replace(/(\d{3})(\d)/, '$1.$2');
    maskedValue = maskedValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(maskedValue);
  };

  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11); // Limita a 11 dígitos (DDD + 9 dígitos)
    let maskedValue = value;

    if (value.length > 10) { // Celular com 9 dígitos: (XX) XXXXX-XXXX
        maskedValue = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 6) { // Telefone fixo ou celular antigo: (XX) XXXX-XXXX
        maskedValue = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
        maskedValue = value.replace(/(\d{2})(\d*)/, '($1) $2');
    } else if (value.length > 0) {
        maskedValue = value.replace(/(\d*)/, '($1');
    }
    setTelefone(maskedValue);
  };
  
  // --- Efeitos para buscar dados da API ---
  useEffect(() => {
    const precisaDeEstados = formFields.some(group => group.fields.some(field => field.id === 'estado'));
    if (precisaDeEstados) {
        const fetchEstados = async () => {
          setLoadingEstados(true);
          try { 
            const { data } = await api.get('/cartorios/estados'); 
            setEstados(data); 
          } 
          catch (err) { console.error("Erro ao buscar estados:", err); } 
          finally { setLoadingEstados(false); }
        };
        fetchEstados();
    }
  }, [formFields]);

  useEffect(() => {
    if (!selectedEstado) { 
        setCidades([]); 
        setCartorios([]); 
        return; 
    }
    const fetchCidades = async () => {
        setLoadingCidades(true); 
        setSelectedCidade(''); 
        setCartorios([]);
        try { 
            const { data } = await api.get(`/cartorios/estados/${selectedEstado}/cidades`); 
            setCidades(data); 
        } 
        catch (err) { console.error("Erro ao buscar cidades:", err); } 
        finally { setLoadingCidades(false); }
    };
    fetchCidades();
  }, [selectedEstado]);

  useEffect(() => {
    if (!selectedEstado || !selectedCidade) { 
        setCartorios([]); 
        return; 
    }
    const fetchCartorios = async () => {
      setLoadingCartorios(true);
      try {
        const params = new URLSearchParams({ estado: selectedEstado, cidade: selectedCidade });
        if (atribuicaoId) { 
            params.append('atribuicaoId', String(atribuicaoId)); 
        }
        const { data } = await api.get(`/cartorios?${params.toString()}`); 
        setCartorios(data);
      } 
      catch (err) { console.error("Erro ao buscar cartórios:", err); } 
      finally { setLoadingCartorios(false); }
    };
    fetchCartorios();
  }, [selectedCidade, selectedEstado, atribuicaoId]);

  
  // --- Função principal para renderizar cada campo do formulário ---
  const renderField = (field) => {
    // Tratamento especial para o campo CPF
    if (field.id === 'requerente_cpf') {
      return <FormField field={{ ...field, type: 'tel', maxLength: 14, pattern: "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", title: "Formato: 123.456.789-00", placeholder: "000.000.000-00" }} value={cpf} onChange={handleCpfChange} />;
    }
    // Tratamento especial para o campo Telefone
    if (field.id === 'requerente_telefone') {
      return <FormField field={{ ...field, type: 'tel', maxLength: 15, pattern: "\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}", title: "Formato: (11) 91234-5678", placeholder: "(00) 00000-0000" }} value={telefone} onChange={handleTelefoneChange} />;
    }
    
    // Lógica para todos os campos do tipo 'select'
    if (field.type === 'select') {
        let options = [], isLoading = false, value, onChange, disabled = false, defaultOptionText = 'Selecione';
        switch(field.id) {
            case 'estado': 
                options = estados.map(e => ({ value: e, label: e })); 
                isLoading = loadingEstados; 
                value = selectedEstado; 
                onChange = (e) => setSelectedEstado(e.target.value); 
                defaultOptionText = isLoading ? 'Carregando...' : 'Selecione o estado'; 
                break;
            case 'cidade': 
                options = cidades.map(c => ({ value: c, label: c })); 
                isLoading = loadingCidades; 
                value = selectedCidade; 
                onChange = (e) => setSelectedCidade(e.target.value); 
                disabled = !selectedEstado || loadingCidades; 
                defaultOptionText = loadingCidades ? 'Carregando...' : 'Selecione a cidade'; 
                break;
            case 'cartorio': 
                options = cartorios; 
                isLoading = loadingCartorios; 
                disabled = !selectedCidade || loadingCartorios || showManualCartorio; 
                defaultOptionText = isLoading ? 'Buscando...' : 'Selecione o cartório'; 
                break;
            default: 
                options = field.options?.map(opt => ({ value: opt, label: opt })) || [];
        }
      return (
        <div className={styles.formGroup}>
            <label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label>
            <select id={field.id} name={field.id} value={value} onChange={onChange} disabled={disabled} required={!showManualCartorio && field.required}>
                <option value="">{defaultOptionText}</option>
                {options.map(opt => <option key={opt.value} value={opt.label}>{opt.label}</option>)}
            </select>
        </div>
      );
    }
    // Para todos os outros tipos de campos, usa o componente genérico
    return <FormField field={field} />;
  };

  const precoFixo = 22.52;

  return (
    <div id="form-inicio" className={styles.formWrapper}>
      {formFields.map((group, index) => (
        <div key={index} className={styles.formSection}>
          {group.groupTitle && <h3 className={styles.sectionTitle}>{group.groupTitle}</h3>}
          {group.groupDescription && <p className={styles.sectionDescription}>{group.groupDescription}</p>}
          {group.fields.map(field => (
            <div key={field.id}>
              {renderField(field)}
              
              {/* Lógica universal que adiciona o botão de fallback após qualquer campo de cartório */}
              {field.id === 'cartorio' && (
                <div className={styles.fallbackContainer}>
                  <p>Não encontrou o cartório na lista?</p>
                  <button type="button" className={styles.fallbackButton} onClick={() => setShowManualCartorio(!showManualCartorio)}>
                    {showManualCartorio ? 'Voltar para a lista' : 'Informar manualmente'}
                  </button>
                  {showManualCartorio && (
                    <div className={styles.manualInputWrapper}>
                      <p className={styles.manualInputWarning}>
                        Atenção: A responsabilidade pela informação é sua. Não haverá estorno caso o cartório informado esteja incorreto.
                      </p>
                      <div className={styles.formGroup}>
                        <label htmlFor="cartorio_manual">Digite o nome e endereço do cartório <span>*</span></label>
                        <input type="text" id="cartorio_manual" name="cartorio_manual" required={showManualCartorio} placeholder="Ex: 1º Oficial de Registro de Imóveis de Campinas"/>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      <input type="hidden" name="preco_final" value={precoFixo} />
      <div className={styles.priceDisplay}>
        Total: <strong>R$ {precoFixo.toFixed(2).replace('.', ',')}</strong>
      </div>
      <button type="submit" className={styles.submitButton}>Adicionar ao Carrinho</button>
    </div>
  );
};

export default ProductForm;