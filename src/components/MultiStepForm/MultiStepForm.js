// Salve em: src/components/MultiStepForm/MultiStepForm.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './MultiStepForm.module.css';

import { getPrice, getTaxa } from '@/utils/pricingData';
import { protestoCartorios } from '@/utils/protestoCartorios';
import { isValidCPF, isValidCNPJ } from '@/utils/validators';

// Componentes de Etapa Padrão
import StepCartorio from './steps/StepCartorio';
import StepTipoCertidao from './steps/StepTipoCertidao';
import StepFormato from './steps/StepFormato';
import StepServicosAdicionais from './steps/StepServicosAdicionais';
import StepRequerente from './steps/StepRequerente';
import StepEndereco from './steps/StepEndereco';
import StepDadosPenhorSafra from './steps/StepDadosPenhorSafra';
import StepLocalizacaoMatricula from './steps/StepLocalizacaoMatricula';
import StepEscritura from './steps/StepEscritura';

// Componentes de Etapa para Pesquisas
import StepPesquisaVeiculo from './steps/StepPesquisaVeiculo'; 
import StepPesquisaRouboFurto from './steps/StepPesquisaRouboFurto';
import StepPesquisaProcessos from './steps/StepPesquisaProcessos'; 
import StepPesquisaSintegra from './steps/StepPesquisaSintegra';
import StepPesquisaEscrituras from './steps/StepPesquisaEscrituras';
import StepPesquisaAvancada from './steps/StepPesquisaAvancada';
import StepConfirmacaoLGPD from './steps/StepConfirmacaoLGPD';

// Componentes de Etapa para Protesto
import StepProtestoCartorio from './steps/StepProtestoCartorio';
import StepProtestoDados from './steps/StepProtestoDados';

// Componentes de Etapa para Certidões Governamentais
import StepDadosCertidaoGov from './steps/StepDadosCertidaoGov';
import StepConsultaJuridica from './steps/StepConsultaJuridica';

// Componentes Auxiliares
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import StepProgressBar from './StepProgressBar';
import SummarySidebar from './SummarySidebar';

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
        if (!productData || !productData.slug) return null;
        return `formData_${productData.slug}`;
    }, [productData.slug]);

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
            estado_cartorio: '',
            cidade_cartorio: '',
            estado_entrega: '',
            cidade_entrega: '',
            estado_matricula: '',
            cidade_matricula: '',
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
    const [attachedFile, setAttachedFile] = useState(null);

    useEffect(() => {
        let newFlow = [];
        const { category, slug, pesquisaType, skipValidationAndTerms } = productData;
        const { formato } = formData;

        // Componentes de etapa reutilizáveis
        const formatoStep = { id: 'formato', title: 'Formato', Component: StepFormato };
        const servicosAdicionaisStep = { id: 'servicosAdicionais', title: 'Serviços Adicionais', Component: StepServicosAdicionais };
        const enderecoStep = { id: 'endereco', title: 'Endereço', Component: StepEndereco };
        const requerenteStep = { id: 'requerente', title: 'Identificação', Component: StepRequerente };
        const confirmacaoLgpdStep = { id: 'confirmacaoLgpd', title: 'Termos de Uso', Component: StepConfirmacaoLGPD };

        const isGovCertificate = category === 'Certidões Federais e Estaduais' || category === 'Certidões Municipais';
        const isPapel = formato === 'Certidão em papel' || formato === 'Certidão Transcrita' || formato === 'Certidão Reprográfica';

        if (slug === toSlug('Consulta Jurídica')) {
            newFlow = [
                { id: 'dadosConsultaJuridica', title: 'Dados para Contato', Component: StepConsultaJuridica },
            ];
        } else if (isGovCertificate) {
            const baseFlow = [
                { id: 'dadosCertidaoGov', title: 'Dados da Certidão', Component: StepDadosCertidaoGov },
                formatoStep
            ];
            newFlow = isPapel ? [...baseFlow, servicosAdicionaisStep, enderecoStep, requerenteStep] : [...baseFlow, servicosAdicionaisStep, requerenteStep];
        } else if (slug === toSlug('Certidão de Protesto')) {
            const middleFlow = [formatoStep, servicosAdicionaisStep];
            if (isPapel) middleFlow.push(enderecoStep);
            newFlow = [
                { id: 'protestoCartorio', title: 'Localização', Component: StepProtestoCartorio },
                { id: 'protestoDados', title: 'Dados da Certidão', Component: StepProtestoDados },
                ...middleFlow,
                requerenteStep,
            ];
        } else if (category === 'Pesquisa' || (category === 'Cartório de Registro de Imóveis' && pesquisaType) || (category === 'Tabelionato de Notas (Escrituras)' && skipValidationAndTerms)) {
            let primeiraEtapa = {};
            if (pesquisaType === 'previa' || pesquisaType === 'qualificada') {
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
            newFlow = skipValidationAndTerms ? [primeiraEtapa, requerenteStep] : [primeiraEtapa, requerenteStep, confirmacaoLgpdStep];
        } else if (category === 'Tabelionato de Notas (Escrituras)') {
            let middleFlow = [formatoStep, servicosAdicionaisStep];
             if (isPapel) middleFlow.push(enderecoStep);
            middleFlow.push(requerenteStep);
            newFlow = [
                { id: 'cartorio', title: 'Localização', Component: StepCartorio },
                { id: 'dadosEscritura', title: 'Dados da Certidão', Component: StepEscritura },
                ...middleFlow,
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
        } else { // Fluxo Padrão (Registro de Imóveis, Registro Civil)
            const baseFlow = [{ id: 'cartorio', title: 'Localização', Component: StepCartorio }, { id: category === 'Cartório de Registro Civil' ? 'dadosCertidaoCivil' : 'tipoCertidao', title: 'Dados da Certidão', Component: StepTipoCertidao }];
            let middleFlow = [formatoStep, servicosAdicionaisStep];
            if (isPapel) middleFlow.push(enderecoStep);
            middleFlow.push(requerenteStep);
            newFlow = [...baseFlow, ...middleFlow];
        }
        setFormFlow(newFlow);
        if (currentStep >= newFlow.length) setCurrentStep(newFlow.length - 1);
    }, [productData, formData.formato, currentStep]);

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
            if (storageKey) window.sessionStorage.setItem(storageKey, JSON.stringify(formData));
        }
    }, [formData, getStorageKey]);

    useEffect(() => {
        let basePrice = productData.price;
        const { category, slug, pesquisaType } = productData;
        const { estado_cartorio, cidade_cartorio, estado_matricula, estado_pesquisa, formato, tipo_certidao, todos_cartorios_protesto, tempo_pesquisa } = formData;
        let multiplicadorProtesto = 1;
        
        if (slug === toSlug('Visualização de Matrícula')) {
            basePrice = getPrice('registro_imoveis_pesquisas', 'estado', estado_matricula, 'visualizacao_matricula') || basePrice;
        } else if (pesquisaType === 'previa') {
            basePrice = getPrice('registro_imoveis_pesquisas', 'estado', estado_pesquisa, 'pesquisa_previa') || basePrice;
        } else if (pesquisaType === 'qualificada') {
            basePrice = getPrice('registro_imoveis_pesquisas', 'estado', estado_pesquisa, 'pesquisa_qualificada') || basePrice;
        } else if (estado_cartorio && (category === 'Cartório de Registro Civil' || category === 'Tabelionato de Notas (Escrituras)')) {
            basePrice = getPrice('tabelionato_registro_civil', 'estado', estado_cartorio, 'valor') || basePrice;
        } else if (estado_cartorio && category === 'Cartório de Registro de Imóveis') {
            if (['certidao-de-imovel', 'certidao-de-matricula-com-onus-e-acoes'].includes(slug)) {
                basePrice = getPrice('registro_imoveis_pesquisas', 'estado', estado_cartorio, 'certidao_imovel') || basePrice;
            } else if (slug === 'certidao-de-penhor-e-safra') {
                basePrice = getPrice('custas_cartorios', 'estado', estado_cartorio, 'demais_certidoes') || productData.price;
            }
        } else if (slug === toSlug('Certidão de Protesto')) {
            basePrice = getPrice('protesto_por_estado', 'estado', estado_cartorio, 'valor') || productData.price;
            if (todos_cartorios_protesto && protestoCartorios[estado_cartorio]?.[cidade_cartorio]?.length > 1) {
                multiplicadorProtesto = protestoCartorios[estado_cartorio][cidade_cartorio].length;
            }
        }
        
        let newPrice = (basePrice || 0) * multiplicadorProtesto;
        const CUSTO_PAPEL = getTaxa('custo_papel') || 0;
        const CUSTO_APOSTILAMENTO = getTaxa('apostilamento') || 0;
        const CUSTO_AR = getTaxa('aviso_recebimento') || 0;
        const ACRESCIMO_CONDOMINIO = getTaxa('acrescimo_condominio') || 0;
        const CUSTO_SEDEX = getTaxa('sedex') || 0;
        const CUSTO_TEOR_TRANSCRICAO = 30.00; 
        const CUSTO_TEOR_REPROGRAFICA = 40.00;

        const isPapel = formato === 'Certidão em papel' || formato === 'Certidão Transcrita' || formato === 'Certidão Reprográfica';

        if (isPapel) newPrice += CUSTO_PAPEL;
        if (formData.apostilamento_digital || formData.apostilamento_fisico || formData.apostilamento) newPrice += CUSTO_APOSTILAMENTO;
        if (formData.aviso_recebimento) newPrice += CUSTO_AR;
        if (formData.sedex) newPrice += CUSTO_SEDEX;
        if (formData.inteiro_teor) newPrice += formData.tipo_inteiro_teor === 'Reprográfica' ? CUSTO_TEOR_REPROGRAFICA : CUSTO_TEOR_TRANSCRICAO;
        if (formData.localizar_pra_mim) newPrice += 99.90;
        if (tipo_certidao === 'Condomínio') newPrice += ACRESCIMO_CONDOMINIO;
        if (slug === toSlug('Certidão de Protesto') && tempo_pesquisa === '10 anos') newPrice += 50.00;

        setFinalPrice(newPrice);
    }, [formData, productData]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (validationError) setValidationError('');
    }, [validationError]);

    const navigateToStep = (stepIndex) => {
        router.push(`?step=${stepIndex + 1}`, { scroll: false });
        setCurrentStep(stepIndex);
    };

    const handleNextStep = () => {
        const form = document.querySelector('form');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        setValidationError('');
        const doc = formData.cpf_cnpj || formData.cpf_cnpj_pesquisa || formData.cpf || formData.requerente_cpf || formData.cpf_cnpj_escritura || formData.titulo_ou_cpf;
        if (doc) {
            const cleanedDoc = doc.replace(/\D/g, '');
            if (cleanedDoc.length > 0 && cleanedDoc.length !== 11 && cleanedDoc.length !== 14) { setValidationError('CPF ou CNPJ inválido.'); return; }
            if (cleanedDoc.length === 11 && !isValidCPF(doc)) { setValidationError('CPF inválido. Por favor, verifique.'); return; }
            if (cleanedDoc.length === 14 && !isValidCNPJ(doc)) { setValidationError('CNPJ inválido. Por favor, verifique.'); return; }
        }
        const nextStepIndex = Math.min(currentStep + 1, formFlow.length);
        if (nextStepIndex < formFlow.length) { navigateToStep(nextStepIndex); window.scrollTo(0, 0); }
    };
    
    const handleOpenConfirmation = (e) => {
        e.preventDefault();
        const form = document.querySelector('form');
        if (!form.checkValidity()) { form.reportValidity(); return; }
        if (formFlow[currentStep]?.id === 'requerente' && !isValidCPF(formData.requerente_cpf)) { setValidationError('CPF do solicitante é inválido.'); return; }
        setIsConfirmModalOpen(true);
    };

    const handleFinalConfirmAndSubmit = () => {
        setIsConfirmModalOpen(false);

        const finalFormData = { ...formData };
        delete finalFormData.tipo_pesquisa; 
        finalFormData.tipo_certidao = productData.name;

        addToCart({ 
            ...productData, 
            price: finalPrice, 
            formData: finalFormData,
            attachedFile 
        });
        
        if (typeof window !== 'undefined') {
            const storageKey = getStorageKey();
            if (storageKey) window.sessionStorage.removeItem(storageKey);
        }
        
        router.push('/finalizar-compra');
    };

    const renderCurrentStep = () => {
        if (formFlow.length === 0 || !formFlow[currentStep]) return <div>Carregando...</div>;
        const { Component } = formFlow[currentStep];
        if (['cartorio', 'protestoCartorio'].includes(formFlow[currentStep].id)) {
            return <Component formData={formData} handleChange={handleChange} productData={productData} error={validationError} onFileSelect={setAttachedFile} onFileRemove={() => setAttachedFile(null)} />;
        }
        return <Component formData={formData} handleChange={handleChange} productData={productData} error={validationError} />;
    };
    
    const isLastStep = currentStep === formFlow.length - 1;

    return (
        <>
            <div className={styles.formLayout}>
                <div className={styles.mainContent}>
                    <StepProgressBar steps={formFlow} currentStep={currentStep} />
                    <div className={styles.formContainer}>
                        <form onSubmit={(e) => { isLastStep ? handleOpenConfirmation(e) : e.preventDefault(); }} noValidate>
                            {renderCurrentStep()}
                            <div className={styles.navigation}>
                                {currentStep > 0 && <button type="button" onClick={() => navigateToStep(currentStep - 1)} className={styles.prevButton}>Voltar</button>}
                                {!isLastStep ? <button type="button" onClick={handleNextStep} className={styles.nextButton}>Continuar</button> : <button type="submit" className={styles.submitButton}>Adicionar ao Carrinho</button>}
                            </div>
                        </form>
                    </div>
                </div>
                <div className={styles.sidebarContent}>
                    <SummarySidebar productData={productData} formData={formData} finalPrice={finalPrice} currentStep={currentStep} formSteps={formFlow.map(f => f.title)} goToStep={navigateToStep} />
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