// Salve em: src/components/CertificatesList/certificatesData.js

export const icons = {
  JUSTICE: 'justice',
  DOCUMENT: 'document',
  BUILDING: 'building',
  PROTEST: 'protest',
  LAWYER: 'lawyer',
};

export const categories = [
  'Todos',
  'Cartório de Registro de Imóveis',
  'Cartório de Registro Civil',
  'Tabelionato de Notas (Escrituras)',
  'Cartório de Protesto',
  'Certidões Federais e Estaduais',
  'Assessoria Jurídica'
];

const toSlug = (str) => str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

// --- TEMPLATES DE FORMULÁRIO ---

const formTemplateRequerente = {
  groupTitle: 'Dados do(a) requerente',
  groupDescription: 'Informe seus dados para o andamento e recebimento de atualizações do seu serviço.',
  fields: [
    { id: 'requerente_nome', label: 'Nome completo do(a) solicitante', type: 'text', required: true },
    { id: 'requerente_telefone', label: 'Telefone', type: 'tel', required: true },
    { id: 'requerente_cpf', label: 'CPF', type: 'text', required: true },
    { id: 'requerente_email', label: 'E-mail', type: 'email', required: true, placeholder: 'E-mail para receber informações do pedido' },
  ]
};

const formTemplateFormatoEntrega = {
    groupTitle: 'Formato da Entrega',
    type: 'radio',
    options: [
        { id: 'formato', value: 'Certidão Impressa', label: 'Certidão em papel', description: 'Enviada no endereço' },
        { id: 'formato', value: 'Certidão Digital', label: 'Certidão eletrônica', description: 'Enviada por e-mail em PDF' },
    ]
};

const formTemplateServicosAdicionais = {
  groupTitle: 'Serviços Adicionais',
  fields: [
    { id: 'apostilamento', label: 'Apostilamento', type: 'checkbox', description: 'É um certificado de autenticidade, emitido da Convenção de Haia.' },
    { id: 'aviso_recebimento', label: 'Aviso de recebimento (A.R)', type: 'checkbox', description: 'Recibo dos correios que comprova a entrega do documento para o remetente.' },
  ]
};

const formTemplateCertidaoImovel = [
  { groupTitle: 'Dados do Imóvel', groupDescription: '1. Localização do Cartório da Certidão', fields: [
      { id: 'estado', label: 'Estado do Cartório', type: 'select', required: true },
      { id: 'cidade', label: 'Cidade do Cartório', type: 'select', required: true },
      { id: 'cartorio', label: 'Cartório', type: 'select', required: true },
  ]},
  { groupTitle: 'Tipo de Certidão', groupDescription: '2. Dados da Certidão', type: 'radioWithOptions', options: [
      { value: 'Matrícula Simples (Inteiro Teor)', label: 'Matrícula', description: 'É o número de registro do imóvel...', conditionalFields: [{ id: 'matricula', label: 'Matrícula*', type: 'text', required: true, placeholder: 'Digite o número da matrícula do imóvel' }] },
      { value: 'Vintenária (Últimos 20 anos)', label: 'Vintenária', description: 'Exibe o histórico do imóvel por vinte anos.', conditionalFields: [] },
      { value: 'Transcrição (Registros anteriores a 1976)', label: 'Transcrição', description: 'É a reprodução de um escrito...', conditionalFields: [{ id: 'numero_transcricao', label: 'Transcrição*', type: 'text', required: true }, { id: 'dados_imovel_transcricao', label: 'Dados do imóvel', type: 'textarea' }] },
  ]},
  formTemplateFormatoEntrega,
  formTemplateServicosAdicionais,
  formTemplateRequerente,
];

const formTemplatePesquisaImoveis = [
  { groupTitle: 'Dados para Pesquisa', fields: [
      { id: 'cpf_cnpj_pesquisado', label: 'CPF ou CNPJ pesquisado', type: 'text', required: true },
      { id: 'nome_completo_pf', label: 'Nome completo (se Pessoa Física) (OPCIONAL)', type: 'text' },
      { id: 'estado', label: 'Estado onde pesquisar', type: 'select', required: true },
      { id: 'cidade', label: 'Cidade onde pesquisar', type: 'select', required: true },
  ]},
  formTemplateRequerente,
];

const formTemplateVisualizacaoMatricula = [
  { groupTitle: 'Dados para Localização', fields: [
      { id: 'estado', label: 'Estado', type: 'select', required: true },
      { id: 'cidade', label: 'Cidade', type: 'select', required: true },
      { id: 'cartorio', label: 'Cartório de Registro de Imóveis', type: 'select', required: true },
      { id: 'numero_matricula', label: 'Número da Matrícula', type: 'text', required: true },
  ]},
  formTemplateRequerente,
];

const formTemplateNascimento = [
  { groupTitle: 'Dados do Registro', fields: [
    { id: 'nome_completo_registrado', label: 'Nome completo do registrado', type: 'text', required: true },
    { id: 'data_nascimento', label: 'Data de nascimento', type: 'date', required: true },
    { id: 'estado', label: 'Estado do cartório', type: 'select', required: true },
    { id: 'cidade', label: 'Cidade do cartório', type: 'select', required: true },
    { id: 'cartorio', label: 'Cartório/Ofício de Registro Civil', type: 'select', required: true },
  ]},
  formTemplateFormatoEntrega,
  formTemplateServicosAdicionais,
  formTemplateRequerente,
];

const formTemplateCasamento = [
  { groupTitle: 'Dados do Registro', fields: [
    { id: 'nome_conjuge1', label: 'Nome completo do cônjuge 1', type: 'text', required: true },
    { id: 'nome_conjuge2', label: 'Nome completo do cônjuge 2', type: 'text', required: true },
    { id: 'data_casamento', label: 'Data do casamento', type: 'date', required: true },
    { id: 'estado', label: 'Estado do cartório', type: 'select', required: true },
    { id: 'cidade', label: 'Cidade do cartório', type: 'select', required: true },
    { id: 'cartorio', label: 'Cartório/Ofício de Registro Civil', type: 'select', required: true },
  ]},
  formTemplateFormatoEntrega,
  formTemplateServicosAdicionais,
  formTemplateRequerente,
];

const formTemplateObito = [
    { groupTitle: 'Dados do Registro', fields: [
    { id: 'nome_completo_falecido', label: 'Nome completo do falecido', type: 'text', required: true },
    { id: 'data_obito', label: 'Data do óbito', type: 'date', required: true },
    { id: 'estado', label: 'Estado do cartório', type: 'select', required: true },
    { id: 'cidade', label: 'Cidade do cartório', type: 'select', required: true },
    { id: 'cartorio', label: 'Cartório/Ofício de Registro Civil', type: 'select', required: true },
  ]},
  formTemplateFormatoEntrega,
  formTemplateServicosAdicionais,
  formTemplateRequerente,
];

const formTemplateEscritura = [
  { groupTitle: 'Dados da Escritura', fields: [
    { id: 'tipo_escritura', label: 'Tipo de escritura', type: 'text', required: true, placeholder: 'Ex: Compra e Venda, Doação...' },
    { id: 'nome_completo_partes', label: 'Nome completo das partes envolvidas', type: 'textarea', required: true },
    { id: 'data_ato', label: 'Data do ato (assinatura)', type: 'date', required: true },
    { id: 'estado', label: 'Estado do cartório', type: 'select', required: true },
    { id: 'cidade', label: 'Cidade do cartório', type: 'select', required: true },
    { id: 'cartorio', label: 'Tabelionato de Notas', type: 'select', required: true },
    { id: 'livro_folha', label: 'Livro/Folha', type: 'text', required: true },
  ]},
  formTemplateFormatoEntrega,
  formTemplateServicosAdicionais,
  formTemplateRequerente,
];

const formTemplateProtesto = [
    { groupTitle: 'Dados para Pesquisa de Protesto', fields: [
        { id: 'estado', label: 'Estado', type: 'select', required: true },
        { id: 'cidade', label: 'Cidade', type: 'select', required: true },
        { id: 'cpf_cnpj_devedor', label: 'CPF/CNPJ do devedor', type: 'text', required: true },
    ]},
    formTemplateFormatoEntrega,
    formTemplateRequerente,
];

const formTemplateFederal = [
    { groupTitle: 'Dados para Emissão', fields: [
        { id: 'cpf_cnpj', label: 'CPF ou CNPJ para a consulta', type: 'text', required: true },
        { id: 'nome_completo_razao_social', label: 'Nome Completo ou Razão Social (OPCIONAL)', type: 'text' },
    ]},
    formTemplateRequerente,
];


// --- LISTA COMPLETA DE CERTIDÕES ---
export const allCertificates = [
  // ====================================================================
  // === CATEGORIA IMÓVEIS - CORRIGIDA CONFORME A DOCUMENTAÇÃO ===
  // ====================================================================
  { id: 46, name: 'Certidão de Imóvel', slug: toSlug('Certidão de Imóvel'), price: 59.90, atribuicaoId: 4, category: 'Cartório de Registro de Imóveis', icon: icons.BUILDING, imageSrc: `/product-images/${toSlug('Certidão de Imóvel')}.png`, description: 'Solicite a certidão de matrícula, vintenária ou de transcrição do seu imóvel.', longDescription: 'Descrição longa sobre a Certidão de Imóvel.', faq: 'FAQ sobre a Certidão de Imóvel.', formFields: formTemplateCertidaoImovel, allowCpfSearch: true, allowManualCartorio: true },
  { id: 51, name: 'Pesquisa de Imóveis', slug: toSlug('Pesquisa de Imóveis'), price: 59.90, atribuicaoId: 4, category: 'Cartório de Registro de Imóveis', icon: icons.BUILDING, imageSrc: `/product-images/${toSlug('Pesquisa de Imóveis')}.png`, description: 'Descubra imóveis registrados em um CPF ou CNPJ em uma cidade específica.', longDescription: 'Descrição longa sobre a Pesquisa de Imóveis.', faq: 'FAQ sobre a Pesquisa de Imóveis.', formFields: formTemplatePesquisaImoveis },
  { id: 52, name: 'Visualização de Matrícula', slug: toSlug('Visualização de Matrícula'), price: 59.90, atribuicaoId: 4, category: 'Cartório de Registro de Imóveis', icon: icons.BUILDING, imageSrc: `/product-images/${toSlug('Visualização de Matrícula')}.png`, description: 'Acesse uma visualização digital da matrícula de um imóvel.', longDescription: 'Descrição longa sobre a Visualização de Matrícula.', faq: 'FAQ sobre a Visualização de Matrícula.', formFields: formTemplateVisualizacaoMatricula },
  { id: 53, name: 'Pacote de Certidões - Compra e Venda de Imóveis', slug: toSlug('Pacote de Certidões - Compra e Venda de Imóveis'), price: 59.90, category: 'Cartório de Registro de Imóveis', icon: icons.BUILDING, imageSrc: `/product-images/${toSlug('Pacote de Certidões - Compra e Venda de Imóveis')}.png`, description: 'Serviço em breve.', longDescription: '', faq: '', isPlaceholder: true },
  { id: 54, name: 'Certidão de Penhor e Safra', slug: toSlug('Certidão de Penhor e Safra'), price: 59.90, atribuicaoId: 4, category: 'Cartório de Registro de Imóveis', icon: icons.BUILDING, imageSrc: `/product-images/${toSlug('Certidão de Penhor e Safra')}.png`, description: 'Solicite a certidão específica para fins de agronegócio.', longDescription: 'Descrição longa sobre a Certidão de Penhor e Safra.', faq: 'FAQ sobre a Certidão de Penhor e Safra.', formFields: formTemplateCertidaoImovel, allowCpfSearch: true, allowManualCartorio: true },
  
  // --- Cartório de Registro Civil ---
  { id: 49, name: 'Certidão de Nascimento', slug: toSlug('Certidão de Nascimento'), price: 59.90, atribuicaoId: 3, category: 'Cartório de Registro Civil', icon: icons.DOCUMENT, imageSrc: `/product-images/${toSlug('Certidão de Nascimento')}.png`, description: 'Solicite a 2ª via da sua Certidão de Nascimento de forma online.', longDescription: 'Descrição longa sobre a Certidão de Nascimento.', faq: 'FAQ sobre a Certidão de Nascimento.', formFields: formTemplateNascimento },
  { id: 48, name: 'Certidão de Casamento', slug: toSlug('Certidão de Casamento'), price: 59.90, atribuicaoId: 3, category: 'Cartório de Registro Civil', icon: icons.DOCUMENT, imageSrc: `/product-images/${toSlug('Certidão de Casamento')}.png`, description: 'Solicite a 2ª via da sua Certidão de Casamento, incluindo averbações.', longDescription: 'Descrição longa sobre a Certidão de Casamento.', faq: 'FAQ sobre a Certidão de Casamento.', formFields: formTemplateCasamento },
  { id: 47, name: 'Certidão de Óbito', slug: toSlug('Certidão de Óbito'), price: 59.90, atribuicaoId: 3, category: 'Cartório de Registro Civil', icon: icons.DOCUMENT, imageSrc: `/product-images/${toSlug('Certidão de Óbito')}.png`, description: 'Solicite a 2ª via da Certidão de Óbito.', longDescription: 'Descrição longa sobre a Certidão de Óbito.', faq: 'FAQ sobre a Certidão de Óbito.', formFields: formTemplateObito },
  
  // --- Tabelionato de Notas (Escrituras) ---
  ...[
    { id: 31, name: 'Certidão de Escritura' }, { id: 32, name: 'Certidão de Escritura de Compra e Venda' }, { id: 33, name: 'Certidão de Escritura de Inventário' }, { id: 34, name: 'Certidão de Escritura de Doação' }, { id: 35, name: 'Certidão de Escritura de Testamento' }, { id: 36, name: 'Certidão de Escritura de Divórcio' }, { id: 37, name: 'Certidão de Escritura de Ata Notarial' }, { id: 38, name: 'Certidão de Escritura de Emancipação' }, { id: 39, name: 'Certidão de Escritura de Hipoteca' }, { id: 40, name: 'Certidão de Escritura de Permuta' }, { id: 41, name: 'Certidão de Escritura de Pacto Antenupcial' }, { id: 42, name: 'Certidão de Escritura de União Estável' }, { id: 43, name: 'Certidão de Interdição' }, { id: 44, name: 'Certidão de Procuração' },
  ].map(cert => ({ ...cert, price: 59.90, slug: toSlug(cert.name), atribuicaoId: 1, category: 'Tabelionato de Notas (Escrituras)', icon: icons.DOCUMENT, imageSrc: `/product-images/${toSlug(cert.name)}.png`, description: `Solicite a segunda via da ${cert.name}.`, longDescription: `Descrição longa da ${cert.name}.`, faq: `FAQ da ${cert.name}.`, formFields: formTemplateEscritura })),

  // --- Cartório de Protesto ---
  { id: 45, name: 'Certidão de Protesto', slug: toSlug('Certidão de Protesto'), price: 59.90, atribuicaoId: 2, category: 'Cartório de Protesto', icon: icons.PROTEST, imageSrc: `/product-images/${toSlug('Certidão de Protesto')}.png`, description: 'Verifique a existência de protestos em um CPF ou CNPJ.', longDescription: 'Descrição longa sobre a Certidão de Protesto.', faq: 'FAQ sobre a Certidão de Protesto.', formFields: formTemplateProtesto },

  // --- Certidões Federais e Estaduais ---
  ...[
    { id: 1, name: 'TJ – Certidões de Distribuição das Justiças Estaduais' }, { id: 2, name: 'TRF – Certidões de Distribuição da Justiça Federal' }, { id: 3, name: 'STJ – Certidão de Distribuição do Supremo Tribunal de Justiça' }, { id: 4, name: 'STF – Certidão de Distribuição do STF' }, { id: 5, name: 'TSE – Certidão de Regularidade Eleitoral' }, { id: 6, name: 'TST – Certidão Negativa de Débitos Trabalhistas' }, { id: 7, name: 'STM – Certidão Negativa de Ações Criminais' }, { id: 8, name: 'TRT – (CEAT) – Certidão de Ações Trabalhistas' }, { id: 9, name: 'TCU – Certidão do Tribunal de Contas' }, { id: 10, name: 'CNJ – Inelegibilidade e Improbidade Administrativa' }, { id: 11, name: 'Certidão de Antecedentes Criminais' }, { id: 12, name: 'Receita Federal – Certidão Negativa de Tributos Federais e Dívida Ativa' }, { id: 13, name: 'SEFAZ – Certidão Negativa de Débitos Tributários Municipais (CND Municipal)' }, { id: 14, name: 'Certidão Negativa de Débitos de Tributos Imobiliários' }, { id: 15, name: 'Junta Comercial – Certidão da Empresa' }, { id: 16, name: 'SEFAZ – Certidão Negativa de Débitos Tributários Estaduais (CND Estadual)' }, { id: 17, name: 'MPE – Certidão de Inquérito Criminal' }, { id: 18, name: 'MPE – Certidão de Inquérito Civil' }, { id: 19, name: 'Certidão Negativa de Débitos Ambientais' }, { id: 20, name: 'PGE – Certidão de Tributos da Procuradoria Geral do Estado' }, { id: 21, name: 'Receita Federal – Certidão de Tributos Federais e Dívida da União de Imóvel Rural (ITR)' }, { id: 22, name: 'Receita Federal – Cadastro de Imóveis Rurais (CAFIR)' }, { id: 23, name: 'FGTS – Certidão Negativa do FGTS' }, { id: 24, name: 'Certidão Negativa de Débitos (CND) do Ibama' }, { id: 25, name: 'MT – Certidão de Cumprimento da Cota Legal de PCDs' }, { id: 26, name: 'MT – Certidão de Infrações Trabalhistas' }, { id: 27, name: 'MT – Certidão de Débitos' }, { id: 28, name: 'MPF – Certidão Negativa' }, { id: 29, name: 'Certidão IBAMA – Certidão de Embargos' }, { id: 30, name: 'Certidão de Propriedade de Aeronave' },
  ].map(cert => ({ ...cert, price: 59.90, slug: toSlug(cert.name), category: 'Certidões Federais e Estaduais', icon: [1, 2, 3, 7, 8, 17, 18, 28].includes(cert.id) ? icons.JUSTICE : icons.DOCUMENT, imageSrc: `/product-images/${toSlug(cert.name)}.png`, description: `Emissão online da ${cert.name}.`, longDescription: `Descrição longa da ${cert.name}.`, faq: `FAQ da ${cert.name}.`, formFields: formTemplateFederal })),
  
  // --- Assessoria Jurídica ---
  { id: 50, name: 'Assessoria Jurídica (Contrate um advogado)', slug: 'assessoria-juridica', price: 0, category: 'Assessoria Jurídica', icon: icons.LAWYER, imageSrc: '/product-images/assessoria-juridica.png', description: 'Contrate uma consulta com um de nossos advogados especialistas.', customUrl: '/assessoria', longDescription: '', faq: '' },
];