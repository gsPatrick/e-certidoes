// Salve em: src/components/MultiStepForm/steps/StepTipoCertidao.js
'use client';

import { useState } from 'react';
// AQUI ESTÁ A MUDANÇA: Importando o CSS dedicado
import styles from './StepTipoCertidao.module.css'; 

// Componente genérico para campos, para manter o código limpo
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

// Ícone para a caixa de informação
const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>
        <path d="M5 12H1m18 0h-4M6.34 17.66l-1.41-1.41M19.07 4.93l-1.41 1.41"></path>
        <path d="M2 12a10 10 0 0 1 18.2-6.2l-3.2 3.2A5 5 0 0 0 12 17a5 5 0 0 0 4.2-2.2l3.2 3.2A10 10 0 0 1 2 12z"></path>
    </svg>
);


export default function StepTipoCertidao({ formData, handleChange }) {
  // Estado para a opção principal selecionada (Matrícula, Transcrição, etc.)
  const [selectedOption, setSelectedOption] = useState(formData.tipo_certidao || 'Matrícula');

  // Estado para controlar a aba ativa DENTRO de cada opção que tem abas
  const [activeTabs, setActiveTabs] = useState({
    certidaoInteiroTeor: 'Matrícula',
    documentoArquivado: 'Matrícula',
    pactoAntenupcial: 'Registro',
    livro3Garantias: 'Pessoa',
    livro3Auxiliar: 'Nome',
    quesitos: 'Matrícula'
  });

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setSelectedOption(value);
    handleChange(e); // Propaga a mudança para o formulário principal
  };

  const handleTabClick = (optionKey, tabName) => {
    setActiveTabs(prev => ({ ...prev, [optionKey]: tabName }));
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
            <div className={styles.infoBox}><LightbulbIcon /> Saiba como localizar os dados da matrícula.</div>
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
                        <div className={styles.infoBox}><LightbulbIcon /> Saiba como localizar os dados da matrícula.</div>
                        <FormField id="matricula" label="Matrícula" placeholder="Digite o número da matrícula do imóvel" value={formData.matricula} onChange={handleChange} />
                    </div>
                )}
                {activeTabs.certidaoInteiroTeor === 'Transcrição' && (
                     <div className={styles.conditionalContent}>
                        <div className={styles.infoBox}><LightbulbIcon /> Saiba como localizar os dados da transcrição.</div>
                        <FormField id="transcricao_numero" label="Transcrição" placeholder="Digite o número" value={formData.transcricao_numero} onChange={handleChange}/>
                        <FormField id="transcricao_data_emissao" label="Data de emissão" type="date" value={formData.transcricao_data_emissao} onChange={handleChange}/>
                        <FormField id="transcricao_livro" label="Livro" placeholder="Digite o número" value={formData.transcricao_livro} onChange={handleChange} required={false}/>
                        <FormField id="transcricao_dados_imovel" label="Dados do imóvel" type="textarea" placeholder="Insira: Cidade, Rua, Número, Lote, Apartamento, Bloco, Andar, Edifício, Bairro, Vila." value={formData.transcricao_dados_imovel} onChange={handleChange}/>
                    </div>
                )}
            </>
        );

      case 'Transcrição':
        return (
          <div className={styles.conditionalContent}>
            <div className={styles.infoBox}><LightbulbIcon /> Saiba como localizar os dados da transcrição.</div>
            <FormField id="transcricao_numero" label="Transcrição" placeholder="Digite o número" value={formData.transcricao_numero} onChange={handleChange}/>
            <FormField id="transcricao_data_emissao" label="Data de emissão" type="date" value={formData.transcricao_data_emissao} onChange={handleChange}/>
            <FormField id="transcricao_livro" label="Livro" placeholder="Digite o número" value={formData.transcricao_livro} onChange={handleChange} required={false}/>
            <FormField id="transcricao_dados_imovel" label="Dados do imóvel" type="textarea" placeholder="Insira: Cidade, Rua, Número, Lote, Apartamento, Bloco, Andar, Edifício, Bairro, Vila." value={formData.transcricao_dados_imovel} onChange={handleChange}/>
          </div>
        );

      case 'Documento Arquivado':
         return (
            <>
                <div className={styles.tabContainer}>
                    <button type="button" onClick={() => handleTabClick('documentoArquivado', 'Matrícula')} className={activeTabs.documentoArquivado === 'Matrícula' ? styles.activeTab : styles.tabButton}>Matrícula</button>
                    <button type="button" onClick={() => handleTabClick('documentoArquivado', 'Registro do Livro 3')} className={activeTabs.documentoArquivado === 'Registro do Livro 3' ? styles.activeTab : styles.tabButton}>Registro do Livro 3</button>
                    <button type="button" onClick={() => handleTabClick('documentoArquivado', 'Protocolo')} className={activeTabs.documentoArquivado === 'Protocolo' ? styles.activeTab : styles.tabButton}>Protocolo</button>
                </div>
                {activeTabs.documentoArquivado === 'Matrícula' && <div className={styles.conditionalContent}><FormField id="doc_arquivado_matricula" label="Matrícula" placeholder="Digite o número da matrícula" value={formData.doc_arquivado_matricula} onChange={handleChange} /></div>}
                {activeTabs.documentoArquivado === 'Registro do Livro 3' && <div className={styles.conditionalContent}><FormField id="doc_arquivado_registro" label="Número do Registro" placeholder="Digite o número do registro" value={formData.doc_arquivado_registro} onChange={handleChange} /></div>}
                {activeTabs.documentoArquivado === 'Protocolo' && <div className={styles.conditionalContent}><FormField id="doc_arquivado_protocolo" label="Número do Protocolo" placeholder="Digite o número do protocolo" value={formData.doc_arquivado_protocolo} onChange={handleChange} /></div>}
            </>
        );
        
      case 'Pacto Antenupcial':
        return (
            <>
                <div className={styles.tabContainer}>
                    <button type="button" onClick={() => handleTabClick('pactoAntenupcial', 'Registro')} className={activeTabs.pactoAntenupcial === 'Registro' ? styles.activeTab : styles.tabButton}>Registro</button>
                    <button type="button" onClick={() => handleTabClick('pactoAntenupcial', 'Nome dos Pactuantes')} className={activeTabs.pactoAntenupcial === 'Nome dos Pactuantes' ? styles.activeTab : styles.tabButton}>Nome dos Pactuantes</button>
                </div>
                {activeTabs.pactoAntenupcial === 'Registro' && (
                    <div className={styles.conditionalContent}>
                        <FormField id="pacto_num_registro" label="Número do Registro" placeholder="Digite o número do registro" value={formData.pacto_num_registro} onChange={handleChange} />
                        <FormField id="pacto_data_casamento" label="Data do Casamento" type="date" value={formData.pacto_data_casamento} onChange={handleChange} />
                    </div>
                )}
                {activeTabs.pactoAntenupcial === 'Nome dos Pactuantes' && (
                     <div className={styles.conditionalContent}>
                        <FormField id="pacto_conjuge1_nome" label="Nome do Cônjuge 1" placeholder="Digite o nome do cônjuge 1" value={formData.pacto_conjuge1_nome} onChange={handleChange} />
                        <FormField id="pacto_conjuge1_cpf" label="CPF do Cônjuge 1" placeholder="000.000.000-00" value={formData.pact_conjuge1_cpf} onChange={handleChange} />
                        <FormField id="pacto_conjuge2_nome" label="Nome do Cônjuge 2" placeholder="Digite o nome do cônjuge 2" value={formData.pacto_conjuge2_nome} onChange={handleChange} />
                        <FormField id="pacto_conjuge2_cpf" label="CPF do Cônjuge 2" placeholder="000.000.000-00" value={formData.pacto_conjuge2_cpf} onChange={handleChange} />
                        <FormField id="pacto_data_casamento2" label="Data do Casamento" type="date" value={formData.pacto_data_casamento2} onChange={handleChange} />
                    </div>
                )}
            </>
        );

      case 'Condomínio':
        return <div className={styles.conditionalContent}><FormField id="condominio_nome" label="Nome do condomínio" placeholder="Digite o nome do condomínio" value={formData.condominio_nome} onChange={handleChange} /></div>;

      case 'Livro 3 - Garantias':
         return (
            <>
                <div className={styles.tabContainer}>
                    <button type="button" onClick={() => handleTabClick('livro3Garantias', 'Pessoa')} className={activeTabs.livro3Garantias === 'Pessoa' ? styles.activeTab : styles.tabButton}>Pessoa</button>
                    <button type="button" onClick={() => handleTabClick('livro3Garantias', 'Registro do Livro 3')} className={activeTabs.livro3Garantias === 'Registro do Livro 3' ? styles.activeTab : styles.tabButton}>Registro do Livro 3</button>
                </div>
                {activeTabs.livro3Garantias === 'Pessoa' && (
                    <div className={styles.conditionalContent}>
                        <FormField id="livro3g_nome" label="Nome completo" placeholder="Digite o nome completo" value={formData.livro3g_nome} onChange={handleChange} />
                        <FormField id="livro3g_cpf" label="CPF" placeholder="000.000.000-00" value={formData.livro3g_cpf} onChange={handleChange} />
                    </div>
                )}
                {activeTabs.livro3Garantias === 'Registro do Livro 3' && <div className={styles.conditionalContent}><FormField id="livro3g_registro" label="Número do Registro" placeholder="Digite o número do registro" value={formData.livro3g_registro} onChange={handleChange} /></div>}
            </>
        );

      case 'Livro 3 - Auxiliar':
        return (
            <>
                <div className={styles.tabContainer}>
                    <button type="button" onClick={() => handleTabClick('livro3Auxiliar', 'Nome')} className={activeTabs.livro3Auxiliar === 'Nome' ? styles.activeTab : styles.tabButton}>Nome</button>
                    <button type="button" onClick={() => handleTabClick('livro3Auxiliar', 'Registro do Livro 3')} className={activeTabs.livro3Auxiliar === 'Registro do Livro 3' ? styles.activeTab : styles.tabButton}>Registro do Livro 3</button>
                </div>
                {activeTabs.livro3Auxiliar === 'Nome' && (
                    <div className={styles.conditionalContent}>
                        <FormField id="livro3a_nome" label="Nome completo" placeholder="Digite o nome completo" value={formData.livro3a_nome} onChange={handleChange} />
                        <FormField id="livro3a_cpf" label="CPF" placeholder="000.000.000-00" value={formData.livro3a_cpf} onChange={handleChange} />
                    </div>
                )}
                {activeTabs.livro3Auxiliar === 'Registro do Livro 3' && <div className={styles.conditionalContent}><FormField id="livro3a_registro" label="Número do Registro" placeholder="Digite o número do registro" value={formData.livro3a_registro} onChange={handleChange} /></div>}
            </>
        );

      case 'Quesitos':
         return (
            <>
                <div className={styles.tabContainer}>
                    <button type="button" onClick={() => handleTabClick('quesitos', 'Matrícula')} className={activeTabs.quesitos === 'Matrícula' ? styles.activeTab : styles.tabButton}>Matrícula</button>
                    <button type="button" onClick={() => handleTabClick('quesitos', 'Transcrição')} className={activeTabs.quesitos === 'Transcrição' ? styles.activeTab : styles.tabButton}>Transcrição</button>
                    <button type="button" onClick={() => handleTabClick('quesitos', 'Registro do Livro 3')} className={activeTabs.quesitos === 'Registro do Livro 3' ? styles.activeTab : styles.tabButton}>Registro do Livro 3</button>
                </div>
                {activeTabs.quesitos === 'Matrícula' && <div className={styles.conditionalContent}><FormField id="quesitos_matricula" label="Matrícula" placeholder="Digite o número da matrícula" value={formData.quesitos_matricula} onChange={handleChange}/></div>}
                {activeTabs.quesitos === 'Transcrição' && <div className={styles.conditionalContent}><FormField id="quesitos_transcricao" label="Transcrição" placeholder="Digite o número da transcrição" value={formData.quesitos_transcricao} onChange={handleChange} /></div>}
                {activeTabs.quesitos === 'Registro do Livro 3' && <div className={styles.conditionalContent}><FormField id="quesitos_registro" label="Número do Registro" placeholder="Digite o número do registro" value={formData.quesitos_registro} onChange={handleChange} /></div>}
            </>
        );

      default:
        // Por padrão, não exibe nada para Vintenária ou outros
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
    </div>
  );
}