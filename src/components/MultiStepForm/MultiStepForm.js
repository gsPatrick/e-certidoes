// Salve em: src/components/MultiStepForm/MultiStepForm.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './MultiStepForm.module.css';

// --- ATUALIZAÇÃO: Importando funções de preço ---
import { getPrice, getTaxa } from '@/utils/pricingData';
import { protestoCartorios } from '@/utils/protestoCartorios';

// Importe os validadores
import { isValidCPF } from '@/utils/validators';
import { isValidCNPJ } from '@/utils/validators';

// Importe todos os componentes de etapa
import StepCartorio from './steps/StepCartorio';
import StepTipoCertidao from './steps/StepTipoCertidao';
import StepFormato from './steps/StepFormato';
import StepServicosAdicionais from './steps/StepServicosAdicionais';
import StepRequerente from './steps/StepRequerente';
import StepEndereco from './steps/StepEndereco';
import StepDadosPenhorSafra from './steps/StepDadosPenhorSafra';
import StepLocalizacaoMatricula from './steps/StepLocalizacaoMatricula';
import StepEscritura from './steps/StepEscritura';

// Componentes de etapa para Pesquisas
import StepPesquisaVeiculo from './steps/StepPesquisaVeiculo'; 
import StepPesquisaRouboFurto from './steps/StepPesquisaRouboFurto';
import StepPesquisaProcessos from './steps/StepPesquisaProcessos'; 
import StepPesquisaSintegra from './steps/StepPesquisaSintegra';
import StepPesquisaEscrituras from './steps/StepPesquisaEscrituras';
import StepPesquisaAvancada from './steps/StepPesquisaAvancada';
import StepConfirmacaoLGPD from './steps/StepConfirmacaoLGPD';

// Componentes de etapa para Protesto
import StepProtestoCartorio from './steps/StepProtestoCartorio';
import StepProtestoDados from './steps/StepProtestoDados';

// Importe o Modal de Confirmação
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';

// Importe a Barra de Progresso e a Sidebar
import StepProgressBar from './StepProgressBar';
import SummarySidebar from './SummarySidebar';

// Função auxiliar toSlug para consistência
const toSlug = (str) => {
  if (!str) return '';
  const normalizedStr = str.normalize('NFD');
  const withoutAccents = normalizedStr.replace(/[\u0300-\u036f]/g, '');
  return withoutAccents
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export default function MultiStepForm({ productData }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();

    const getStorageKey = useCallback(() => {
        if (!productData || !productData.category) return null;
        const categorySlug = toSlug(productData.category);
        return `formData_${categorySlug}`;
    }, [productData.category]);

    const [formData, setFormData] = useState(() => {
        if (typeof window === 'undefined') return {};
        const storageKey = getStorageKey();
        if (!storageKey) return {};
        const savedData = window.sessionStorage.getItem(storageKey);
        return savedData ? JSON.parse(savedData) : {
            tipo_certidao: 'Matrícula',
            tipo_pesquisa: 'pessoa',
            tipo_pessoa: 'Pessoa física',
            tempo_pesquisa: '5 anos',
        };
    });

    const [currentStep, setCurrentStep] = useState(() => {
        const stepFromUrl = parseInt(searchParams.get('step'));
        return !isNaN(stepFromUrl) ? stepFromUrl - 1 : 0;
    });
    
    const [finalPrice, setFinalPrice] = useState(productData.price);
    const [formFlow, setFormFlow] = useState([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        let newFlow = [];
        const slug = productData.slug;
        const category = productData.category;
        const requerenteStep = { id: 'requerente', title: 'Identificação', Component: StepRequerente };
        const enderecoStep = { id: 'endereco', title: 'Endereço', Component: StepEndereco };
        const servicosAdicionaisStep = { id: 'servicosAdicionais', title: 'Serviços Adicionais', Component: StepServicosAdicionais };
        const confirmacaoLgpdStep = { id: 'confirmacaoLgpd', title: 'Termos de Uso', Component: StepConfirmacaoLGPD };

        if (slug === toSlug('Certidão de Protesto')) {
            const middleFlow = [];
            middleFlow.push({ id: 'formato', title: 'Formato', Component: StepFormato });
            middleFlow.push(servicosAdicionaisStep);
            if (formData.formato === 'Certidão em papel') {
                middleFlow.push(enderecoStep);
            }
            newFlow = [
                { id: 'protestoCartorio', title: 'Localização', Component: StepProtestoCartorio },
                { id: 'protestoDados', title: 'Dados da Certidão', Component: StepProtestoDados },
                ...middleFlow,
                requerenteStep,
            ];
        } else if (category === 'Pesquisa' || (category === 'Cartório de Registro de Imóveis' && productData.pesquisaType) || (category === 'Tabelionato de Notas (Escrituras)' && productData.skipValidationAndTerms)) {
            let primeiraEtapa = {};
            if (productData.pesquisaType === 'previa' || productData.pesquisaType === 'qualificada') {
                primeiraEtapa = { id: 'dadosPesquisaAvancada', title: 'Dados da Pesquisa', Component: StepPesquisaAvancada };
            } else {
                switch(slug) {
                    case toSlug('Pesquisa Completa de Veículo'): case toSlug('Pesquisa Leilão de Veículo'): case toSlug('Pesquisa Gravame de Veículo'):
                        primeiraEtapa = { id: 'dadosVeiculo', title: 'Dados do Veículo', Component: StepPesquisaVeiculo }; break;
                    case toSlug('Histórico de Roubo ou Furto de Veículo'):
                        primeiraEtapa = { id: 'dadosRouboFurto', title: 'Dados da Pesquisa', Component: StepPesquisaRouboFurto }; break;
                    case toSlug('Pesquisa Processos Judiciais e Administrativos'): case toSlug('Pesquisa Telefone e Endereço pelo CPF CNPJ'):
                        primeiraEtapa = { id: 'dadosProcessos', title: 'Dados da Pesquisa', Component: StepPesquisaProcessos }; break;
                    case toSlug('Pesquisa Sintegra Estadual'):
                        primeiraEtapa = { id: 'dadosSintegra', title: 'Dados da Pesquisa', Component: StepPesquisaSintegra }; break;
                    case toSlug('Pesquisa Escrituras e Procurações por CPF CNPJ'):
                         primeiraEtapa = { id: 'dadosEscrituras', title: 'Dados da Pesquisa', Component: StepPesquisaEscrituras }; break;
                }
            }
            if (productData.skipValidationAndTerms) {
                newFlow = [primeiraEtapa, requerenteStep];
            } else {
                newFlow = [primeiraEtapa, requerenteStep, confirmacaoLgpdStep];
            }
        } else if (category === 'Tabelionato de Notas (Escrituras)') {
            newFlow = [
                { id: 'cartorio', title: 'Localização', Component: StepCartorio },
                { id: 'dadosEscritura', title: 'Dados da Certidão', Component: StepEscritura },
                { id: 'formato', title: 'Formato', Component: StepFormato },
                servicosAdicionaisStep,
                { id: 'endereco', title: 'Endereço', Component: StepEndereco },
                requerenteStep,
            ];
        } else if (slug === 'visualizacao-de-matricula') {
            newFlow = [ { id: 'localizacaoMatricula', title: 'Localização', Component: StepLocalizacaoMatricula }, requerenteStep ];
        } else if (slug === 'certidao-de-penhor-e-safra') {
            newFlow = [
                { id: 'cartorio', title: 'Localização', Component: StepCartorio },
                { id: 'dadosPenhorSafra', title: 'Dados da Certidão', Component: StepDadosPenhorSafra },
                servicosAdicionaisStep,
                enderecoStep,
                requerenteStep
            ];
        } else {
            const baseFlow = [];
            if(category === 'Cartório de Registro Civil') {
                 baseFlow.push({ id: 'cartorio', title: 'Localização', Component: StepCartorio });
                 baseFlow.push({ id: 'dadosCertidaoCivil', title: 'Dados da Certidão', Component: StepTipoCertidao });
            } else { 
                 baseFlow.push({ id: 'cartorio', title: 'Localização', Component: StepCartorio });
                 baseFlow.push({ id: 'tipoCertidao', title: 'Dados da Certidão', Component: StepTipoCertidao });
            }
            let middleFlow = [];
            middleFlow.push({ id: 'formato', title: 'Formato', Component: StepFormato });
            middleFlow.push(servicosAdicionaisStep);
            if (formData.formato === 'Certidão em papel') {
                middleFlow.push(enderecoStep);
            }
            middleFlow.push(requerenteStep);
            newFlow = [...baseFlow, ...middleFlow];
        }
        setFormFlow(newFlow);
        if (currentStep >= newFlow.length) { setCurrentStep(newFlow.length - 1); }
    }, [productData.slug, productData.category, productData.pesquisaType, productData.skipValidationAndTerms, formData.formato, currentStep]);

    useEffect(() => {
        const stepFromUrl = parseInt(searchParams.get('step'));
        const stepIndex = !isNaN(stepFromUrl) ? stepFromUrl - 1 : 0;
        if (stepIndex !== currentStep && stepIndex < formFlow.length) {
            setCurrentStep(stepIndex);
        }
    }, [searchParams, currentStep, formFlow.length]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storageKey = getStorageKey();
            if (storageKey) {
                window.sessionStorage.setItem(storageKey, JSON.stringify(formData));
            }
        }
    }, [formData, getStorageKey]);

    // ====================================================================================
    // === INÍCIO DA LÓGICA DE CÁLCULO DE PREÇO COMPLETAMENTE ATUALIZADA ===
    // ====================================================================================
    useEffect(() => {
        let basePrice = productData.price; // Começa com o preço padrão (ou null)
        const { category, slug } = productData;
        const { estado, formato, tipo_certidao } = formData;

        // 1. DETERMINA O PREÇO BASE DINÂMICO
        if (estado && (category === 'Cartório de Registro Civil' || category === 'Tabelionato de Notas (Escrituras)')) {
            const priceByState = getPrice('tabelionato_registro_civil', 'estado', estado, 'valor');
            if (priceByState) {
                basePrice = priceByState;
            }
        } else if (slug === toSlug('Certidão de Protesto')) {
            const { cidade, todos_cartorios_protesto } = formData;
            const precoBaseProtesto = getPrice('protesto_por_estado', 'estado', estado, 'valor');
            basePrice = precoBaseProtesto || productData.price; // Usa o preço do estado ou o fallback

            if (todos_cartorios_protesto && protestoCartorios[estado] && protestoCartorios[estado][cidade]) {
                const numCartorios = protestoCartorios[estado][cidade].length;
                if (numCartorios > 1) {
                    basePrice = (precoBaseProtesto || 0) * numCartorios;
                }
            }
        }
        
        let newPrice = basePrice || 0; // Garante que newPrice seja um número

        // 2. SOMA OS CUSTOS DOS SERVIÇOS ADICIONAIS
        const CUSTO_PAPEL = getTaxa('custo_papel') || 0;
        const CUSTO_APOSTILAMENTO = getTaxa('apostilamento') || 0;
        const CUSTO_AR = getTaxa('aviso_recebimento') || 0;
        const ACRESCIMO_CONDOMINIO = getTaxa('acrescimo_condominio') || 0;
        
        // Custos que ainda não foram padronizados globalmente
        const CUSTO_RECONHECIMENTO_FIRMA = 25.00;
        const CUSTO_TEOR_TRANSCRICAO = 30.00; 
        const CUSTO_TEOR_REPROGRAFICA = 40.00;

        if (formato === 'Certidão em papel') newPrice += CUSTO_PAPEL;
        if (formato === 'Certidão Reprográfica') newPrice += 20.00;

        if (formData.apostilamento_digital || formData.apostilamento_fisico || formData.apostilamento) newPrice += CUSTO_APOSTILAMENTO;
        if (formData.reconhecimento_firma) newPrice += CUSTO_RECONHECIMENTO_FIRMA;
        if (formData.aviso_recebimento) newPrice += CUSTO_AR;
        
        if (formData.inteiro_teor) {
            newPrice += formData.tipo_inteiro_teor === 'Reprográfica' ? CUSTO_TEOR_REPROGRAFICA : CUSTO_TEOR_TRANSCRICAO;
        }

        if (formData.localizar_pra_mim) newPrice += 99.90;
        
        if (tipo_certidao === 'Condomínio') {
            newPrice += ACRESCIMO_CONDOMINIO;
        }

        if (slug === toSlug('Certidão de Protesto') && formData.tempo_pesquisa === '10 anos') {
            newPrice += 50.00;
        }

        setFinalPrice(newPrice);
    }, [formData, productData]);
    // ====================================================================================
    // === FIM DA LÓGICA DE CÁLCULO DE PREÇO ===
    // ====================================================================================


    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
        if (validationError) setValidationError('');
    }, [validationError, setFormData, setValidationError]);

    const navigateToStep = (stepIndex) => {
        const newStep = stepIndex + 1;
        router.push(`?step=${newStep}`, { scroll: false });
        setCurrentStep(stepIndex);
    };

    const handleNextStep = () => {
      const form = document.querySelector('form');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const currentStepId = formFlow[currentStep]?.id;
      setValidationError('');

      if (currentStepId === 'dadosVeiculo' && !formData.placa_chassi) { setValidationError('O campo Placa ou Chassi é obrigatório.'); return; }
      if (currentStepId === 'dadosRouboFurto' && !formData.placa && !formData.renavam) { setValidationError('Preencha pelo menos um campo (Placa ou Renavam).'); return; }
      if (currentStepId === 'dadosSintegra' && !formData.cnpj && !formData.inscricao_estadual && !formData.nire) { setValidationError('Preencha pelo menos um campo (CNPJ, Inscrição Estadual ou NIRE).'); return; }

      if (['dadosPesquisaAvancada', 'dadosProcessos', 'dadosEscrituras', 'protestoDados'].includes(currentStepId)) {
        const doc = formData.cpf_cnpj || formData.cpf_cnpj_pesquisa || '';
        const cleanedDoc = doc.replace(/\D/g, '');
        if (cleanedDoc.length > 0 && cleanedDoc.length < 11) { setValidationError('Documento incompleto.'); return; }
        if (cleanedDoc.length === 11 && !isValidCPF(doc)) { setValidationError('CPF inválido. Por favor, verifique.'); return; }
        if (cleanedDoc.length > 11 && cleanedDoc.length < 14) { setValidationError('Documento incompleto.'); return; }
        if (cleanedDoc.length === 14 && !isValidCNPJ(doc)) { setValidationError('CNPJ inválido. Por favor, verifique.'); return; }
      }
      
      if (currentStepId === 'dadosEscritura' && !isValidCPF(formData.cpf)) { setValidationError('CPF/CNPJ inválido. Por favor, verifique.'); return; }
      if (currentStepId === 'tipoCertidao') {
        const tipoCertidao = formData.tipo_certidao;
        if (tipoCertidao === 'Pacto Antenupcial' && (!isValidCPF(formData.pacto_conjuge1_cpf) || !isValidCPF(formData.pacto_conjuge2_cpf))) { setValidationError('Um ou mais CPFs são inválidos. Por favor, verifique.'); return; }
        if (tipoCertidao === 'Livro 3 - Garantias' && !isValidCPF(formData.livro3g_cpf)) { setValidationError('CPF inválido. Por favor, verifique.'); return; }
        if (tipoCertidao === 'Livro 3 - Auxiliar' && !isValidCPF(formData.livro3a_cpf)) { setValidationError('CPF inválido. Por favor, verifique.'); return; }
      }
      
      if (currentStepId === 'dadosPenhorSafra') {
        const tipoPessoa = formData.tipo_pessoa || 'fisica';
        if (tipoPessoa === 'fisica' && !isValidCPF(formData.cpf)) { setValidationError('CPF inválido. Por favor, verifique.'); return; }
        if (tipoPessoa === 'juridica' && !isValidCNPJ(formData.cnpj)) { setValidationError('CNPJ inválido. Por favor, verifique.'); return; }
      }
      if (currentStepId === 'requerente' && !isValidCPF(formData.requerente_cpf)) { setValidationError('CPF do solicitante é inválido. Por favor, verifique.'); return; }
      const nextStepIndex = Math.min(currentStep + 1, formFlow.length);
      if (nextStepIndex < formFlow.length) { navigateToStep(nextStepIndex); window.scrollTo(0, 0); }
    };
    
    const handlePrevStep = () => { const prevStepIndex = Math.max(currentStep - 1, 0); navigateToStep(prevStepIndex); };
    const goToStep = (stepIndex) => { if (stepIndex < currentStep) { navigateToStep(stepIndex); } };
    
    const handleOpenConfirmation = (e) => {
        e.preventDefault();
        const form = document.querySelector('form');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        if (formFlow[currentStep]?.id === 'requerente' && !isValidCPF(formData.requerente_cpf)) { setValidationError('CPF do solicitante é inválido. Por favor, verifique.'); return; }
        setIsConfirmModalOpen(true);
    };

    const handleFinalConfirmAndSubmit = () => {
        setIsConfirmModalOpen(false);
        addToCart({ ...productData, price: finalPrice, formData });
        if (typeof window !== 'undefined') {
            const storageKey = getStorageKey();
            if (storageKey) {
                window.sessionStorage.removeItem(storageKey);
            }
        }
        router.push('/finalizar-compra');
    };

    const renderCurrentStep = () => {
        if (formFlow.length === 0 || !formFlow[currentStep]) return <div>Carregando...</div>;
        const { Component } = formFlow[currentStep];
        return <Component formData={formData} handleChange={handleChange} productData={productData} error={validationError} />;
    };

    const isLastStep = currentStep === formFlow.length - 1;

    return (
        <>
            <div className={styles.formLayout}>
                <div className={styles.mainContent}>
                    <StepProgressBar steps={formFlow} currentStep={currentStep} />
                    <div className={styles.formContainer}>
                        <form onSubmit={(e) => { isLastStep ? handleOpenConfirmation(e) : e.preventDefault() }} noValidate>
                            {renderCurrentStep()}
                            <div className={styles.navigation}>
                                {currentStep > 0 && <button type="button" onClick={handlePrevStep} className={styles.prevButton}>Voltar</button>}
                                
                                {!isLastStep 
                                    ? <button type="button" onClick={handleNextStep} className={styles.nextButton}>Continuar</button>
                                    : <button type="submit" className={styles.submitButton}>Ir para o Pagamento</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
                <div className={styles.sidebarContent}>
                    <SummarySidebar 
                        productData={productData}
                        formData={formData}
                        finalPrice={finalPrice}
                        currentStep={currentStep}
                        formSteps={formFlow.map(f => f.title)}
                        goToStep={goToStep}
                    />
                </div>
            </div>
            {isConfirmModalOpen && (
                <ConfirmationModal
                    orderDetails={{ item: { ...productData, formData }, total: finalPrice }}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleFinalConfirmAndSubmit}
                />
            )}
        </>
    );
}