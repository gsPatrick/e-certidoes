// Salve em: src/components/MultiStepForm/MultiStepForm.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './MultiStepForm.module.css';

// Importe todos os componentes de etapa que criamos
import StepCartorio from './steps/StepCartorio';
import StepTipoCertidao from './steps/StepTipoCertidao';
import StepFormato from './steps/StepFormato';
import StepServicosAdicionais from './steps/StepServicosAdicionais';
import StepRequerente from './steps/StepRequerente';
import StepLocalizacaoPesquisa from './steps/StepLocalizacaoPesquisa';
import StepDadosPesquisa from './steps/StepDadosPesquisa';
import StepLocalizacaoMatricula from './steps/StepLocalizacaoMatricula';
import StepEndereco from './steps/StepEndereco';
import StepDadosPenhorSafra from './steps/StepDadosPenhorSafra';
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

    useEffect(() => {
        let newFlow = [];
        const requerenteStep = { id: 'requerente', title: 'Identificação', Component: StepRequerente };
        const enderecoStep = { id: 'endereco', title: 'Endereço', Component: StepEndereco };
        const servicosAdicionaisStep = { id: 'servicosAdicionais', title: 'Serviços Adicionais', Component: StepServicosAdicionais };

        const slug = productData.slug;

        if (slug === 'pesquisa-qualificada' || slug === 'pesquisa-previa') {
            newFlow = [
                { id: 'dadosPesquisaAvancada', title: 'Dados da Pesquisa', Component: StepPesquisaAvancada },
                requerenteStep
            ];
        } else if (slug === 'visualizacao-de-matricula') {
            newFlow = [
                { id: 'localizacaoMatricula', title: 'Localização', Component: StepLocalizacaoMatricula },
                requerenteStep
            ];
        } else if (slug === 'certidao-de-penhor-e-safra') {
            newFlow = [
                { id: 'cartorio', title: 'Localização', Component: StepCartorio },
                { id: 'dadosPenhorSafra', title: 'Dados da Certidão', Component: StepDadosPenhorSafra },
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
    }, []);

    const navigateToStep = (stepIndex) => {
        const newStep = stepIndex + 1;
        router.push(`?step=${newStep}`, { scroll: false });
        setCurrentStep(stepIndex);
    };

    const handleNextStep = () => {
      const form = document.querySelector('form');
      if (form.checkValidity()) {
        const nextStepIndex = Math.min(currentStep + 1, formFlow.length - 1);
        navigateToStep(nextStepIndex);
        window.scrollTo(0, 0);
      } else {
        form.reportValidity();
      }
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
        if (form.checkValidity()) {
            setIsConfirmModalOpen(true);
        } else {
            form.reportValidity();
        }
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
        return <Component formData={formData} handleChange={handleChange} productData={productData} />;
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