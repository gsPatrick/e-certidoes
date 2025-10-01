// Salve em: src/components/MultiStepForm/MultiStepForm.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './MultiStepForm.module.css';

// Importe os validadores
import { isValidCPF } from '@/utils/cpfValidator';
import { isValidCNPJ } from '@/utils/cnpjValidator';

// Importe todos os componentes de etapa
import StepCartorio from './steps/StepCartorio';
import StepTipoCertidao from './steps/StepTipoCertidao';
import StepFormato from './steps/StepFormato';
import StepServicosAdicionais from './steps/StepServicosAdicionais';
import StepRequerente from './steps/StepRequerente';
import StepLocalizacaoPesquisa from './steps/StepLocalizacaoPesquisa';
import StepDadosPesquisa from './steps/StepDadosPesquisa';
import StepLocalizacaoMatricula from './steps/StepLocalizacaoMatricula';
import StepEndereco from './steps/StepEndereco';
import StepDadosPenhorSafra from './steps/StepDadosPenhorSafra'; // Certifique-se que está importado
import StepPesquisaAvancada from './steps/StepPesquisaAvancada';

// Importe o Modal de Confirmação
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';

// Importe a Barra de Progresso e a Sidebar
import StepProgressBar from './StepProgressBar';
import SummarySidebar from './SummarySidebar';

const FORM_DATA_KEY = 'multiStepFormData';

export default function MultiStepForm({ productData }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState(() => {
        if (typeof window === 'undefined') return {};
        const savedData = window.sessionStorage.getItem(FORM_DATA_KEY);
        return savedData ? JSON.parse(savedData) : {
            tipo_certidao: 'Matrícula',
            tipo_pesquisa: 'pessoa',
            tipo_pessoa: 'fisica',
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
        const requerenteStep = { id: 'requerente', title: 'Identificação', Component: StepRequerente };
        const enderecoStep = { id: 'endereco', title: 'Endereço', Component: StepEndereco };
        const servicosAdicionaisStep = { id: 'servicosAdicionais', title: 'Serviços Adicionais', Component: StepServicosAdicionais };
        const dadosPesquisaStep = { id: 'dadosPesquisa', title: 'Dados da Pesquisa', Component: StepDadosPesquisa };

        const slug = productData.slug;

        if (slug === 'pesquisa-qualificada' || slug === 'pesquisa-previa') {
            newFlow = [
                { id: 'dadosPesquisaAvancada', title: 'Dados da Pesquisa', Component: StepPesquisaAvancada },
                requerenteStep
            ];
        } else if (slug === 'pesquisa-de-imoveis') {
            newFlow = [
                { id: 'localizacao', title: 'Localização', Component: StepLocalizacaoPesquisa },
                dadosPesquisaStep,
                requerenteStep
            ];
        } else if (slug === 'visualizao-de-matrcula') {
            newFlow = [
                { id: 'localizacaoMatricula', title: 'Localização', Component: StepLocalizacaoMatricula },
                requerenteStep
            ];
        } else if (slug === 'certido-de-penhor-e-safra') { // SLUG CORRETO
            newFlow = [
                { id: 'cartorio', title: 'Localização', Component: StepCartorio },
                { id: 'dadosPenhorSafra', title: 'Dados da Certidão', Component: StepDadosPenhorSafra }, // ETAPA CORRETA
                servicosAdicionaisStep,
                enderecoStep,
                requerenteStep
            ];
        } else { // Fluxo padrão para "Certidão de Imóvel"
            const baseFlow = [
                { id: 'cartorio', title: 'Cartório', Component: StepCartorio },
                { id: 'tipoCertidao', title: 'Dados da Certidão', Component: StepTipoCertidao },
            ];
            let middleFlow = [];
            const { tipo_certidao, formato } = formData;
            switch (tipo_certidao) {
                case 'Matrícula': case 'Vintenária': case 'Transcrição':
                    middleFlow.push({ id: 'formato', title: 'Formato', Component: StepFormato });
                    middleFlow.push(servicosAdicionaisStep);
                    if (formato === 'Certidão em papel' || formato === 'Certidão em papel + eletrônica') {
                        middleFlow.push(enderecoStep);
                    }
                    middleFlow.push(requerenteStep);
                    break;
                default:
                    middleFlow.push(requerenteStep);
                    break;
            }
            newFlow = [...baseFlow, ...middleFlow];
        }
        
        setFormFlow(newFlow);
        if (currentStep >= newFlow.length) { setCurrentStep(newFlow.length - 1); }

    }, [productData.slug, formData.tipo_certidao, formData.formato, currentStep]);

    useEffect(() => {
        const stepFromUrl = parseInt(searchParams.get('step'));
        const stepIndex = !isNaN(stepFromUrl) ? stepFromUrl - 1 : 0;
        if (stepIndex !== currentStep) {
            setCurrentStep(stepIndex);
        }
    }, [searchParams, currentStep]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
        }
    }, [formData]);

    useEffect(() => {
        let newPrice = productData.price;
        if (formData.formato === 'Certidão em papel') newPrice += 20.00;
        if (formData.formato === 'Certidão em papel + eletrônica') newPrice += 289.90;
        if (formData.apostilamento) newPrice += 100.00;
        if (formData.aviso_recebimento) newPrice += 15.00;
        setFinalPrice(newPrice);
    }, [formData, productData.price]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
        if (validationError) setValidationError('');
    }, [validationError]);

    const navigateToStep = (stepIndex) => {
        const newStep = stepIndex + 1;
        router.push(`?step=${newStep}`, { scroll: false });
        setCurrentStep(stepIndex);
    };

    const handleNextStep = () => {
      const form = document.querySelector('form');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const currentStepId = formFlow[currentStep]?.id;

      if (currentStepId === 'dadosPesquisaAvancada') {
        const doc = formData.cpf_cnpj_pesquisa || '';
        const cleanedDoc = doc.replace(/\D/g, '');
        if (cleanedDoc.length === 11 && !isValidCPF(doc)) {
            setValidationError('CPF inválido. Por favor, verifique.');
            return;
        }
        if (cleanedDoc.length === 14 && !isValidCNPJ(doc)) {
            setValidationError('CNPJ inválido. Por favor, verifique.');
            return;
        }
        if (cleanedDoc.length !== 11 && cleanedDoc.length !== 14) {
            setValidationError('Documento inválido. Digite um CPF ou CNPJ.');
            return;
        }
      }

      if (currentStepId === 'tipoCertidao') {
        const tipoCertidao = formData.tipo_certidao;
        if (tipoCertidao === 'Pacto Antenupcial' && (!isValidCPF(formData.pacto_conjuge1_cpf) || !isValidCPF(formData.pacto_conjuge2_cpf))) {
          setValidationError('Um ou mais CPFs são inválidos. Por favor, verifique.');
          return;
        }
        if (tipoCertidao === 'Livro 3 - Garantias' && !isValidCPF(formData.livro3g_cpf)) {
          setValidationError('CPF inválido. Por favor, verifique.');
          return;
        }
        if (tipoCertidao === 'Livro 3 - Auxiliar' && !isValidCPF(formData.livro3a_cpf)) {
          setValidationError('CPF inválido. Por favor, verifique.');
          return;
        }
      }
      
      if (currentStepId === 'dadosPesquisa') {
        const tipoPesquisa = formData.tipo_pesquisa || 'pessoa';
        if (tipoPesquisa === 'pessoa' && !isValidCPF(formData.cpf)) {
          setValidationError('CPF inválido. Por favor, verifique.');
          return;
        }
        if (tipoPesquisa === 'empresa' && !isValidCNPJ(formData.cnpj)) {
          setValidationError('CNPJ inválido. Por favor, verifique.');
          return;
        }
      }

      // ==================================================================
      // ===== INÍCIO DA ADIÇÃO DA LÓGICA DE VALIDAÇÃO PENHOR E SAFRA =====
      // ==================================================================
      if (currentStepId === 'dadosPenhorSafra') {
        const tipoPessoa = formData.tipo_pessoa || 'fisica'; // Garante um valor padrão
        if (tipoPessoa === 'fisica' && !isValidCPF(formData.cpf)) {
            setValidationError('CPF inválido. Por favor, verifique.');
            return;
        }
        if (tipoPessoa === 'juridica' && !isValidCNPJ(formData.cnpj)) {
            setValidationError('CNPJ inválido. Por favor, verifique.');
            return;
        }
      }
      // ==================================================================
      // ===== FIM DA ADIÇÃO DA LÓGICA DE VALIDAÇÃO PENHOR E SAFRA ========
      // ==================================================================

      if (currentStepId === 'requerente' && !isValidCPF(formData.requerente_cpf)) {
        setValidationError('CPF inválido. Por favor, verifique.');
        return;
      }

      const nextStepIndex = Math.min(currentStep + 1, formFlow.length - 1);
      navigateToStep(nextStepIndex);
      window.scrollTo(0, 0);
    };
    
    const handlePrevStep = () => {
        const prevStepIndex = Math.max(currentStep - 1, 0);
        navigateToStep(prevStepIndex);
    };
    
    const goToStep = (stepIndex) => {
        if (stepIndex < currentStep) {
            navigateToStep(stepIndex);
        }
    };
    
    const handleOpenConfirmation = (e) => {
        e.preventDefault();
        const form = document.querySelector('form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (!isValidCPF(formData.requerente_cpf)) {
            setValidationError('CPF inválido. Por favor, verifique.');
            return;
        }
        setIsConfirmModalOpen(true);
    };

    const handleFinalConfirmAndSubmit = () => {
        setIsConfirmModalOpen(false);
        addToCart({ ...productData, price: finalPrice, formData });
        window.sessionStorage.removeItem(FORM_DATA_KEY);
        router.push('/finalizar-compra');
    };

    const renderCurrentStep = () => {
        if (formFlow.length === 0 || !formFlow[currentStep]) return <div>Carregando...</div>;
        const { Component } = formFlow[currentStep];
        // Passa o erro para o componente filho
        return <Component formData={formData} handleChange={handleChange} productData={productData} error={validationError} />;
    };

    const isLastStep = currentStep === formFlow.length - 1;

    return (
        <>
            <div className={styles.formLayout}>
                <div className={styles.mainContent}>
                    <StepProgressBar steps={formFlow} currentStep={currentStep} />
                    <div className={styles.formContainer}>
                        <form onSubmit={handleOpenConfirmation} noValidate>
                            {renderCurrentStep()}
                            <div className={styles.navigation}>
                                {currentStep > 0 && <button type="button" onClick={handlePrevStep} className={styles.prevButton}>Voltar</button>}
                                
                                {!isLastStep 
                                    ? <button type="button" onClick={handleNextStep} className={styles.nextButton}>Continuar</button>
                                    : <button type="submit" className={styles.submitButton}>
                                        Finalizar Compra
                                      </button>
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
                    orderDetails={{ 
                        cartItems: [{ ...productData, formData, price: finalPrice }], 
                        billingDetails: formData,
                        total: finalPrice 
                    }}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleFinalConfirmAndSubmit}
                />
            )}
        </>
    );
}