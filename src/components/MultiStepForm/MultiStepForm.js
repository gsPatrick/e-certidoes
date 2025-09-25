// Salve em: src/components/MultiStepForm/MultiStepForm.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { isValidCPF } from '@/utils/cpfValidator';
import { isValidCNPJ } from '@/utils/cnpjValidator';
import api from '@/services/api';
import StepProgressBar from './StepProgressBar';
import styles from './MultiStepForm.module.css';
import Link from 'next/link';

// --- Funções Utilitárias de Máscara ---
const maskCPF = (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskPhone = (value) => {
  let v = value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  if (v.length > 2) return v.replace(/(\d{2})(\d*)/, '($1) $2');
  return v.replace(/(\d*)/, '($1');
};
const maskCPF_CNPJ = (value) => {
  const cleanedValue = value.replace(/\D/g, '');
  if (cleanedValue.length <= 11) {
    return cleanedValue.slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    return cleanedValue.slice(0, 14).replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
};

// --- Componente de Campo de Formulário Genérico (MODIFICADO) ---
const FormField = ({ field, value, onChange, isRequired, checked, onCheckboxChange }) => {
    const emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    const commonProps = { id: field.id, name: field.id, value: value || '', onChange, required: isRequired };

    const labelContent = (
      <label htmlFor={field.id}>
        {field.label} {isRequired && <span className={styles.requiredAsterisk}>*</span>}
      </label>
    );

    switch (field.type) {
        case 'text': case 'date':
            return <div className={styles.formGroup}>{labelContent}<input type={field.type} {...commonProps} maxLength={field.maxLength} placeholder={field.placeholder} /></div>;
        case 'email':
            return <div className={styles.formGroup}>{labelContent}<input type="email" {...commonProps} pattern={emailPattern} title="Digite um e-mail válido."/></div>;
        case 'tel':
            return <div className={styles.formGroup}>{labelContent}<input type="tel" {...commonProps} maxLength={field.maxLength} pattern={field.pattern} title={field.title} placeholder={field.placeholder}/></div>;
        case 'textarea':
             return <div className={styles.formGroup}>{labelContent}<textarea {...commonProps} rows="4" /></div>;
        case 'radio':
            return <div className={styles.formGroup}><label>{field.label} {isRequired && <span className={styles.requiredAsterisk}>*</span>}</label><div className={styles.radioGroup}>{field.options.map(opt => (<label key={opt} className={styles.radioLabel}><input type="radio" name={field.id} value={opt} checked={value === opt} onChange={onChange} required={isRequired}/>{opt}</label>))}</div></div>;
        case 'checkbox':
            return <div className={styles.checkboxGroup}><label htmlFor={field.id} className={styles.checkboxLabel}><input type="checkbox" id={field.id} name={field.id} checked={checked} onChange={onCheckboxChange} />{field.label}</label></div>;
        default: return null;
    }
};

// --- Componente Principal ---
const MultiStepForm = ({ productData }) => {
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const formRef = useRef(null);
  const { isPlaceholder, formFields, allowCpfSearch, allowManualCartorio } = productData;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ formato: 'Certidão Impressa' });
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [apiData, setApiData] = useState({ estados: [], cidades: [], cartorios: [] });
  const [loading, setLoading] = useState({ estados: false, cidades: false, cartorios: false });
  const [error, setError] = useState('');
  
  const [protestoCount, setProtestoCount] = useState(null);
  const [protestoLoading, setProtestoLoading] = useState(false);
  const [protestoChoice, setProtestoChoice] = useState('individual');
  const [finalPrice, setFinalPrice] = useState(productData.price);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prevData => ({ ...prevData, requerente_nome: user.nome || '', requerente_email: user.email || '' }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const hasEstadoField = formFields.some(group => group.fields.some(field => field.id === 'estado'));
    if (hasEstadoField) {
      setLoading(prev => ({ ...prev, estados: true }));
      api.get('/cartorios/estados').then(response => setApiData(prev => ({ ...prev, estados: response.data }))).catch(e=>console.error(e)).finally(() => setLoading(prev => ({ ...prev, estados: false })));
    }
  }, [formFields]);

  useEffect(() => {
    if (!formData.estado) { setApiData(prev => ({ ...prev, cidades: [], cartorios: [] })); return; }
    setLoading(prev => ({ ...prev, cidades: true }));
    api.get(`/cartorios/estados/${formData.estado}/cidades`).then(response => setApiData(prev => ({ ...prev, cidades: response.data, cartorios: [] }))).catch(e=>console.error(e)).finally(() => setLoading(prev => ({ ...prev, cidades: false })));
  }, [formData.estado]);

  useEffect(() => {
    if (!formData.cidade || !formData.estado) { setApiData(prev => ({ ...prev, cartorios: [] })); return; }
    const isProtesto = productData.slug === 'certidao-de-protesto';
    const atribuicaoId = isProtesto ? '2' : productData.atribuicaoId;

    setLoading(prev => ({ ...prev, cartorios: true }));
    const params = new URLSearchParams({ estado: formData.estado, cidade: formData.cidade, atribuicaoId });
    api.get(`/cartorios?${params.toString()}`).then(response => setApiData(prev => ({ ...prev, cartorios: response.data }))).catch(e=>console.error(e)).finally(() => setLoading(prev => ({ ...prev, cartorios: false })));
    
    if (isProtesto) {
        setProtestoLoading(true);
        setProtestoCount(null);
        api.get(`/cartorios/contar-protesto`, { params: { estado: formData.estado, cidade: formData.cidade }})
            .then(response => setProtestoCount(response.data.count))
            .catch(e => console.error("Erro ao contar cartórios de protesto", e))
            .finally(() => setProtestoLoading(false));
    }
  }, [formData.cidade, formData.estado, productData.atribuicaoId, productData.slug]);

  useEffect(() => {
    if (productData.slug === 'certidao-de-protesto' && protestoChoice === 'totalidade' && protestoCount > 0) {
      const newPrice = productData.price * protestoCount;
      setFinalPrice(newPrice);
    } else {
      setFinalPrice(productData.price);
    }
  }, [protestoChoice, protestoCount, productData.price, productData.slug]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    if (name === 'requerente_cpf') finalValue = maskCPF(value);
    else if (name === 'requerente_telefone') finalValue = maskPhone(value);
    else if (['cpf_cnpj', 'cpf_cnpj_proprietario', 'cpf_cnpj_pesquisado', 'cpf_cnpj_devedor'].includes(name)) {
        finalValue = maskCPF_CNPJ(value);
    }
    
    setFormData(prevData => {
      const newData = { ...prevData, [name]: finalValue };
      if (name === 'estado') { newData.cidade = ''; newData.cartorio = ''; setProtestoCount(null); }
      if (name === 'cidade') { newData.cartorio = ''; setProtestoCount(null); }
      return newData;
    });
  };

  const handleFileChange = (e) => setUploadedFiles(Array.from(e.target.files));
  
  const handleNextStep = () => {
    setError('');
    const currentGroup = formFields[currentStep - 1];
    if (currentGroup) {
      const cpfCnpjFields = ['requerente_cpf', 'cpf_cnpj_devedor', 'cpf_cnpj_pesquisado', 'cpf_cnpj_partes'];
      for (const field of currentGroup.fields) {
        if (cpfCnpjFields.includes(field.id) && formData[field.id]) {
          const value = formData[field.id].replace(/\D/g, '');
          if (value.length <= 11 && !isValidCPF(value)) {
            setError(`O CPF informado no campo "${field.label.replace(' (OPCIONAL)', '')}" não é válido.`); return;
          }
          if (value.length > 11 && !isValidCNPJ(value)) {
             setError(`O CNPJ informado no campo "${field.label.replace(' (OPCIONAL)', '')}" não é válido.`); return;
          }
        }
      }
    }
    if (formRef.current?.checkValidity()) { setCurrentStep(prev => prev + 1); } 
    else { formRef.current?.reportValidity(); }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);
  
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!agreedToTerms) { alert("Você precisa concordar com os termos para continuar."); return; }
    const item = { ...productData, price: finalPrice, formData, uploadedFiles };
    addToCart(item);
  };

  const renderStepContent = () => {
    const currentGroup = formFields[currentStep - 1];
    if (!currentGroup) { // Tela de Revisão
        return (
            <>
              <h3 className={styles.stepTitle}>Revise seu Pedido</h3>
              <div className={styles.reviewGrid}>
                  {formFields.map(group => (
                      <div key={group.groupTitle} className={styles.reviewBlock}>
                          <h4>{group.groupTitle}</h4>
                          {group.fields.map(f => {
                              const value = formData[f.id];
                              if (value === undefined || value === '' || value === false) return null;
                              return <p key={f.id}><strong>{f.label.replace(' (OPCIONAL)', '')}:</strong> {typeof value === 'boolean' ? 'Sim' : String(value)}</p>
                          })}
                      </div>
                  ))}
              </div>
              <div className={styles.summaryTable}>
                  <div className={styles.summaryRow}><span>Serviço:</span><span>R$ {finalPrice.toFixed(2).replace('.', ',')}</span></div>
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Valor Total:</span><span>R$ {finalPrice.toFixed(2).replace('.', ',')}</span></div>
              </div>
              <div className={styles.termsContainer}>
                  <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} required />
                  <label htmlFor="terms">Li e concordo com os <Link href="/termos-e-condicoes" target="_blank">Termos e Condições</Link> do serviço.</label>
              </div>
            </>
        )
    }

    const isProtestoForm = productData.slug === 'certidao-de-protesto' && currentGroup.fields.some(f => f.id === 'estado');

    return (
        <>
            <h3 className={styles.stepTitle}>{currentStep}. {currentGroup.groupTitle}</h3>
            {currentGroup.groupDescription && <p className={styles.stepDescription}>{currentGroup.groupDescription}</p>}

            {isProtestoForm && formData.cidade && (
              <div className={styles.protestoChoiceContainer}>
                <label className={styles.protestoRadioLabel}>
                  <input type="radio" name="protestoChoice" value="individual" checked={protestoChoice === 'individual'} onChange={(e) => setProtestoChoice(e.target.value)} />
                  Pesquisar em um cartório específico
                </label>
                <label className={styles.protestoRadioLabel}>
                  <input type="radio" name="protestoChoice" value="totalidade" checked={protestoChoice === 'totalidade'} onChange={(e) => setProtestoChoice(e.target.value)} disabled={protestoLoading || protestoCount === null} />
                  Pesquisar em todos os cartórios da cidade 
                  {protestoLoading && <span className={styles.protestoCountInfo}> (buscando...)</span>}
                  {protestoCount !== null && <span className={styles.protestoCountInfo}> ({protestoCount} encontrados)</span>}
                </label>
              </div>
            )}
            
            {currentGroup.fields.map(field => {
                if (field.type === 'select') {
                    const options = apiData[field.id + 's'] || [];
                    const isLoading = loading[field.id + 's'];
                    const isCartorioDisabledForProtesto = isProtestoForm && field.id === 'cartorio' && protestoChoice === 'totalidade';
                    const isDisabled = (field.id === 'cidade' && (!formData.estado || isLoading)) || (field.id === 'cartorio' && (!formData.cidade || isLoading || showManualEntry || isCartorioDisabledForProtesto));
                    
                    return (
                        <div key={field.id}>
                            <div className={styles.formGroup}>
                                <label htmlFor={field.id}>{field.label}{field.required && !isCartorioDisabledForProtesto ? <span className={styles.requiredAsterisk}> *</span> : ''}</label>
                                <select name={field.id} value={formData[field.id] || ''} onChange={handleChange} required={!showManualEntry && field.required && !isCartorioDisabledForProtesto} disabled={isDisabled}>
                                    <option value="">Selecione...</option>
                                    {options.map(item => <option key={item.value || item} value={item.label || item}>{item.label || item}</option>)}
                                </select>
                            </div>
                            {field.id === 'cartorio' && (allowCpfSearch || allowManualCartorio) && (
                                <div className={styles.fallbackContainer}>
                                    <p className={styles.fallbackTitle}>Não localizou o cartório na lista?</p>
                                    <div className={styles.fallbackActions}>
                                        {allowCpfSearch && <Link href="/certidoes/pesquisa-de-imveis" className={styles.fallbackButton}>Pesquisar por CPF/CNPJ</Link>}
                                        {allowManualCartorio && <button type="button" className={styles.fallbackButton} onClick={() => setShowManualEntry(s => !s)}>{showManualEntry ? 'Voltar para a lista' : 'Informar Manualmente'}</button>}
                                    </div>
                                    {showManualEntry && (
                                        <div className={styles.manualInputWrapper}>
                                            <p className={styles.manualInputWarning}>A responsabilidade pela informação é sua. Não haverá estorno se os dados estiverem incorretos.</p>
                                            <FormField field={{id: 'cartorio_manual', label: 'Nome e endereço do cartório', type: 'text', placeholder:'Ex: 1º Oficial de Registro de Imóveis de Campinas'}} value={formData.cartorio_manual} onChange={handleChange} />
                                            <div className={styles.formGroup}>
                                                <label htmlFor="file_upload">Anexar documentos (opcional)</label>
                                                <input type="file" id="file_upload" name="anexosCliente" multiple onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png"/>
                                                <div className={styles.fileList}>{uploadedFiles.map((file, index) => (<span key={index}>{file.name}</span>))}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                }
                return <FormField key={field.id} field={field} value={formData[field.id]} onChange={handleChange} checked={!!formData[field.id]} onCheckboxChange={handleChange} isRequired={field.required}/>;
            })}
        </>
    );
  };
  
  const totalSteps = formFields.length + 1;

  return (
    <div id="form-inicio" className={styles.formContainer}>
       {isPlaceholder ? (
        <div className={styles.placeholder}>
            <h3 className={styles.stepTitle}>Serviço em Breve</h3>
            <p>Este pacote de serviços está sendo finalizado. Volte em breve!</p>
        </div>
      ) : (
        <>
            <div className={styles.observationBox}>
              <h4>Legenda de Preenchimento</h4>
              <p><strong><span className={styles.requiredAsterisk}>*</span></strong>: Campo de preenchimento obrigatório para prosseguir.</p>
              <p><strong>(OPCIONAL)</strong>: Campo não obrigatório, mas seu preenchimento acelera a busca e reduz exigências.</p>
            </div>
            
            <StepProgressBar steps={formFields.map(f => f.groupTitle).concat('Revisão')} currentStep={currentStep} />
            <form ref={formRef} onSubmit={handleFinalSubmit}>
                <div className={styles.stepContent}>{renderStepContent()}</div>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <div className={styles.navigation}>
                    {currentStep > 1 && <button type="button" onClick={prevStep} className={styles.prevButton}>Voltar</button>}
                    <div style={{flexGrow: 1}}></div>
                    {currentStep < totalSteps && <button type="button" onClick={handleNextStep} className={styles.nextButton}>Próximo</button>}
                    {currentStep === totalSteps && <button type="submit" disabled={!agreedToTerms} className={styles.submitButton}>Adicionar ao Carrinho</button>}
                </div>
            </form>
        </>
      )}
    </div>
  );
};

export default MultiStepForm;