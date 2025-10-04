// Salve em: src/components/CertificatesList/certificatesData.js

export const icons = {
  JUSTICE: 'justice',
  DOCUMENT: 'document',
  BUILDING: 'building',
  PROTEST: 'protest',
  LAWYER: 'lawyer',
  SEARCH: 'search',
};

export const categories = [
  'Todos',
  'Cartório de Registro de Imóveis',
  'Cartório de Registro Civil',
  'Tabelionato de Notas (Escrituras)',
  'Cartório de Protesto',
  'Pesquisa',
  'Certidões Federais e Estaduais',
  'Assessoria Jurídica'
];

const toSlug = (str) => {
  const normalizedStr = str.normalize('NFD');
  const withoutAccents = normalizedStr.replace(/[\u0300-\u036f]/g, '');
  return withoutAccents
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};


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
    { value: 'Transcrição (Registros anteriores a 1976)', label: 'Transcrição', description: 'É o antigo registro de imóveis realizado antes de 1975. O levantamento é feito pelo cartório através de buscas manuais nos livros físicos, o que aumenta o prazo de entrega da certidão.', conditionalFields: [{ id: 'numero_transcricao', label: 'Transcrição*', type: 'text', required: true }, { id: 'dados_imovel_transcricao', label: 'Dados do imóvel', type: 'textarea' }] },
  ]},
  formTemplateFormatoEntrega,
  formTemplateServicosAdicionais,
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
    { id: 'nome_completo_registrado', label: 'Nome completo do registrado(a)', type: 'text', required: true },
    { id: 'nome_completo_mae', label: 'Nome Completo da Mãe na Certidão', type: 'text', required: true },
    { id: 'nome_completo_pai', label: 'Nome Completo do Pai na Certidão', type: 'text', required: true },
    { id: 'data_nascimento', label: 'Data de nascimento', type: 'date', required: true },
    { id: 'numero_livro', label: 'Número do livro (opcional)', type: 'text', required: false },
    { id: 'numero_folha', label: 'Número da folha (opcional)', type: 'text', required: false },
    { id: 'numero_termo', label: 'Número do termo (opcional)', type: 'text', required: false },
  ]},
];

const formTemplateCasamento = [
  { groupTitle: 'Dados do Registro', fields: [
    { id: 'nome_conjuge1', label: 'Nome completo do Cônjuge 1 na Certidão', type: 'text', required: true },
    { id: 'nome_conjuge2', label: 'Nome completo do Cônjuge 2 na Certidão', type: 'text', required: true },
    { id: 'data_casamento', label: 'Data do casamento', type: 'date', required: true },
    { id: 'numero_livro', label: 'Número do livro (opcional)', type: 'text', required: false },
    { id: 'numero_folha', label: 'Número da folha (opcional)', type: 'text', required: false },
    { id: 'numero_termo', label: 'Número do termo (opcional)', type: 'text', required: false },
  ]},
];

const formTemplateObito = [
  { groupTitle: 'Dados do Registro', fields: [
    { id: 'nome_completo_falecido', label: 'Nome completo do Falecido(a) na Certidão', type: 'text', required: true },
    { id: 'nome_completo_mae', label: 'Nome Completo da Mãe na Certidão', type: 'text', required: true },
    { id: 'nome_completo_pai', label: 'Nome Completo do Pai na Certidão', type: 'text', required: true },
    { id: 'data_obito', label: 'Data do óbito', type: 'date', required: true },
    { id: 'numero_livro', label: 'Número do livro (opcional)', type: 'text', required: false },
    { id: 'numero_folha', label: 'Número da folha (opcional)', type: 'text', required: false },
    { id: 'numero_termo', label: 'Número do termo (opcional)', type: 'text', required: false },
  ]},
];

const formTemplateInterdicao = [
  { groupTitle: 'Dados do Registro', fields: [
    { id: 'nome_completo_interditado', label: 'Nome completo do interditado(a)', type: 'text', required: true },
    { id: 'nome_completo_mae', label: 'Nome Completo da Mãe na Certidão', type: 'text', required: true },
    { id: 'nome_completo_pai', label: 'Nome Completo do Pai na Certidão', type: 'text', required: true },
    { id: 'data_sentenca', label: 'Data da Sentença de Interdição', type: 'date', required: true },
    { id: 'numero_livro', label: 'Número do livro (opcional)', type: 'text', required: false },
    { id: 'numero_folha', label: 'Número da folha (opcional)', type: 'text', required: false },
    { id: 'numero_termo', label: 'Número do termo (opcional)', type: 'text', required: false },
  ]},
];

const formTemplateEscritura = [
  { groupTitle: 'Dados da Escritura', fields: [
    // Campos definidos dinamicamente no componente StepEscritura
  ]},
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

const formTemplatePesquisaVeiculo = [
  { groupTitle: 'Dados da Pesquisa', fields: [
    { id: 'placa_chassi', label: 'Placa ou chassi', type: 'text', required: true },
  ]},
  formTemplateRequerente,
];

const formTemplatePesquisaRouboFurto = [
    { groupTitle: 'Dados da Pesquisa', fields: [
      { id: 'placa', label: 'Placa', type: 'text', required: false },
      { id: 'renavam', label: 'Renavam', type: 'text', required: false },
    ]},
    formTemplateRequerente,
];

const formTemplatePesquisaProcessos = [
    { groupTitle: 'Dados da Pesquisa', fields: [
      { id: 'cpf_cnpj', label: 'CPF/CNPJ', type: 'text', required: true },
    ]},
    formTemplateRequerente,
];

const formTemplatePesquisaSintegra = [
    { groupTitle: 'Dados da Pesquisa', fields: [
      { id: 'cnpj', label: 'CNPJ', type: 'text', required: false },
      { id: 'inscricao_estadual', label: 'Inscrição Estadual', type: 'text', required: false },
      { id: 'nire', label: 'NIRE', type: 'text', required: false },
    ]},
    formTemplateRequerente,
];

const formTemplatePesquisaEscrituras = [
    { groupTitle: 'Dados da Pesquisa', fields: [
        { id: 'cpf_cnpj', label: 'CPF/CNPJ', type: 'text', required: true },
        { id: 'nome_razao_social', label: 'Nome / Razão Social', type: 'text', required: true },
    ]},
    formTemplateRequerente,
];


// --- LISTA COMPLETA DE CERTIDÕES ---
export const allCertificates = [
  // --- Cartório de Registro de Imóveis ---
  { id: 46, name: 'Certidão de Imóvel', slug: toSlug('Certidão de Imóvel'), price: 59.90, atribuicaoId: 4, category: 'Cartório de Registro de Imóveis', icon: icons.BUILDING, imageSrc: `/product-images/${toSlug('Certidão de Imóvel')}.png`, description: 'Solicite a certidão de matrícula, vintenária ou de transcrição do seu imóvel.', longDescription: 'Descrição longa sobre a Certidão de Imóvel.', faq: 'FAQ sobre a Certidão de Imóvel.', formFields: formTemplateCertidaoImovel, allowCpfSearch: true, allowManualCartorio: true },
  { id: 52, name: 'Visualização de Matrícula', slug: toSlug('Visualização de Matrícula'), price: 94.90, atribuicaoId: 4, category: 'Cartório de Registro de Imóveis', icon: icons.BUILDING, imageSrc: `/product-images/${toSlug('Visualização de Matrícula')}.png`, description: 'Visualize a matrícula de um imóvel antes de requerer a sua certidão. Obs.: Não possui valor jurídico', longDescription: 'A visualização de matrícula é uma cópia digital não certificada do documento oficial do imóvel, ideal para consultas rápidas e verificações. Não substitui a certidão oficial para fins legais.', faq: 'FAQ sobre a Visualização de Matrícula.', formFields: formTemplateVisualizacaoMatricula },
  { id: 56, name: 'Certidão de Matrícula com Ônus e Ações', slug: toSlug('Certidão de Matrícula com Ônus e Ações'), price: 79.90, atribuicaoId: 4, category: 'Cartório de Registro de Imóveis', icon: icons.BUILDING, imageSrc: `/product-images/${toSlug('Certidão de Matrícula com Ônus e Ações')}.png`, description: 'Certidão completa que informa a situação do imóvel, incluindo dívidas, hipotecas e processos judiciais.', longDescription: 'A Certidão de Matrícula de Imóvel Atualizada com Negativa de Ônus e Ações Reipersecutórias é o documento mais completo para verificar a segurança jurídica de um imóvel. Ela detalha não apenas a titularidade e as características do bem, mas também informa se existem quaisquer ônus (como hipotecas, penhoras, usufruto) ou ações judiciais que possam afetar a propriedade.', faq: 'FAQ sobre a Certidão de Matrícula com Ônus e Ações.', formFields: formTemplateCertidaoImovel, allowCpfSearch: true, allowManualCartorio: true },
  { id: 64, name: 'Pesquisa Prévia de imóveis por CPF/CNPJ', slug: toSlug('Pesquisa Previa'), price: 139.50, category: 'Cartório de Registro de Imóveis', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Previa')}.png`, description: 'Busca por imóveis registrados em um CPF ou CNPJ em todos os cartórios de um estado.', pesquisaType: 'previa', skipValidationAndTerms: true },
  { id: 65, name: 'Pesquisa Qualificada de Imóveis por CPF/CNPJ', slug: toSlug('Pesquisa Qualificada'), price: 139.50, category: 'Cartório de Registro de Imóveis', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Qualificada')}.png`, description: 'Investigação jurídica pelo CPF ou CNPJ em cartórios específicos de uma cidade.', pesquisaType: 'qualificada', skipValidationAndTerms: true },
  { id: 53, name: 'Pacote de Certidões - Compra e Venda de Imóveis', slug: toSlug('Pacote de Certidões - Compra e Venda de Imóveis'), price: 59.90, category: 'Cartório de Registro de Imóveis', icon: icons.BUILDING, imageSrc: `/product-images/${toSlug('Pacote de Certidões - Compra e Venda de Imóveis')}.png`, description: 'Serviço em breve.', longDescription: '', faq: '', isPlaceholder: true },
  { id: 54, name: 'Certidão de Penhor e Safra', slug: toSlug('Certidão de Penhor e Safra'), price: 59.90, atribuicaoId: 4, category: 'Cartório de Registro de Imóveis', icon: icons.BUILDING, imageSrc: `/product-images/${toSlug('Certidão de Penhor e Safra')}.png`, description: 'Solicite a certidão específica para fins de agronegócio.', longDescription: 'Descrição longa sobre a Certidão de Penhor e Safra.', faq: 'FAQ sobre a Certidão de Penhor e Safra.', formFields: formTemplateCertidaoImovel, allowCpfSearch: true, allowManualCartorio: true },

  // --- Cartório de Registro Civil ---
  { id: 49, name: 'Certidão de Nascimento', slug: toSlug('Certidão de Nascimento'), price: 59.90, atribuicaoId: 3, category: 'Cartório de Registro Civil', icon: icons.DOCUMENT, imageSrc: `/product-images/${toSlug('Certidão de Nascimento')}.png`, description: 'A Certidão de Nascimento é o documento que comprova a cidadania de uma pessoa.', longDescription: 'Solicite a 2ª via da sua Certidão de Nascimento de forma online.', faq: 'FAQ sobre a Certidão de Nascimento.', formFields: formTemplateNascimento },
  { id: 48, name: 'Certidão de Casamento', slug: toSlug('Certidão de Casamento'), price: 59.90, atribuicaoId: 3, category: 'Cartório de Registro Civil', icon: icons.DOCUMENT, imageSrc: `/product-images/${toSlug('Certidão de Casamento')}.png`, description: 'Documento que confere aos cônjuges a comunhão plena de vida, com base na igualdade de direitos e deveres.', longDescription: 'Solicite a 2ª via da sua Certidão de Casamento, incluindo averbações.', faq: 'FAQ sobre a Certidão de Casamento.', formFields: formTemplateCasamento },
  { id: 47, name: 'Certidão de Óbito', slug: toSlug('Certidão de Óbito'), price: 59.90, atribuicaoId: 3, category: 'Cartório de Registro Civil', icon: icons.DOCUMENT, imageSrc: `/product-images/${toSlug('Certidão de Óbito')}.png`, description: 'Documento oficial que atesta o falecimento de um cidadão.', longDescription: 'Solicite a 2ª via da Certidão de Óbito.', faq: 'FAQ sobre a Certidão de Óbito.', formFields: formTemplateObito },
  { id: 43, name: 'Certidão de Interdição', price: 59.90, slug: toSlug('Certidão de Interdição'), atribuicaoId: 3, category: 'Cartório de Registro Civil', icon: icons.DOCUMENT, imageSrc: `/product-images/${toSlug('Certidão de Interdição')}.png`, description: 'Comprova que uma pessoa foi declarada civilmente incapaz de exercer atos da vida civil.', longDescription: 'Solicite a 2ª via da Certidão de Interdição, Tutela e Curatela.', faq: 'FAQ da Certidão de Interdição.', formFields: formTemplateInterdicao },
  
  // --- Tabelionato de Notas (Escrituras) ---
  ...[
    { id: 32, name: 'Certidão de Escritura de Compra e Venda' },
    { id: 44, name: 'Certidão de Procuração' },
    { id: 37, name: 'Certidão de Escritura de Ata Notarial' },
    { id: 41, name: 'Certidão de Escritura de Pacto Antenupcial' },
    { id: 34, name: 'Certidão de Escritura de Doação' },
    { id: 39, name: 'Certidão de Escritura de Hipoteca' },
    { id: 35, name: 'Certidão de Escritura de Testamento' },
    { id: 42, name: 'Certidão de Escritura de União Estável' },
    { id: 40, name: 'Certidão de Escritura de Permuta' },
    { id: 33, name: 'Certidão de Escritura de Inventário' },
    { id: 36, name: 'Certidão de Escritura de Divórcio' },
    { id: 38, name: 'Certidão de Escritura de Emancipação' }
  ].map(cert => ({ 
      ...cert, 
      price: 59.90, 
      slug: toSlug(cert.name), 
      atribuicaoId: 1,
      category: 'Tabelionato de Notas (Escrituras)', 
      icon: icons.DOCUMENT, 
      imageSrc: `/product-images/${toSlug(cert.name)}.png`, 
      description: `A ${cert.name.toLowerCase()} menciona em qual tabelionato foi lavrado o ato. Também traz o endereço da serventia.`, 
      longDescription: `Descrição longa da ${cert.name}.`, 
      faq: `FAQ da ${cert.name}.`, 
      formFields: formTemplateEscritura
  })),
  { id: 66, name: 'Pesquisa Escrituras e Procurações por CPF/CNPJ', slug: toSlug('Pesquisa Escrituras e Procurações por CPF CNPJ'), price: 68.30, category: 'Tabelionato de Notas (Escrituras)', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Escrituras e Procurações por CPF CNPJ')}.png`, description: 'Busca por registros de procurações e/ou escrituras públicas nos Tabelionatos de Notas.', faq: 'FAQ sobre a Pesquisa de Escrituras.', formFields: formTemplatePesquisaEscrituras, skipValidationAndTerms: true },

  // --- Cartório de Protesto ---
  { id: 57, name: 'Certidão de Protesto', slug: toSlug('Certidão de Protesto'), price: 59.90, atribuicaoId: 2, category: 'Cartório de Protesto', icon: icons.PROTEST, imageSrc: `/product-images/${toSlug('Certidão de Protesto')}.png`, description: 'Solicite a certidão de protesto por CPF ou CNPJ.', longDescription: 'Descrição longa sobre a Certidão de Protesto.', faq: 'FAQ sobre a Certidão de Protesto.', formFields: formTemplateProtesto },
  
  // --- Pesquisa ---
  { id: 59, name: 'Pesquisa Completa de Veículo', slug: toSlug('Pesquisa Completa de Veículo'), price: 77.60, category: 'Pesquisa', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Completa de Veículo')}.png`, description: 'Proprietário atual, nome, nome da mãe, data de nascimento, sexo, e-mail, renda presumida, informações, alertas ou restrições, e-mails de contato, veículos por CPF/CNPJ, parentes, endereços associados, telefones fixos e celulares, participação em empresa.', faq: 'FAQ do serviço.', formFields: formTemplatePesquisaVeiculo },
  { id: 60, name: 'Pesquisa Leilão de Veículo', slug: toSlug('Pesquisa Leilão de Veículo'), price: 65.40, category: 'Pesquisa', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Leilão de Veículo')}.png`, description: 'Verifique o histórico de leilões para um veículo específico.', faq: 'FAQ do serviço.', formFields: formTemplatePesquisaVeiculo },
  { id: 61, name: 'Pesquisa Gravame de Veículo', slug: toSlug('Pesquisa Gravame de Veículo'), price: 52.40, category: 'Pesquisa', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Gravame de Veículo')}.png`, description: 'Consulte se o veículo possui restrições financeiras (alienação fiduciária).', faq: 'FAQ do serviço.', formFields: formTemplatePesquisaVeiculo },
  { id: 62, name: 'Histórico de Roubo ou Furto de Veículo', slug: toSlug('Histórico de Roubo ou Furto de Veículo'), price: 34.60, category: 'Pesquisa', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Histórico de Roubo ou Furto de Veículo')}.png`, description: 'Verifique se um veículo possui registro de roubo ou furto.', faq: 'FAQ do serviço.', formFields: formTemplatePesquisaRouboFurto },
  { id: 63, name: 'Pesquisa Processos Judiciais e Administrativos', slug: toSlug('Pesquisa Processos Judiciais e Administrativos'), price: 77.30, category: 'Pesquisa', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Processos Judiciais e Administrativos')}.png`, description: 'Dados atuais e históricos de ações judiciais e processos administrativos.', faq: 'FAQ do serviço.', formFields: formTemplatePesquisaProcessos },
  { id: 64, name: 'Pesquisa Prévia de imóveis por CPF/CNPJ', slug: toSlug('Pesquisa Previa'), price: 139.50, category: 'Pesquisa', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Previa')}.png`, description: 'Busca por imóveis registrados em um CPF ou CNPJ em todos os cartórios de um estado.', pesquisaType: 'previa', skipValidationAndTerms: true },
  { id: 65, name: 'Pesquisa Qualificada de Imóveis por CPF/CNPJ', slug: toSlug('Pesquisa Qualificada'), price: 139.50, category: 'Pesquisa', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Qualificada')}.png`, description: 'Investigação jurídica pelo CPF ou CNPJ em cartórios específicos de uma cidade.', pesquisaType: 'qualificada', skipValidationAndTerms: true },
  { id: 66, name: 'Pesquisa Escrituras e Procurações por CPF/CNPJ', slug: toSlug('Pesquisa Escrituras e Procurações por CPF CNPJ'), price: 68.30, category: 'Pesquisa', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Escrituras e Procurações por CPF CNPJ')}.png`, description: 'Busca por registros de procurações e/ou escrituras públicas nos Tabelionatos de Notas.', faq: 'FAQ sobre a Pesquisa de Escrituras.', formFields: formTemplatePesquisaEscrituras, skipValidationAndTerms: true },
  { id: 68, name: 'Pesquisa Telefone e Endereço pelo CPF/CNPJ', slug: toSlug('Pesquisa Telefone e Endereço pelo CPF CNPJ'), price: 28.35, category: 'Pesquisa', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Telefone e Endereço pelo CPF CNPJ')}.png`, description: 'Localize telefones e endereços através do CPF ou CNPJ.', faq: 'FAQ do serviço.', formFields: formTemplatePesquisaProcessos },
  { id: 69, name: 'Pesquisa Sintegra Estadual', slug: toSlug('Pesquisa Sintegra Estadual'), price: 28.35, category: 'Pesquisa', icon: icons.SEARCH, imageSrc: `/product-images/${toSlug('Pesquisa Sintegra Estadual')}.png`, description: 'Consulta ao Cadastro de Contribuintes de ICMS (SINTEGRA).', faq: 'FAQ do serviço.', formFields: formTemplatePesquisaSintegra, skipValidationAndTerms: true },

  // --- Certidões Federais e Estaduais ---
  ...[
    { id: 1, name: 'Certidão Negativa da Justiça Federal' }, { id: 2, name: 'Certidão Negativa da Justiça Estadual' }, { id: 3, name: 'Certidão da Justiça do Trabalho' }, { id: 4, name: 'Certidão da Receita Federal' }, { id: 5, name: 'Certidão da Procuradoria Geral da Fazenda Nacional' }, { id: 6, name: 'Certidão Negativa de Débitos Trabalhistas' }, { id: 7, name: 'Certidão de Ações Cíveis' }, { id: 8, name: 'Certidão de Falência e Concordata' }
  ].map(cert => ({ 
    ...cert, 
    price: 59.90, 
    slug: toSlug(cert.name), 
    category: 'Certidões Federais e Estaduais', 
    icon: [1,2,3,4,5,6,7,8].includes(cert.id) ? icons.JUSTICE : icons.DOCUMENT,
    imageSrc: `/product-images/${toSlug(cert.name)}.png`, 
    description: `Emissão online da ${cert.name}.`, 
    longDescription: `Descrição longa da ${cert.name}.`, 
    faq: `FAQ da ${cert.name}.`, 
    formFields: formTemplateFederal 
  })),
  
  // --- Assessoria Jurídica ---
  { id: 58, name: 'Consulta Jurídica', slug: toSlug('Consulta Jurídica'), price: 150.00, category: 'Assessoria Jurídica', icon: icons.LAWYER, imageSrc: `/product-images/${toSlug('Consulta Jurídica')}.png`, description: 'Agende uma consulta jurídica com nossos especialistas.', longDescription: 'Descrição longa sobre a Consulta Jurídica.', faq: 'FAQ sobre a Consulta Jurídica.' },
];