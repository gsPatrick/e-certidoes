// Salve em: src/components/MultiStepForm/steps/StepTipoCertidao.js
'use client';

import { useState } from 'react';
import styles from './StepTipoCertidao.module.css';
import ImageModal from './ImageModal';

// Função de máscara de CPF
const maskCPF = (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');

// Componentes auxiliares
const InfoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>);
const FormField = ({ id, label, type = 'text', placeholder, required = true, value, onChange }) => (<div className={styles.formGroup}><label htmlFor={id}>{label}{required && ' *'}</label>{type === 'textarea' ? (<textarea id={id} name={id} required={required} placeholder={placeholder} rows="4" value={value || ''} onChange={onChange}></textarea>) : (<input type={type} id={id} name={id} required={required} placeholder={placeholder} value={value || ''} onChange={onChange} />)}</div>);

export default function StepTipoCertidao({ formData, handleChange, error, productData }) {
  // State para o fluxo de Imóveis
  const [selectedOption, setSelectedOption] = useState(formData.tipo_certidao || 'Matrícula');
  const [activeTabs, setActiveTabs] = useState({
    vintenaria: formData.vintenaria_tab || 'Matrícula',
    documentoArquivado: formData.documento_tab || 'Matrícula',
    pactoAntenupcial: formData.pacto_tab || 'Registro',
    livro3Garantias: formData.livro3g_tab || 'Pessoa',
    livro3Auxiliar: formData.livro3a_tab || 'Nome',
    quesitos: formData.quesitos_tab || 'Matrícula'
  });
  
  // State compartilhado
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  
  // Condição principal para alternar a interface
  const isRegistroCivil = productData?.category === 'Cartório de Registro Civil';

  // Handlers para o fluxo de Imóveis
  const handlePactoCpf1Change = (e) => handleChange({ target: { name: 'pacto_conjuge1_cpf', value: maskCPF(e.target.value) } });
  const handlePactoCpf2Change = (e) => handleChange({ target: { name: 'pacto_conjuge2_cpf', value: maskCPF(e.target.value) } });
  const handleLivro3gCpfChange = (e) => handleChange({ target: { name: 'livro3g_cpf', value: maskCPF(e.target.value) } });
  const handleLivro3aCpfChange = (e) => handleChange({ target: { name: 'livro3a_cpf', value: maskCPF(e.target.value) } });

  const handleOptionChange = (e) => { setSelectedOption(e.target.value); handleChange(e); };
  const handleTabClick = (key, name) => setActiveTabs(prev => ({ ...prev, [key]: name }));
  
  // Handler compartilhado
  const openImageModal = (path) => { setModalImage(path); setIsModalOpen(true); };
  
  // Opções para Cartório de Imóveis
  const imovelOptions = [
    { value: 'Matrícula', label: 'Matrícula', description: 'É o número de registro do imóvel. A identificação do imóvel nos registros dos cartórios de imóveis. Inclui características, dados do imóvel e dados do proprietário.' },
    { value: 'Vintenária', label: 'Vintenária', description: 'Exibe o histórico do imóvel por vinte anos.' },
    { value: 'Transcrição', label: 'Transcrição', description: 'É o antigo registro de imóveis realizado antes de 1975. O levantamento é feito pelo cartório através de buscas manuais nos livros físicos.' },
    { value: 'Documento Arquivado', label: 'Documento Arquivado', description: 'Documentos arquivados que originaram os atos como: Documentos do processo de Intimação e Consolidação, Plantas e outros.' },
    { value: 'Pacto Antenupcial', label: 'Pacto Antenupcial', description: 'É o contrato, realizado antes do casamento onde as partes dispõem sobre o regime de bens do matrimônio' },
    { value: 'Condomínio', label: 'Condomínio', description: 'A convenção tem força de lei para todos os condôminos, inquilinos, síndicos, empregados e visitantes do condomínio.' },
    { value: 'Livro 3 - Garantias', label: 'Livro 3 - Garantias', description: 'Contém as garantias das cédulas de crédito registradas no Livro 3 do Registro de Imóveis.' },
    { value: 'Livro 3 - Auxiliar', label: 'Livro 3 - Auxiliar', description: 'Contém os demais registros ocorridos no Livro 3 do Registro de Imóveis.' },
    { value: 'Quesitos', label: 'Quesitos', description: 'Atos que foram atribuídos por lei ao registro de imóveis mas que não estão relacionados diretamente ao imóvel.' },
  ];
  
  const civilFormFields = productData?.formFields?.[0]?.fields || [];
  const certidaoTipo = productData.name;
  
  const renderConditionalFieldsImoveis = () => {
    switch (selectedOption) {
      case 'Matrícula': return (<><div className={styles.infoBox} onClick={() => openImageModal('/images/certid.png')}><InfoIcon /> Saiba como localizar os dados da matrícula.</div><FormField id="matricula" label="Matrícula" placeholder="Digite o número da matrícula do imóvel" value={formData.matricula} onChange={handleChange} /></>);
      case 'Vintenária': return (<><div className={styles.tabContainer}><button type="button" onClick={() => handleTabClick('vintenaria', 'Matrícula')} className={activeTabs.vintenaria === 'Matrícula' ? styles.activeTab : styles.tabButton}>Matrícula</button><button type="button" onClick={() => handleTabClick('vintenaria', 'Transcrição')} className={activeTabs.vintenaria === 'Transcrição' ? styles.activeTab : styles.tabButton}>Transcrição</button></div>{activeTabs.vintenaria === 'Matrícula' && (<div className={styles.conditionalContent}><div className={styles.infoBox} onClick={() => openImageModal('/images/certid.png')}><InfoIcon /> Saiba como localizar os dados da matrícula.</div><FormField id="matricula" label="Matrícula" placeholder="Digite o número da matrícula do imóvel" value={formData.matricula} onChange={handleChange} /></div>)}{activeTabs.vintenaria === 'Transcrição' && (<div className={styles.conditionalContent}><div className={styles.infoBox} onClick={() => openImageModal('/images/exemplo-transcricao.png')}><InfoIcon /> Saiba como localizar os dados da transcrição.</div><FormField id="transcricao_numero" label="Transcrição" placeholder="Digite o número" value={formData.transcricao_numero} onChange={handleChange}/><FormField id="transcricao_data_emissao" label="Data de emissão" type="date" value={formData.transcricao_data_emissao} onChange={handleChange}/><FormField id="transcricao_livro" label="Livro (Opcional)" placeholder="Digite o número" value={formData.transcricao_livro} onChange={handleChange} required={false}/><FormField id="transcricao_dados_imovel" label="Dados do imóvel" type="textarea" placeholder="Insira: Cidade, Rua, Número, Lote, Apartamento, Bloco, Andar, Edifício, Bairro, Vila." value={formData.transcricao_dados_imovel} onChange={handleChange}/></div>)}</>);
      case 'Transcrição': return (<div className={styles.conditionalContent}><div className={styles.infoBox} onClick={() => openImageModal('/images/exemplo-transcricao.png')}><InfoIcon /> Saiba como localizar os dados da transcrição.</div><FormField id="transcricao_numero" label="Transcrição" placeholder="Digite o número" value={formData.transcricao_numero} onChange={handleChange}/><FormField id="transcricao_data_emissao" label="Data de emissão" type="date" value={formData.transcricao_data_emissao} onChange={handleChange}/><FormField id="transcricao_livro" label="Livro (Opcional)" placeholder="Digite o número" value={formData.transcricao_livro} onChange={handleChange} required={false}/><FormField id="transcricao_dados_imovel" label="Dados do imóvel" type="textarea" placeholder="Insira: Cidade, Rua, Número, Lote, Apartamento, Bloco, Andar, Edifício, Bairro, Vila." value={formData.transcricao_dados_imovel} onChange={handleChange}/></div>);
      case 'Documento Arquivado': return (<><div className={styles.tabContainer}><button type="button" onClick={() => handleTabClick('documentoArquivado', 'Matrícula')} className={activeTabs.documentoArquivado === 'Matrícula' ? styles.activeTab : styles.tabButton}>Matrícula</button><button type="button" onClick={() => handleTabClick('documentoArquivado', 'Registro do Livro 3')} className={activeTabs.documentoArquivado === 'Registro do Livro 3' ? styles.activeTab : styles.tabButton}>Registro do Livro 3</button><button type="button" onClick={() => handleTabClick('documentoArquivado', 'Protocolo')} className={activeTabs.documentoArquivado === 'Protocolo' ? styles.activeTab : styles.tabButton}>Protocolo</button></div><div className={styles.infoBox} onClick={() => openImageModal('/images/certid.png')}><InfoIcon /> Saiba como localizar os dados da matrícula.</div>{activeTabs.documentoArquivado === 'Matrícula' && <div className={styles.conditionalContent}><FormField id="doc_arquivado_matricula" label="Matrícula" placeholder="Digite o número da matrícula" value={formData.doc_arquivado_matricula} onChange={handleChange} /><FormField id="doc_arquivado_numero_ato" label="Número do Ato" placeholder="Digite o número do ato" value={formData.doc_arquivado_numero_ato} onChange={handleChange} /></div>}{activeTabs.documentoArquivado === 'Registro do Livro 3' && <div className={styles.conditionalContent}><FormField id="doc_arquivado_registro" label="Número do Registro" placeholder="Digite o número do registro" value={formData.doc_arquivado_registro} onChange={handleChange} /></div>}{activeTabs.documentoArquivado === 'Protocolo' && <div className={styles.conditionalContent}><FormField id="doc_arquivado_protocolo" label="Número do Protocolo" placeholder="Digite o número do protocolo" value={formData.doc_arquivado_protocolo} onChange={handleChange} /></div>}</>);
      case 'Pacto Antenupcial': return (<><div className={styles.tabContainer}><button type="button" onClick={() => handleTabClick('pactoAntenupcial', 'Registro')} className={activeTabs.pactoAntenupcial === 'Registro' ? styles.activeTab : styles.tabButton}>Registro</button><button type="button" onClick={() => handleTabClick('pactoAntenupcial', 'Nome dos Pactuantes')} className={activeTabs.pactoAntenupcial === 'Nome dos Pactuantes' ? styles.activeTab : styles.tabButton}>Nome dos Pactuantes</button></div>{activeTabs.pactoAntenupcial === 'Registro' && (<div className={styles.conditionalContent}><FormField id="pacto_num_registro" label="Número do Registro" placeholder="Digite o número do registro" value={formData.pacto_num_registro} onChange={handleChange} /><FormField id="pacto_data_casamento" label="Data do Casamento" type="date" value={formData.pacto_data_casamento} onChange={handleChange} /></div>)}{activeTabs.pactoAntenupcial === 'Nome dos Pactuantes' && (<div className={styles.conditionalContent}><FormField id="pacto_conjuge1_nome" label="Nome do Cônjuge 1" value={formData.pacto_conjuge1_nome} onChange={handleChange} /><div className={styles.formGroup}><label htmlFor="pacto_conjuge1_cpf">CPF do Cônjuge 1 *</label><input type="text" id="pacto_conjuge1_cpf" name="pacto_conjuge1_cpf" value={formData.pacto_conjuge1_cpf || ''} onChange={handlePactoCpf1Change} placeholder="000.000.000-00" required />{error && <small className={styles.errorMessage}>{error}</small>}</div><FormField id="pacto_conjuge2_nome" label="Nome do Cônjuge 2" value={formData.pacto_conjuge2_nome} onChange={handleChange} /><div className={styles.formGroup}><label htmlFor="pacto_conjuge2_cpf">CPF do Cônjuge 2 *</label><input type="text" id="pacto_conjuge2_cpf" name="pacto_conjuge2_cpf" value={formData.pacto_conjuge2_cpf || ''} onChange={handlePactoCpf2Change} placeholder="000.000.000-00" required />{error && <small className={styles.errorMessage}>{error}</small>}</div><FormField id="pacto_data_casamento2" label="Data do Casamento" type="date" value={formData.pacto_data_casamento2} onChange={handleChange} /></div>)}</>);
      case 'Condomínio': return <div className={styles.conditionalContent}><FormField id="condominio_nome" label="Nome do condomínio" placeholder="Digite o nome do condomínio" value={formData.condominio_nome} onChange={handleChange} /></div>;
      case 'Livro 3 - Garantias': return (<><div className={styles.tabContainer}><button type="button" onClick={() => handleTabClick('livro3Garantias', 'Pessoa')} className={activeTabs.livro3Garantias === 'Pessoa' ? styles.activeTab : styles.tabButton}>Pessoa</button><button type="button" onClick={() => handleTabClick('livro3Garantias', 'Registro do Livro 3')} className={activeTabs.livro3Garantias === 'Registro do Livro 3' ? styles.activeTab : styles.tabButton}>Registro do Livro 3</button></div>{activeTabs.livro3Garantias === 'Pessoa' && (<div className={styles.conditionalContent}><FormField id="livro3g_nome" label="Nome completo" value={formData.livro3g_nome} onChange={handleChange} /><div className={styles.formGroup}><label htmlFor="livro3g_cpf">CPF *</label><input type="text" id="livro3g_cpf" name="livro3g_cpf" value={formData.livro3g_cpf || ''} onChange={handleLivro3gCpfChange} placeholder="000.000.000-00" required />{error && <small className={styles.errorMessage}>{error}</small>}</div></div>)}{activeTabs.livro3Garantias === 'Registro do Livro 3' && <div className={styles.conditionalContent}><FormField id="livro3g_registro" label="Número do Registro" placeholder="Digite o número do registro" value={formData.livro3g_registro} onChange={handleChange} /></div>}</>);
      case 'Livro 3 - Auxiliar': return (<><div className={styles.tabContainer}><button type="button" onClick={() => handleTabClick('livro3Auxiliar', 'Nome')} className={activeTabs.livro3Auxiliar === 'Nome' ? styles.activeTab : styles.tabButton}>Nome</button><button type="button" onClick={() => handleTabClick('livro3Auxiliar', 'Registro do Livro 3')} className={activeTabs.livro3Auxiliar === 'Registro do Livro 3' ? styles.activeTab : styles.tabButton}>Registro do Livro 3</button></div>{activeTabs.livro3Auxiliar === 'Nome' && (<div className={styles.conditionalContent}><FormField id="livro3a_nome" label="Nome completo" value={formData.livro3a_nome} onChange={handleChange} /><div className={styles.formGroup}><label htmlFor="livro3a_cpf">CPF *</label><input type="text" id="livro3a_cpf" name="livro3a_cpf" value={formData.livro3a_cpf || ''} onChange={handleLivro3aCpfChange} placeholder="000.000.000-00" required />{error && <small className={styles.errorMessage}>{error}</small>}</div></div>)}{activeTabs.livro3Auxiliar === 'Registro do Livro 3' && <div className={styles.conditionalContent}><FormField id="livro3a_registro" label="Número do Registro" placeholder="Digite o número do registro" value={formData.livro3a_registro} onChange={handleChange} /></div>}</>);
      case 'Quesitos': return (<><div className={styles.tabContainer}><button type="button" onClick={() => handleTabClick('quesitos', 'Matrícula')} className={activeTabs.quesitos === 'Matrícula' ? styles.activeTab : styles.tabButton}>Matrícula</button><button type="button" onClick={() => handleTabClick('quesitos', 'Transcrição')} className={activeTabs.quesitos === 'Transcrição' ? styles.activeTab : styles.tabButton}>Transcrição</button><button type="button" onClick={() => handleTabClick('quesitos', 'Registro do Livro 3')} className={activeTabs.quesitos === 'Registro do Livro 3' ? styles.activeTab : styles.tabButton}>Registro do Livro 3</button></div>{activeTabs.quesitos === 'Matrícula' && <div className={styles.conditionalContent}><FormField id="quesitos_matricula" label="Matrícula" placeholder="Digite o número da matrícula" value={formData.quesitos_matricula} onChange={handleChange}/></div>}{activeTabs.quesitos === 'Transcrição' && <div className={styles.conditionalContent}><div className={styles.infoBox} onClick={() => openImageModal('/images/exemplo-transcricao.png')}><InfoIcon /> Saiba como localizar os dados da transcrição.</div><FormField id="quesitos_transcricao_numero" label="Transcrição" placeholder="Digite o número" value={formData.quesitos_transcricao_numero} onChange={handleChange}/><FormField id="quesitos_transcricao_data" label="Data de emissão" type="date" value={formData.quesitos_transcricao_data} onChange={handleChange}/><FormField id="quesitos_transcricao_livro" label="Livro (Opcional)" placeholder="Digite o número" value={formData.quesitos_transcricao_livro} onChange={handleChange} required={false}/><FormField id="quesitos_transcricao_dados" label="Dados do imóvel" type="textarea" placeholder="Insira: Cidade, Rua, Número, Lote, Apartamento, Bloco, Andar, Edifício, Bairro, Vila." value={formData.quesitos_transcricao_dados} onChange={handleChange}/></div>}{activeTabs.quesitos === 'Registro do Livro 3' && <div className={styles.conditionalContent}><FormField id="quesitos_registro" label="Número do Registro" placeholder="Digite o número do registro" value={formData.quesitos_registro} onChange={handleChange} /></div>}</>);
      default: return null;
    }
  };

  return (
    <div>
      <h3 className={styles.stepTitle}>2. Dados da Certidão</h3>
      
      {isRegistroCivil ? (
        <>
            {civilFormFields.filter(f => !f.label.includes('(opcional)')).map(field => 
                <FormField key={field.id} {...field} value={formData[field.id]} onChange={handleChange} />
            )}
            
            <div className={styles.infoBox} onClick={() => openImageModal('/images/exemplo-rg-certidao.png')}>
                <InfoIcon />
                <div>
                    <strong>Clique aqui e veja como identificar o Livro, Folha e Termo na Certidão.</strong>
                    <p>São dados opcionais, mas que agilizam a localização do seu documento.</p>
                </div>
            </div>

            {civilFormFields.filter(f => f.label.includes('(opcional)')).map(field => 
                <FormField key={field.id} {...field} value={formData[field.id]} onChange={handleChange} />
            )}
        </>
      ) : (
        <>
          <p className={styles.stepDescription}>Escolha o tipo de certidão:</p>
          <div className={styles.radioGroupContainer}>
            {imovelOptions.map(opt => (
              <label key={opt.value} className={styles.radioOption}>
                <input type="radio" name="tipo_certidao" value={opt.value} checked={selectedOption === opt.value} onChange={handleOptionChange} required />
                <div className={styles.radioDetails}>
                  <strong>{opt.label}</strong>
                  <small>{opt.description}</small>
                </div>
              </label>
            ))}
          </div>
          <div className={styles.conditionalContent}>
            {renderConditionalFieldsImoveis()}
          </div>
        </>
      )}

      {isModalOpen && (<ImageModal imageSrc={modalImage} onClose={() => setIsModalOpen(false)} />)}
    </div>
  );
}