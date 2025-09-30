// Salve em: src/components/Multi-StepForm/MultiStepForm.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
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

// Importe a Barra de Progresso e a Sidebar
import StepProgressBar from './StepProgressBar';
import SummarySidebar from './SummarySidebar';


export default function MultiStepForm({ productData }) {
    const { addToCart } = useCart();
    const router = useRouter();
    
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        tipo_certidao: 'Matrícula',
        tipo_pesquisa: 'pessoa',
        tipo_pessoa: 'fisica',
    });
    const [finalPrice, setFinalPrice] = useState(productData.price);
    const [formFlow, setFormFlow] = useState([]);

    // === LÓGICA CENTRAL: MONTA O FLUXO DINAMICAMENTE ===
    useEffect(() => {
        let newFlow = [];
        
        const requerenteStep = { id: 'requerente', title: 'Identificação', Component: StepRequerente };
        const enderecoStep = { id: 'endereco', title: 'Endereço', Component: StepEndereco };
        const servicosAdicionaisStep = { id: 'servicosAdicionais', title: 'Serviços Adicionais', Component: StepServicosAdicionais };

        if (productData.slug === 'pesquisa-de-imoveis') {
            newFlow = [
                { id: 'localizacao', title: 'Localização', Component: StepLocalizacaoPesquisa },
                { id: 'dadosPesquisa', title: 'Dados da Pesquisa', Component: StepDadosPesquisa },
                requerenteStep
            ];
        } else if (productData.slug === 'visualizacao-de-matricula') {
            newFlow = [
                { id: 'localizacaoMatricula', title: 'Localização', Component: StepLocalizacaoMatricula },
                requerenteStep
            ];
        } else if (productData.slug === 'certido-de-penhor-e-safra') {
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
                case 'Matrícula':
                case 'Vintenária':
                case 'Transcrição':
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
        
        if (currentStep >= newFlow.length) {
            setCurrentStep(newFlow.length - 1);
        }

    }, [productData.slug, formData.tipo_certidao, formData.formato, currentStep]);

    // Lógica para recalcular o preço final
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

    const handleNextStep = () => {
      const form = document.querySelector('form');
      if (form.checkValidity()) {
        setCurrentStep(prev => Math.min(prev + 1, formFlow.length - 1));
        window.scrollTo(0, 0);
      } else {
        form.reportValidity();
      }
    };
    
    const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
    
    const goToStep = (stepIndex) => {
        if (stepIndex < currentStep) {
            setCurrentStep(stepIndex);
        }
    };
    
    const handleFinalSubmit = (e) => {
        e.preventDefault();
        const form = document.querySelector('form');
        if (form.checkValidity()) {
            addToCart({ ...productData, price: finalPrice, formData });
            router.push('/finalizar-compra');
        } else {
            form.reportValidity();
        }
    };

    const renderCurrentStep = () => {
        if (formFlow.length === 0 || !formFlow[currentStep]) return <div>Carregando...</div>;
        const { Component } = formFlow[currentStep];
        return <Component formData={formData} handleChange={handleChange} productData={productData} />;
    };

    const isLastStep = currentStep === formFlow.length - 1;

    return (
        <div className={styles.formLayout}>
            <div className={styles.mainContent}>
                <StepProgressBar steps={formFlow} currentStep={currentStep} />
                <div className={styles.formContainer}>
                    <form onSubmit={handleFinalSubmit} noValidate>
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
    );
}