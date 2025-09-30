// Salve em: src/components/MultiStepForm/steps/StepTipoCertidao.js
'use client';

import { useState } from 'react';
import styles from './StepTipoCertidao.module.css';
import ImageModal from './ImageModal';

// Ícone para a caixa de informação
const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l.18 1.38M5.56 5.56l.98 1.05M2.69 12l1.38.18M5.56 18.44l.98-1.05M12 21.31l.18-1.38M18.44 18.44l-1.05-.98M21.31 12l-1.38-.18M18.44 5.56l-1.05.98M12 6a6 6 0 106 6c0-3.32-2.69-6-6-6z"></path><path d="M12 2v.69"></path></svg>
);

// Componente genérico para campos
const FormField = ({ id, label, type = 'text', placeholder, required = true, value, onChange }) => (
  <div className={styles.formGroup}>
    <label htmlFor={id}>{label}{required && ' *'}</label>
    {type === 'textarea' ? (
      <textarea id={id} name={id} required={required} placeholder={placeholder} rows="4" value={value || ''} onChange={onChange}></textarea>
    ) : (
      <input type={type} id={id} name={id} required={required} placeholder={placeholder} value={value || ''} onChange={onChange} />
    )}
  </div>
);


export default function StepTipoCertidao({ formData, handleChange }) {
  const [selectedOption, setSelectedOption] = useState(formData.tipo_certidao || 'Matrícula');
  const [activeTabs, setActiveTabs] = useState({
    certidaoInteiroTeor: 'Matrícula',
    documentoArquivado: 'Matrícula',
    pactoAntenupcial: 'Registro',
    livro3Garantias: 'Pessoa',
    livro3Auxiliar: 'Nome',
    quesitos: 'Matrícula'
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const handleOptionChange = (e) => {
    const { value } = e.target;
    setSelectedOption(value);
    handleChange(e);
  };
  
  const handleTabClick = (optionKey, tabName) => {
    setActiveTabs(prev => ({ ...prev, [optionKey]: tabName }));
  };

  const openImageModal = (imagePath) => {
    setModalImage(imagePath);
    setIsModalOpen(true);
  };
  
  const allOptions = [
    { value: 'Matrícula', label: 'Matrícula', description: 'É o número de registro do imóvel. A identificação do imóvel nos registros dos cartórios de imóveis. Inclui características, dados do imóvel e dados do proprietário.' },
    { value: 'Certidão de Inteiro Teor e Ônus da Ação', label: 'Certidão de Inteiro Teor e Ônus da Ação', description: 'Reprodução fiel da matrícula do imóvel. Nela você pode encontrar dados como: localização, lote e quadra, nome do proprietário atual, datas dos registros e averbações e mais.' },
    { value: 'Vintenária', label: 'Vintenária', description: 'Exibe o histórico do imóvel por vinte anos.' },
    { value: 'Transcrição', label: 'Transcrição', description: 'É a reprodução de um escrito. Ela pode ser feita por cópia, resumo ou como extrato. Este modelo de registro evidencia dados pessoais dos proprietários.' },
    { value: 'Documento Arquivado', label: 'Documento Arquivado', description: 'Documentos arquivados que originaram os atos como: Documentos do processo de Intimação e Consolidação, Plantas e outros.' },
    { value: 'Pacto Antenupcial', label: 'Pacto Antenupcial', description: 'É o contrato, realizado antes do casamento onde as partes dispõem sobre o regime de bens do matrimônio' },
    { value: 'Condomínio', label: 'Condomínio', description: 'A convenção tem força de lei para todos os condôminos, inquilinos, síndicos, empregados e visitantes do condomínio.' },
    { value: 'Livro 3 - Garantias', label: 'Livro 3 - Garantias', description: 'Contém as garantias das cédulas de crédito registradas no Livro 3 do Registro de Imóveis.' },
    { value: 'Livro 3 - Auxiliar', label: 'Livro 3 - Auxiliar', description: 'Contém os demais registros ocorridos no Livro 3 do Registro de Imóveis.' },
    { value: 'Quesitos', label: 'Quesitos', description: 'Atos que foram atribuídos por lei ao registro de imóveis mas que não estão relacionados diretamente ao imóvel.' },
  ];

  const renderConditionalFields = () => {
    switch (selectedOption) {
      case 'Matrícula':
        return (
          <>
            <div className={styles.infoBox} onClick={() => openImageModal('/images/certid.png')}>
              <LightbulbIcon /> Saiba como localizar os dados da matrícula.
            </div>
            <FormField id="matricula" label="Matrícula" placeholder="Digite o número da matrícula do imóvel" value={formData.matricula} onChange={handleChange} />
          </>
        );
      
      case 'Certidão de Inteiro Teor e Ônus da Ação':
        return (
            <>
                <div className={styles.tabContainer}>
                    <button type="button" onClick={() => handleTabClick('certidaoInteiroTeor', 'Matrícula')} className={activeTabs.certidaoInteiroTeor === 'Matrícula' ? styles.activeTab : styles.tabButton}>Matrícula</button>
                    <button type="button" onClick={() => handleTabClick('certidaoInteiroTeor', 'Transcrição')} className={activeTabs.certidaoInteiroTeor === 'Transcrição' ? styles.activeTab : styles.tabButton}>Transcrição</button>
                </div>
                {activeTabs.certidaoInteiroTeor === 'Matrícula' && (
                    <div className={styles.conditionalContent}>
                        <div className={styles.infoBox} onClick={() => openImageModal('/images/certid.png')}><LightbulbIcon /> Saiba como localizar os dados da matrícula.</div>
                        <FormField id="matricula" label="Matrícula" placeholder="Digite o número da matrícula do imóvel" value={formData.matricula} onChange={handleChange} />
                    </div>
                )}
                {activeTabs.certidaoInteiroTeor === 'Transcrição' && (
                     <div className={styles.conditionalContent}>
                        <div className={styles.infoBox} onClick={() => openImageModal('/images/exemplo-transcricao.png')}><LightbulbIcon /> Saiba como localizar os dados da transcrição.</div>
                        <FormField id="transcricao_numero" label="Transcrição" placeholder="Digite o número" value={formData.transcricao_numero} onChange={handleChange}/>
                        <FormField id="transcricao_data_emissao" label="Data de emissão" type="date" value={formData.transcricao_data_emissao} onChange={handleChange}/>
                        <FormField id="transcricao_livro" label="Livro" placeholder="Digite o número" value={formData.transcricao_livro} onChange={handleChange} required={false}/>
                        <FormField id="transcricao_dados_imovel" label="Dados do imóvel" type="textarea" placeholder="Insira: Cidade, Rua, Número, etc." value={formData.transcricao_dados_imovel} onChange={handleChange}/>
                    </div>
                )}
            </>
        );

      case 'Transcrição':
        return (
          <div className={styles.conditionalContent}>
            <div className={styles.infoBox} onClick={() => openImageModal('/images/exemplo-transcricao.png')}><LightbulbIcon /> Saiba como localizar os dados da transcrição.</div>
            <FormField id="transcricao_numero" label="Transcrição" placeholder="Digite o número" value={formData.transcricao_numero} onChange={handleChange}/>
            <FormField id="transcricao_data_emissao" label="Data de emissão" type="date" value={formData.transcricao_data_emissao} onChange={handleChange}/>
            <FormField id="transcricao_livro" label="Livro" placeholder="Digite o número" value={formData.transcricao_livro} onChange={handleChange} required={false}/>
            <FormField id="transcricao_dados_imovel" label="Dados do imóvel" type="textarea" placeholder="Insira: Cidade, Rua, Número, etc." value={formData.transcricao_dados_imovel} onChange={handleChange}/>
          </div>
        );
      
      // ... (outros cases permanecem sem o modal por enquanto, mas a estrutura está pronta)

      default:
        return null;
    }
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>Dados da Certidão</h3>
      <p className={styles.stepDescription}>Escolha o tipo de certidão:</p>
      
      <div className={styles.radioGroupContainer}>
        {allOptions.map(opt => (
          <label key={opt.value} className={styles.radioOption}>
            <input
              type="radio"
              name="tipo_certidao"
              value={opt.value}
              checked={selectedOption === opt.value}
              onChange={handleOptionChange}
              required
            />
            <div className={styles.radioDetails}>
              <strong>{opt.label}</strong>
              <small>{opt.description}</small>
            </div>
          </label>
        ))}
      </div>

      <div className={styles.conditionalContent}>
        {renderConditionalFields()}
      </div>

      {isModalOpen && (
        <ImageModal 
          imageSrc={modalImage} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}