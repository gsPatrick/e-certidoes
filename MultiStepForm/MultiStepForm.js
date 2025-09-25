// Salve em: src/components/MultiStepForm/MultiStepForm.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import api from '@/services/api';
import StepProgressBar from './StepProgressBar';
import styles from './MultiStepForm.module.css';
import Link from 'next/link';

// --- Funções Utilitárias de Máscara e Formatação ---
const maskCPF = (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskPhone = (value) => {
  let v = value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  if (v.length > 2) return v.replace(/(\d{2})(\d*)/, '($1) $2');
  return v.replace(/(\d*)/, '($1');
};
const formatLabel = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

// --- Componente de Campo de Formulário Genérico ---
const FormField = ({ field, value, onChange }) => {
    const emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    const commonProps = { id: field.id, name: field.id, value: value || '', onChange, required: field.required };

    switch (field.type) {
        case 'text': case 'date':
            return <div className={styles.formGroup}><label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label><input type={field.type} {...commonProps} /></div>;
        case 'email':
            return <div className={styles.formGroup}><label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label><input type="email" {...commonProps} pattern={emailPattern} title="Digite um e-mail válido."/></div>;
        case 'tel':
            return <div className={styles.formGroup}><label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label><input type="tel" {...commonProps} maxLength={field.maxLength} pattern={field.pattern} title={field.title} placeholder={field.placeholder}/></div>;
        case 'textarea':
             return <div className={styles.formGroup}><label htmlFor={field.id}>{field.label} {field.required && <span>*</span>}</label><textarea {...commonProps} rows="4" /></div>;
        case 'radio':
            return <div className={styles.formGroup}><label>{field.label} {field.required && <span>*</span>}</label><div className={styles.radioGroup}>{field.options.map(opt => (<label key={opt} className={styles.radioLabel}><input type="radio" name={field.id} value={opt} checked={value === opt} onChange={onChange} required={field.required}/>{opt}</label>))}</div></div>;
        default: return null;
    }
};

// --- Componente Principal do Formulário Multi-Etapas ---
const MultiStepForm = ({ productData }) => {
  const { addToCart } = useCart();
  const formRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ formato: 'Certidão Impressa' });
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [apiData, setApiData] = useState({ estados: [], cidades: [], cartorios: [] });
  const [loading, setLoading] = useState({ estados: false, cidades: false, cartorios: false });

  const steps = ['Localização', 'Dados da Certidão', 'Dados do Requerente', 'Revisão'];
  const precoFixo = 22.52;

  // --- Efeitos para buscar dados da API ---
  useEffect(() => { const p = productData.formFields.some(g=>g.fields.some(f=>f.id==='estado')); if(p){ setLoading(p=>({...p,estados:true})); api.get('/cartorios/estados').then(r=>setApiData(p=>({...p,estados:r.data}))).catch(e=>console.error(e)).finally(()=>setLoading(p=>({...p,estados:false}))) }}, [productData.formFields]);
  useEffect(() => { if(!formData.estado) { setApiData(p=>({...p,cidades:[],cartorios:[]})); return; } setLoading(p=>({...p,cidades:true})); setApiData(p=>({...p,cidades:[],cartorios:[]})); api.get(`/cartorios/estados/${formData.estado}/cidades`).then(r=>setApiData(p=>({...p,cidades:r.data}))).catch(e=>console.error(e)).finally(()=>setLoading(p=>({...p,cidades:false}))) }, [formData.estado]);
  useEffect(() => { if(!formData.cidade) { setApiData(p=>({...p,cartorios:[]})); return; } setLoading(p=>({...p,cartorios:true})); setApiData(p=>({...p,cartorios:[]})); const p=new URLSearchParams({estado:formData.estado,cidade:formData.cidade,atribuicaoId:productData.atribuicaoId}); api.get(`/cartorios?${p.toString()}`).then(r=>setApiData(p=>({...p,cartorios:r.data}))).catch(e=>console.error(e)).finally(()=>setLoading(p=>({...p,cartorios:false})))}, [formData.cidade, formData.estado, productData.atribuicaoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'requerente_cpf' ? maskCPF(value) : name === 'requerente_telefone' ? maskPhone(value) : value;
    const newFormData = { ...formData, [name]: finalValue };
    if (name === 'estado') { newFormData.cidade = ''; newFormData.cartorio = ''; }
    if (name === 'cidade') { newFormData.cartorio = ''; }
    setFormData(newFormData);
  };
  
  const handleFileChange = (e) => setUploadedFiles(Array.from(e.target.files));
  const handleNextStep = () => { if (formRef.current?.checkValidity()) { setCurrentStep(p => p + 1); } else { formRef.current?.reportValidity(); } };
  const prevStep = () => setCurrentStep(p => p - 1);
  const handleFinalSubmit = (e) => { e.preventDefault(); if (!agreedToTerms) { alert("Você precisa concordar com os termos para continuar."); return; } console.log("Arquivos para upload:", uploadedFiles); const item = { ...productData, price: precoFixo, formData }; addToCart(item); };

  const renderStepContent = () => {
    const { formFields, allowCpfSearch, allowManualCartorio } = productData;
    const localizacaoGroup = formFields[0];
    const infoCertidaoGroups = formFields.slice(1, -1);
    const requerenteGroup = formFields[formFields.length - 1];

    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className={styles.stepTitle}>1. {localizacaoGroup.groupTitle}</h3>
            {localizacaoGroup.fields.map(field => {
                if (field.type !== 'select') return <FormField key={field.id} field={field} value={formData[field.id]} onChange={handleChange} />;
                const options = apiData[field.id + 's'] || [];
                const isLoading = loading[field.id + 's'];
                const isDisabled = (field.id === 'cidade' && (!formData.estado || isLoading)) || (field.id === 'cartorio' && (!formData.cidade || isLoading || showFileUpload));
                
                return (
                    <div key={field.id}>
                        <div className={styles.formGroup}>
                            <label htmlFor={field.id}>{field.label} *</label>
                            <select name={field.id} value={formData[field.id] || ''} onChange={handleChange} required={field.id !== 'cartorio' || !showFileUpload} disabled={isDisabled}>
                                <option value="">{isLoading ? 'Carregando...' : `Selecione o(a) ${field.id}`}</option>
                                {options.map(item => <option key={item.value || item} value={item.label || item}>{item.label || item}</option>)}
                            </select>
                        </div>
                        {field.id === 'cartorio' && (allowCpfSearch || allowManualCartorio) && (
                            <div className={styles.fallbackContainer}>
                                <p className={styles.fallbackTitle}>Não localizou o cartório na lista ou não sabe informar?</p>
                                <div className={styles.fallbackActions}>
                                    {allowCpfSearch && <Link href="/certidoes/pesquisa-de-imveis" className={styles.fallbackButton}>Pesquise pelo CPF/CNPJ antes</Link>}
                                    {allowManualCartorio && <button type="button" className={styles.fallbackButton} onClick={() => setShowFileUpload(s => !s)}>{showFileUpload ? 'Cancelar Anexo' : 'Anexar Documentos'}</button>}
                                </div>
                                {showFileUpload && (
                                    <div className={styles.manualInputWrapper}>
                                        <p className={styles.manualInputWarning}>Anexe a matrícula, escritura, contrato ou outro documento que ajude a localizar o imóvel.</p>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="file_upload">Selecione os arquivos (PDF, JPG, PNG)</label>
                                            <input type="file" id="file_upload" name="anexosCliente" multiple onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png"/>
                                            <div className={styles.fileList}>{uploadedFiles.map((file, index) => (<span key={index}>{file.name}</span>))}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
          </>
        );
      case 2:
        return (
          <>
            <h3 className={styles.stepTitle}>2. Dados da Certidão</h3>
            {infoCertidaoGroups.map(group => (
              <div key={group.groupTitle}>
                <h4>{group.groupTitle}</h4>
                {group.groupDescription && <p className={styles.stepDescription}>{group.groupDescription}</p>}
                {group.fields.map(field => <FormField key={field.id} field={field} value={formData[field.id]} onChange={handleChange} />)}
              </div>
            ))}
          </>
        );
      case 3:
        return (
          <>
            <h3 className={styles.stepTitle}>3. {requerenteGroup.groupTitle}</h3>
            {requerenteGroup.fields.map(field => {
                if(field.id === 'requerente_cpf') return <FormField key={field.id} field={{...field, type:'tel', maxLength: 14, pattern: "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", title: "Formato: 123.456.789-00", placeholder: "000.000.000-00" }} value={formData.requerente_cpf} onChange={handleChange} />;
                if(field.id === 'requerente_telefone') return <FormField key={field.id} field={{...field, type:'tel', maxLength: 15, pattern: "\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}", title: "Formato: (11) 91234-5678", placeholder: "(00) 00000-0000" }} value={formData.requerente_telefone} onChange={handleChange} />;
                return <FormField key={field.id} field={field} value={formData[field.id]} onChange={handleChange} />;
            })}
          </>
        );
      case 4:
        return (
          <>
            <h3 className={styles.stepTitle}>4. Revise seu Pedido e Finalize</h3>
            <div className={styles.reviewGrid}>
              <div className={styles.reviewBlock}>
                <h4>{localizacaoGroup.groupTitle}</h4>
                {localizacaoGroup.fields.map(f => formData[f.id] && <p key={f.id}><strong>{f.label}:</strong> {formData[f.id]}</p>)}
                {showFileUpload && uploadedFiles.length > 0 && <p><strong>Anexos:</strong> {uploadedFiles.map(f => f.name).join(', ')}</p>}
              </div>
              {infoCertidaoGroups.map(group => (
                <div key={group.groupTitle} className={styles.reviewBlock}>
                    <h4>{group.groupTitle}</h4>
                    {group.fields.map(f => formData[f.id] && <p key={f.id}><strong>{f.label}:</strong> {formData[f.id]}</p>)}
                </div>
              ))}
              <div className={styles.reviewBlock}>
                <h4>{requerenteGroup.groupTitle}</h4>
                {requerenteGroup.fields.map(f => formData[f.id] && <p key={f.id}><strong>{f.label}:</strong> {formData[f.id]}</p>)}
              </div>
            </div>
            <div className={styles.summaryTable}>
                <div className={styles.summaryRow}><span>Emolumentos do Cartório + ISS:</span><span>R$ {precoFixo.toFixed(2).replace('.', ',')}</span></div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Valor Total:</span><span>R$ {precoFixo.toFixed(2).replace('.', ',')}</span></div>
            </div>
            <div className={styles.termsContainer}>
                <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} required />
                <label htmlFor="terms">
                    Li e concordo com os <Link href="/termos-e-condicoes" target="_blank">Termos e Condições</Link> do serviço. Entendo que, por se tratar de um serviço de intermediação digital, não haverá reembolso dos valores após o início do processamento do pedido.
                </label>
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className={styles.formContainer}>
      <StepProgressBar steps={steps} currentStep={currentStep} />
      <form ref={formRef} onSubmit={handleFinalSubmit}>
        <div className={styles.stepContent}>{renderStepContent()}</div>
        <div className={styles.navigation}>
          {currentStep > 1 && <button type="button" onClick={prevStep} className={styles.prevButton}>Voltar</button>}
          <div style={{flexGrow: 1}}></div>
          {currentStep < steps.length && <button type="button" onClick={handleNextStep} className={styles.nextButton}>Próximo</button>}
          {currentStep === steps.length && <button type="submit" disabled={!agreedToTerms} className={styles.submitButton}>Adicionar ao Carrinho</button>}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;