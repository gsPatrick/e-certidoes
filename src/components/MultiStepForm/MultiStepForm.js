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
import StepPesquisaEscrituras from './steps/StepPesquisaEscrituras'; // Corrigido o caminho
import StepPesquisaAvancada from './steps/StepPesquisaAvancada';
import StepConfirmacaoLGPD from './steps/StepConfirmacaoLGPD';

// Componentes de Etapa para Protesto
import StepProtestoCartorio from './steps/StepProtestoCartorio';
import StepProtestoDados from './steps/StepProtestoDados';

// --- NOVOS COMPONENTES DE ETAPA ---
import StepFederalDados from './steps/StepFederalDados';
import StepEstadualLocalizacao from './steps/StepEstadualLocalizacao';
import StepEstadualDados from './steps/StepEstadualDados';
import StepMunicipalDados from './steps/StepMunicipalDados';
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

// --- ARRAYS PARA IDENTIFICAR O TIPO DE CERTIDÃO ---
const FEDERAL_KEYWORDS = ['TRF', 'STF', 'STJ', 'STM', 'MPF', 'TST', 'MT', 'FGTS', 'CAFIR', 'ITR', 'IBAMA', 'CNTNIDA', 'TSE', 'CNJ', 'TCU', 'Antecedentes Criminais'];
const ESTADUAL_KEYWORDS = ['TJ', 'MPE', 'TRT', 'PGE', 'CEAT', 'Ambientais', 'Tributários Estaduais'];

export default function MultiStepForm({ productData }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();

    const getStorageKey = useCallback(() => {
        if (!productData || !productData.slug) return null; // Usar slug para maior especificidade
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
            // Inicialização dos novos campos de localização
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

    useEffect(() => {
        let newFlow = [];
        const { slug, category, name, pesquisaType, skipValidationAndTerms } = productData;
        const { formato } = formData;

        // Componentes de etapa reutilizáveis
        const formatoStep = { id: 'formato', title: 'Formato', Component: StepFormato };
        const servicosAdicionaisStep = { id: 'servicosAdicionais', title: 'Serviços Adicionais', Component: StepServicosAdicionais };
        const enderecoStep = { id: 'endereco', title: 'Endereço', Component: StepEndereco };
        const requerenteStep = { id: 'requerente', title: 'Identificação', Component: StepRequerente };
        const confirmacaoLgpdStep = { id: 'confirmacaoLgpd', title: 'Termos de Uso', Component: StepConfirmacaoLGPD };

        // --- LÓGICA DE FLUXO ---
        const isFederal = category === 'Certidões Federais e Estaduais' && FEDERAL_KEYWORDS.some(kw => name.includes(kw));
        const isEstadual = category === 'Certidões Federais e Estaduais' && ESTADUAL_KEYWORDS.some(kw => name.includes(kw));
        const isMunicipal = category === 'Certidões Municipais';

        if (slug === toSlug('Consulta Jurídica')) {
            newFlow = [
                { id: 'dadosConsultaJuridica', title: 'Dados para Contato', Component: StepConsultaJuridica },
            ];
        } else if (isFederal) {
            const baseFlow = [
                { id: 'dadosCertidaoFederal', title: 'Dados da Certidão', Component: StepFederalDados },
                formatoStep
            ];
            if (formato === 'Certidão em papel') {
                newFlow = [...baseFlow, servicosAdicionaisStep, enderecoStep, requerenteStep];
            } else { // Digital
                newFlow = [...baseFlow, requerenteStep];
            }
        } else if (isEstadual) {
            const baseFlow = [
                { id: 'localizacaoEstadual', title: 'Localização', Component: StepEstadualLocalizacao },
                { id: 'dadosCertidaoEstadual', title: 'Dados da Certidão', Component: StepEstadualDados },
                formatoStep
            ];
            if (formato === 'Certidão em papel') {
                newFlow = [...baseFlow, servicosAdicionaisStep, enderecoStep, requerenteStep];
            } else { // Digital
                newFlow = [...baseFlow, requerenteStep];
            }
        } else if (isMunicipal) {
            const baseFlow = [
                { id: 'dadosCertidaoMunicipal', title: 'Dados da Certidão', Component: StepMunicipalDados },
                formatoStep
            ];
            if (formato === 'Certidão em papel') {
                newFlow = [...baseFlow, servicosAdicionaisStep, enderecoStep, requerenteStep];
            } else { // Digital
                newFlow = [...baseFlow, requerenteStep];
            }
        } else if (slug === toSlug('Certidão de Protesto')) {
            const middleFlow = [formatoStep, servicosAdicionaisStep];
            if (formato === 'Certidão em papel') {
                middleFlow.push(enderecoStep);
            }
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
            if (skipValidationAndTerms) {
                newFlow = [primeiraEtapa, requerenteStep];
            } else {
                newFlow = [primeiraEtapa, requerenteStep, confirmacaoLgpdStep];
            }
        } else if (category === 'Tabelionato de Notas (Escrituras)') {
            let middleFlow = [formatoStep, servicosAdicionaisStep];
             if (formato === 'Certidão em papel') {
                middleFlow.push(enderecoStep);
            }
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
            const baseFlow = [];
            if(category === 'Cartório de Registro Civil') {
                 baseFlow.push({ id: 'cartorio', title: 'Localização', Component: StepCartorio });
                 baseFlow.push({ id: 'dadosCertidaoCivil', title: 'Dados da Certidão', Component: StepTipoCertidao });
            } else { // Cartório de Registro de Imóveis
                 baseFlow.push({ id: 'cartorio', title: 'Localização', Component: StepCartorio });
                 baseFlow.push({ id: 'tipoCertidao', title: 'Dados da Certidão', Component: StepTipoCertidao });
            }
            let middleFlow = [formatoStep, servicosAdicionaisStep];
            if (formato === 'Certidão em papel') {
                middleFlow.push(enderecoStep);
            }
            middleFlow.push(requerenteStep);
            newFlow = [...baseFlow, ...middleFlow];
        }

        setFormFlow(newFlow);
        if (currentStep >= newFlow.length) { setCurrentStep(newFlow.length - 1); }
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
            if (storageKey) {
                window.sessionStorage.setItem(storageKey, JSON.stringify(formData));
            }
        }
    }, [formData, getStorageKey]);

    useEffect(() => {
        let basePrice = productData.price;
        const { category, slug, pesquisaType } = productData; // Adicionado pesquisaType
        const { 
            estado_cartorio, cidade_cartorio, // Localização do Cartório
            estado_entrega, cidade_entrega, // Endereço de Entrega
            estado_matricula, cidade_matricula, // Localização da Matrícula
            formato, tipo_certidao, todos_cartorios_protesto, tempo_pesquisa 
        } = formData;
        let multiplicadorProtesto = 1;

        // Lógica de preço para Registro Civil e Tabelionato de Notas
        if (estado_cartorio && (category === 'Cartório de Registro Civil' || category === 'Tabelionato de Notas (Escrituras)')) {
            const priceByState = getPrice('tabelionato_registro_civil', 'estado', estado_cartorio, 'valor');
            if (priceByState) {
                basePrice = priceByState;
            }
        } 
        // NOVA Lógica de preço para Cartório de Registro de Imóveis (incluindo Penhor e Safra)
        else if (estado_cartorio && category === 'Cartório de Registro de Imóveis') {
            if (slug === toSlug('Certidão de Imóvel') || slug === toSlug('Certidão de Matrícula com Ônus e Ações')) {
                const priceByState = getPrice('registro_imoveis_pesquisas', 'estado', estado_cartorio, 'certidao_imovel');
                if (priceByState) basePrice = priceByState;
            } else if (slug === toSlug('Visualização de Matrícula')) {
                const priceByState = getPrice('registro_imoveis_pesquisas', 'estado', estado_matricula, 'visualizacao_matricula');
                if (priceByState) basePrice = priceByState;
            } else if (slug === toSlug('Certidão de Penhor e Safra')) {
                // Usar 'demais_certidoes' ou um valor padrão se não houver um específico
                const priceByState = getPrice('custas_cartorios', 'estado', estado_cartorio, 'demais_certidoes');
                if (priceByState) basePrice = priceByState;
                else if (productData.price) basePrice = productData.price; // Fallback para o preço base do produto
            }
            // Adicionar mais condições para outros tipos de certidões de imóveis se necessário
        }
        // Lógica de preço para Protesto
        else if (slug === toSlug('Certidão de Protesto')) {
            const precoBaseProtesto = getPrice('protesto_por_estado', 'estado', estado_cartorio, 'valor');
            basePrice = precoBaseProtesto || productData.price;
            
            if (todos_cartorios_protesto && protestoCartorios[estado_cartorio] && protestoCartorios[estado_cartorio][cidade_cartorio]) {
                const numCartorios = protestoCartorios[estado_cartorio][cidade_cartorio].length;
                if (numCartorios > 1) {
                    multiplicadorProtesto = numCartorios;
                }
            }
        }
        // Lógica de preço para Pesquisas (se tiver preço nulo e precisar buscar)
        else if (category === 'Pesquisa' && productData.price === null) {
             if (pesquisaType === 'previa') {
                const priceByState = getPrice('registro_imoveis_pesquisas', 'estado', formData.estado_pesquisa, 'pesquisa_previa');
                if (priceByState) basePrice = priceByState;
            } else if (pesquisaType === 'qualificada') {
                const priceByState = getPrice('registro_imoveis_pesquisas', 'estado', formData.estado_pesquisa, 'pesquisa_qualificada');
                if (priceByState) basePrice = priceByState;
            }
        }
        
        let newPrice = (basePrice || 0) * multiplicadorProtesto;

        const CUSTO_PAPEL = getTaxa('custo_papel') || 0;
        const CUSTO_APOSTILAMENTO = getTaxa('apostilamento') || 0;
        const CUSTO_AR = getTaxa('aviso_recebimento') || 0;
        const ACRESCIMO_CONDOMINIO = getTaxa('acrescimo_condominio') || 0;
        
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

      // Validações genéricas de documento
      const doc = formData.cpf_cnpj || formData.cpf_cnpj_pesquisa || formData.cpf || formData.requerente_cpf;
      if (doc) {
        const cleanedDoc = doc.replace(/\D/g, '');
        if (cleanedDoc.length > 0 && cleanedDoc.length < 11) { setValidationError('CPF incompleto.'); return; }
        if (cleanedDoc.length === 11 && !isValidCPF(doc)) { setValidationError('CPF inválido. Por favor, verifique.'); return; }
        if (cleanedDoc.length > 11 && cleanedDoc.length < 14) { setValidationError('CNPJ incompleto.'); return; }
        if (cleanedDoc.length === 14 && !isValidCNPJ(doc)) { setValidationError('CNPJ inválido. Por favor, verifique.'); return; }
      }

      // Validações específicas por etapa
      if (currentStepId === 'dadosVeiculo' && !formData.placa) { setValidationError('O campo Placa é obrigatório.'); return; }
      if (currentStepId === 'dadosRouboFurto' && !formData.placa && !formData.renavam) { setValidationError('Preencha pelo menos um campo (Placa ou Renavam).'); return; }
      if (currentStepId === 'dadosSintegra' && !formData.cnpj && !formData.inscricao_estadual && !formData.nire) { setValidationError('Preencha pelo menos um campo (CNPJ, Inscrição Estadual ou NIRE).'); return; }
      
      // --- VALIDAÇÃO DE DOCUMENTO VS TIPO DE PESSOA ---
      const tipoPessoa = formData.tipo_pessoa;
      const documento = formData.cpf_cnpj || formData.cpf_cnpj_escritura;
      const cleanedDocumento = documento?.replace(/\D/g, '');

      if (['protestoDados', 'dadosEscritura'].includes(currentStepId)) {
        if (tipoPessoa === 'Pessoa física' || tipoPessoa === 'Pessoa') {
          if (cleanedDocumento?.length !== 11 || !isValidCPF(documento)) {
            setValidationError('Para Pessoa Física, por favor, insira um CPF válido.');
            return;
          }
        } else if (tipoPessoa === 'Pessoa jurídica' || tipoPessoa === 'Empresa') {
          if (cleanedDocumento?.length !== 14 || !isValidCNPJ(documento)) {
            setValidationError('Para Pessoa Jurídica, por favor, insira um CNPJ válido.');
            return;
          }
        }
      }

      if (currentStepId === 'dadosPenhorSafra') {
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