// Salve em: src/components/ProductPage/ProductForm.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import styles from './ProductForm.module.css';

const FormField = ({ field, value, onChange }) => {
    const emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    switch (field.type) {
        case 'text': return (<div className={styles.formGroup}><label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label><input type="text" id={field.id} name={field.id} required={field.required} /></div>);
        case 'email': return (<div className={styles.formGroup}><label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label><input type="email" id={field.id} name={field.id} required={field.required} pattern={emailPattern} title="Digite um e-mail válido."/></div>);
        case 'tel': return (<div className={styles.formGroup}><label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label><input type="tel" id={field.id} name={field.id} required={field.required} value={value} onChange={onChange} maxLength={field.maxLength} pattern={field.pattern} title={field.title} placeholder={field.placeholder}/></div>);
        case 'textarea': return (<div className={styles.formGroup}><label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label><textarea id={field.id} name={field.id} required={field.required} rows="4"></textarea></div>);
        case 'radio': return (<div className={styles.formGroup}><label>{field.label} {field.required && <span>*</span>}</label><div className={styles.radioGroup}>{field.options.map(option => (<label key={option} className={styles.radioLabel}><input type="radio" name={field.id} value={option} required={field.required} defaultChecked={field.options.indexOf(option) === 0} />{option}</label>))}</div></div>);
        default: return null;
    }
};

const ProductForm = ({ productData }) => {
  const { formFields, atribuicaoId, allowCpfSearch, allowManualCartorio, isPlaceholder } = productData;
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cartorios, setCartorios] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [loadingCartorios, setLoadingCartorios] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [showManualCartorio, setShowManualCartorio] = useState(false);

  const handleCpfChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let maskedValue = value.slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(maskedValue);
  };

  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.slice(0, 11);
    let maskedValue = value;
    if (value.length > 10) { maskedValue = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'); } 
    else if (value.length > 6) { maskedValue = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3'); } 
    else if (value.length > 2) { maskedValue = value.replace(/(\d{2})(\d*)/, '($1) $2'); } 
    else if (value.length > 0) { maskedValue = value.replace(/(\d*)/, '($1'); }
    setTelefone(maskedValue);
  };

  useEffect(() => { const p = formFields.some(g=>g.fields.some(f=>f.id==='estado')); if(p){ const f=async()=>{setLoadingEstados(true);try{const{data}=await api.get('/cartorios/estados');setEstados(data)}catch(e){console.error(e)}finally{setLoadingEstados(false)}};f()}}, [formFields]);
  useEffect(() => { if(!selectedEstado){setCidades([]);setCartorios([]);return} const f=async()=>{setLoadingCidades(true);setSelectedCidade('');setCartorios([]);try{const{data}=await api.get(`/cartorios/estados/${selectedEstado}/cidades`);setCidades(data)}catch(e){console.error(e)}finally{setLoadingCidades(false)}};f()}, [selectedEstado]);
  useEffect(() => { if(!selectedEstado||!selectedCidade){setCartorios([]);return} const f=async()=>{setLoadingCartorios(true);try{const p=new URLSearchParams({estado:selectedEstado,cidade:selectedCidade});if(atribuicaoId){p.append('atribuicaoId',String(atribuicaoId))}const{data}=await api.get(`/cartorios?${p.toString()}`);setCartorios(data)}catch(e){console.error(e)}finally{setLoadingCartorios(false)}};f()}, [selectedCidade,selectedEstado,atribuicaoId]);

  const renderField = (field) => {
    if (field.id === 'requerente_cpf') { return <FormField field={{ ...field, type: 'tel', maxLength: 14, pattern: "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", title: "Formato: 123.456.789-00", placeholder: "000.000.000-00" }} value={cpf} onChange={handleCpfChange} />; }
    if (field.id === 'requerente_telefone') { return <FormField field={{ ...field, type: 'tel', maxLength: 15, pattern: "\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}", title: "Formato: (11) 91234-5678", placeholder: "(00) 00000-0000" }} value={telefone} onChange={handleTelefoneChange} />; }
    if (field.type === 'select') { let o=[], l=!1, v, c, d=!1, t='Selecione'; switch(field.id){ case 'estado': o=estados.map(e=>({value:e,label:e}));l=loadingEstados;v=selectedEstado;c=(e)=>setSelectedEstado(e.target.value);t=l?'Carregando...':'Selecione o estado';break; case 'cidade': o=cidades.map(c=>({value:c,label:c}));l=loadingCidades;v=selectedCidade;c=(e)=>setSelectedCidade(e.target.value);d=!selectedEstado||l;t=l?'Carregando...':'Selecione a cidade';break; case 'cartorio': o=cartorios;l=loadingCartorios;d=!selectedCidade||l||showManualCartorio;t=l?'Buscando...':'Selecione o cartório';break; default: o=field.options?.map(opt=>({value:opt,label:opt}))||[]} return (<div className={styles.formGroup}><label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label><select id={field.id} name={field.id} value={v} onChange={c} disabled={d} required={!showManualCartorio&&field.required}><option value="">{t}</option>{o.map(opt=><option key={opt.value} value={opt.label}>{opt.label}</option>)}</select></div>); }
    return <FormField field={field} />;
  };

  const precoFixo = 22.52;
  const shouldShowFallback = allowCpfSearch || allowManualCartorio;

  return (
    <div id="form-inicio" className={styles.formWrapper}>
      {isPlaceholder ? (
        <div className={styles.placeholder}>
            <h3 className={styles.sectionTitle}>Serviço em Breve</h3>
            <p>Este pacote de serviços está sendo finalizado para oferecer a você a melhor experiência. Volte em breve!</p>
        </div>
      ) : (
        <>
          {formFields.map((group, index) => (
            <div key={index} className={styles.formSection}>
              {group.groupTitle && <h3 className={styles.sectionTitle}>{group.groupTitle}</h3>}
              {group.groupDescription && <p className={styles.sectionDescription}>{group.groupDescription}</p>}
              {group.fields.map(field => (
                <div key={field.id}>
                  {renderField(field)}
                  {field.id === 'cartorio' && shouldShowFallback && (
                    <div className={styles.fallbackContainer}>
                      <p className={styles.fallbackTitle}>Não localizou o cartório na lista ou não sabe informar?</p>
                      <div className={styles.fallbackActions}>
                        {allowCpfSearch && (
                          <Link href="/certidoes/pesquisa-de-imveis" className={styles.fallbackButton}>
                            Pesquise pelo CPF/CNPJ antes
                          </Link>
                        )}
                        {allowManualCartorio && (
                          <button type="button" className={styles.fallbackButton} onClick={() => setShowManualCartorio(!showManualCartorio)}>
                            {showManualCartorio ? 'Voltar para a lista' : 'Informe manualmente clicando aqui'}
                          </button>
                        )}
                      </div>
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
          <div className={styles.priceDisplay}> Total: <strong>R$ {precoFixo.toFixed(2).replace('.', ',')}</strong> </div>
          <button type="submit" className={styles.submitButton}>Adicionar ao Carrinho</button>
        </>
      )}
    </div>
  );
};

export default ProductForm;