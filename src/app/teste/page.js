// Salve em: src/app/teste/page.js
'use client';

import { useState } from 'react';
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

// Importações dos componentes de Etapa
import StepTipoCertidao from '@/components/MultiStepForm/steps/StepTipoCertidao';
import StepFormato from '@/components/MultiStepForm/steps/StepFormato';
import StepRequerente from '@/components/MultiStepForm/steps/StepRequerente';
import StepServicosAdicionais from '@/components/MultiStepForm/steps/StepServicosAdicionais';

// 1. IMPORTE A SIDEBAR
import SummarySidebar from '@/components/MultiStepForm/SummarySidebar';

import styles from './Teste.module.css';

export default function TestePage() {
  const [formData, setFormData] = useState({
    formato: 'Certidão eletrônica' // Valor padrão
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;

    setFormData(prevData => ({
      ...prevData,
      [name]: finalValue
    }));
  };
  
  // Dados simulados para a sidebar
  const mockProductData = { name: 'Certidão de Imóvel' };
  const mockFinalPrice = 169.90; 
  const mockFormSteps = ['Cartório', 'Tipo de Certidão', 'Formato', 'Serviços Adicionais', 'Requerente'];
  const mockCurrentStep = 3; // Simula que estamos na 4ª etapa

  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        {/* 2. ESTRUTURA DE LAYOUT COM GRID */}
        <div className={styles.testLayout}>
          
          {/* Coluna Principal com os Formulários */}
          <div className={styles.mainContent}>
            <div className={styles.componentContainer}>
              <StepTipoCertidao formData={formData} handleChange={handleChange} />
              <hr className={styles.separator} />
              <StepFormato formData={formData} handleChange={handleChange} />
              <hr className={styles.separator} />
              <StepRequerente formData={formData} handleChange={handleChange} />
              <hr className={styles.separator} />
              <StepServicosAdicionais formData={formData} handleChange={handleChange} />
            </div>
          </div>
          
          {/* Coluna da Sidebar */}
          <div className={styles.sidebarContent}>
            <SummarySidebar 
              productData={mockProductData}
              formData={formData}
              finalPrice={mockFinalPrice}
              currentStep={mockCurrentStep}
              formSteps={mockFormSteps}
              goToStep={(index) => alert(`Navegar para a etapa ${index + 1}`)}
            />
          </div>
        </div>
        
        <div className={styles.dataViewer}>
            <h3>Dados do Formulário (em tempo real):</h3>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      </main>
      <Footer />
    </>
  );
}