// Salve em: src/components/MultiStepForm/steps/StepServicosAdicionais.js
'use client';

import { useEffect, useState } from 'react';
import styles from './StepServicosAdicionais.module.css';

const WarningIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const InfoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>);

const toSlug = (str) => {
  if (!str) return '';
  const normalizedStr = str.normalize('NFD');
  const withoutAccents = normalizedStr.replace(/[\u0300-\u036f]/g, '');
  return withoutAccents.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
};

export default function StepServicosAdicionais({ formData, handleChange, productData }) {
  const [isTeorModalOpen, setIsTeorModalOpen] = useState(false);

  useEffect(() => {
    if (formData.inteiro_teor && !formData.tipo_inteiro_teor) {
      handleChange({ target: { name: 'tipo_inteiro_teor', value: 'Transcrição digital' } });
    }
  }, [formData.inteiro_teor, formData.tipo_inteiro_teor, handleChange]);

  const { category, slug } = productData;
  const isProtesto = slug === toSlug('Certidão de Protesto');
  const isTabelionato = category === 'Tabelionato de Notas (Escrituras)';
  const isRegistroCivil = category === 'Cartório de Registro Civil';

  let allServices = [];

  const isPapel = formData.formato === 'Certidão em papel' || formData.formato === 'Certidão Transcrita' || formData.formato === 'Certidão Reprográfica';

  // 2. OPÇÃO SEDEX ADICIONADA E CONDICIONADA AOS FORMATOS FÍSICOS
  const sedexOption = { 
    id: 'sedex', 
    label: 'SEDEX', 
    description: 'Receba sua certidão de forma mais rápida através do serviço SEDEX dos Correios.', 
    condition: () => isPapel
  };

  if (isProtesto) {
    allServices = [
      { id: 'apostilamento_digital', label: 'Apostilamento Digital', description: 'É um certificado de autenticidade, emitido da Convenção de Haia.', condition: (data) => data.formato === 'Certidão eletrônica' }
    ];
  } else if (isTabelionato) {
    allServices = [
      { id: 'apostilamento', label: 'Apostilamento', description: 'É um certificado de autenticidade, emitido da Convenção de Haia.', condition: () => true },
      { id: 'aviso_recebimento', label: 'Aviso de recebimento (A.R)', description: 'Recibo dos correios que comprova a entrega do documento para o remetente.', condition: () => isPapel },
      sedexOption
    ];
  } else {
    // Serviços para Registro de Imóveis e Registro Civil
    allServices = [
        { id: 'apostilamento_digital', label: 'Apostilamento Digital', description: 'É um certificado de autenticidade, emitido da Convenção de Haia.', condition: (data) => data.formato === 'Certidão eletrônica' },
        { id: 'inteiro_teor', label: 'Inteiro teor', description: 'Todos os dados da certidão para procedimentos específicos. Pode ser necessário preenchimento de requerimento com assinatura digital ou firma reconhecida.', condition: () => isPapel },
        { id: 'apostilamento_fisico', label: 'Apostilamento', description: 'É um certificado de autenticidade, emitido da Convenção de Haia.', condition: () => isPapel },
        { id: 'aviso_recebimento', label: 'Aviso de recebimento (A.R)', description: 'Recibo dos correios que comprova a entrega do documento para o remetente.', condition: () => isPapel },
        sedexOption
    ];
  }

  const availableServices = allServices.filter(service => !service.condition || service.condition(formData));

  return (
    <div>
      <h3 className={styles.stepTitle}>4. Serviços Adicionais</h3>
      
      <div className={styles.checkboxGroupContainer}>
        {availableServices.length > 0 ? (
          availableServices.map(service => (
            <div key={service.id} className={styles.serviceBlock}>
              <label className={styles.checkboxOption}>
                <input 
                  type="checkbox"
                  id={service.id}
                  name={service.id}
                  checked={!!formData[service.id]}
                  onChange={handleChange}
                  className={styles.checkboxInput}
                />
                <div className={styles.checkboxDetails}>
                  <span className={styles.checkboxLabel}>{service.label}</span>
                  <p className={styles.checkboxDescription}>{service.description}</p>
                </div>
              </label>

              {service.id === 'inteiro_teor' && formData.inteiro_teor && (
                <div className={styles.conditionalContent}>
                  <div className={styles.warningBox}>
                    <WarningIcon />
                    <span>Necessário preenchimento de requerimento com assinatura digital ou firma reconhecida. Você receberá o formulário por e-mail quando concluir o pedido.</span>
                  </div>
                  <div className={styles.subSection}>
                    <h4 className={styles.subTitle}>Selecione o tipo de certidão de inteiro teor:</h4>
                    <div className={styles.radioGroupTeor}>
                      <label className={styles.radioOptionTeor}>
                        <input type="radio" name="tipo_inteiro_teor" value="Transcrição digital" checked={formData.tipo_inteiro_teor === 'Transcrição digital'} onChange={handleChange} />
                        <div>
                          <strong>Transcrição digital</strong>
                          <small>Datilografada e impressa com base nas informações extraídas do Livro de Registros.</small>
                        </div>
                      </label>
                      <label className={styles.radioOptionTeor}>
                        <input type="radio" name="tipo_inteiro_teor" value="Reprográfica" checked={formData.tipo_inteiro_teor === 'Reprográfica'} onChange={handleChange} />
                        <div>
                          <strong>Reprográfica</strong>
                          <small>Xerox ou fotocópia do Livro de Registros.</small>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {isRegistroCivil && (
                    <div className={styles.subSection}>
                      <h4 className={styles.subTitle}>Preencha as informações complementares para a certidão de inteiro teor:</h4>
                      <div className={styles.formGrid}>
                          <div className={styles.formGroup}><label htmlFor="nacionalidade">Nacionalidade</label><select id="nacionalidade" name="inteiro_teor_nacionalidade" value={formData.inteiro_teor_nacionalidade || 'Brasileiro'} onChange={handleChange}><option>Brasileiro</option><option>Estrangeiro</option></select></div>
                          <div className={styles.formGroup}><label htmlFor="estado_civil">Estado civil</label><select id="estado_civil" name="inteiro_teor_estado_civil" value={formData.inteiro_teor_estado_civil || 'Solteiro(a)'} onChange={handleChange}><option>Solteiro(a)</option><option>Casado(a)</option><option>Divorciado(a)</option><option>Viúvo(a)</option></select></div>
                          <div className={styles.formGroup}><label htmlFor="profissao">Profissão</label><select id="profissao" name="inteiro_teor_profissao" value={formData.inteiro_teor_profissao || 'Profissional autônomo'} onChange={handleChange}><option>Profissional autônomo</option><option>Advogado(a)</option><option>Médico(a)</option><option>Engenheiro(a)</option><option>Outra</option></select></div>
                          <div className={styles.formGroup}><label htmlFor="parentesco">Grau de parentesco</label><select id="parentesco" name="inteiro_teor_parentesco" value={formData.inteiro_teor_parentesco || 'O próprio'} onChange={handleChange}><option>O próprio</option><option>Cônjuge</option><option>Filho(a)</option><option>Pai/Mãe</option><option>Outro</option></select></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className={styles.noServicesText}>Nenhum serviço adicional disponível para o formato selecionado.</p>
        )}
      </div>
    </div>
  );
}