// Salve em: src/components/CertificatesList/certificatesData.js

export const icons = {
  JUSTICE: 'justice',
  DOCUMENT: 'document',
  BUILDING: 'building',
  PROTEST: 'protest',
  LAWYER: 'lawyer',
};

// Categorias finais e na ordem correta
export const categories = [
  'Todos',
  'Cartório de Registro de Imóveis',
  'Cartório de Registro Civil',
  'Tabelionato de Notas (Escrituras)',
  'Cartório de Protesto',
  'Certidões Federais e Estaduais',
  'Assessoria Jurídica'
];

// Função para gerar slugs amigáveis para URL
const toSlug = (str) => str.toLowerCase()
  .replace(/ /g, '-')
  .replace(/[^\w-]+/g, '')
  .replace(/--+/g, '-');


// --- TEMPLATES DE FORMULÁRIO REUTILIZÁVEIS ---

const formTemplateRequerente = {
  groupTitle: 'Dados do(a) requerente',
  fields: [
    { id: 'requerente_nome', label: 'Nome completo do(a) requerente', type: 'text', required: true },
    { id: 'requerente_telefone', label: 'Telefone', type: 'tel', required: true },
    { id: 'requerente_cpf', label: 'CPF', type: 'text', required: true },
    { id: 'requerente_email', label: 'E-mail', type: 'email', required: true },
  ]
};

const formTemplateCompleto = [
  {
    groupTitle: 'Informações sobre o cartório',
    fields: [
      { id: 'estado', label: 'Estado', type: 'select', required: true },
      { id: 'cidade', label: 'Cidade', type: 'select', required: true },
      { id: 'cartorio', label: 'Cartório', type: 'select', required: true },
    ]
  },
  {
    groupTitle: 'Informações sobre a certidão',
    fields: [
      { id: 'nome_completo', label: 'Nome completo registrado(a) na certidão', type: 'text', required: true },
      { id: 'nome_mae', label: 'Nome completo da mãe na certidão', type: 'text', required: true },
      { id: 'nome_pai', label: 'Nome completo do pai na certidão', type: 'text', required: true },
      { id: 'data_nascimento', label: 'Data de nascimento', type: 'date', required: true },
    ]
  },
  {
    groupTitle: 'Informações adicionais',
    groupDescription: 'Esses dados não são obrigatórios, mas ajudam a acelerar a busca pelo seu documento.',
    fields: [
      { id: 'num_livro', label: 'Número do livro da certidão', type: 'text' },
      { id: 'num_folha', label: 'Número da folha da certidão', type: 'text' },
      { id: 'num_termo', label: 'Número do termo da certidão', type: 'text' },
    ]
  },
  {
    groupTitle: 'Facilidades e complementos',
    fields: [
      { id: 'formato', label: 'Formato', type: 'radio', required: true, options: ['Certidão Impressa', 'Certidão Digital'] },
    ]
  },
  formTemplateRequerente
];

const formTemplateImoveis = [
  {
    groupTitle: 'Localização do Imóvel',
    fields: [
      { id: 'estado', label: 'Estado', type: 'select', required: true },
      { id: 'cidade', label: 'Cidade', type: 'select', required: true },
      { id: 'cartorio', label: 'Cartório de Registro de Imóveis', type: 'select', required: true },
    ]
  },
  {
    groupTitle: 'Informações do Imóvel',
    fields: [
      { id: 'matricula_cnm', label: 'Número da Matrícula / CNM (se souber)', type: 'text' },
    ]
  },
   {
    groupTitle: 'Facilidades e complementos',
    fields: [
      { id: 'formato', label: 'Formato', type: 'radio', required: true, options: ['Certidão Impressa', 'Certidão Digital'] },
    ]
  },
  formTemplateRequerente
];


// --- LISTA COMPLETA DE CERTIDÕES ---
export const allCertificates = [
  // --- Cartório de Registro de Imóveis (2 itens) ---
  ...[
    { id: 46, name: 'Certidão de Imóvel' },
    { id: 51, name: 'Pesquisa de Imóveis' },
  ].map(cert => {
    const slug = toSlug(cert.name);
    return {
      ...cert,
      slug: slug,
      atribuicaoId: 4, // REGISTRO DE IMOVEIS
      category: 'Cartório de Registro de Imóveis',
      icon: icons.BUILDING,
      imageSrc: `/product-images/${slug}.png`,
      description: cert.id === 51 ? 'Descubra imóveis registrados em um CPF ou CNPJ.' : `Solicite sua ${cert.name} online.`,
      longDescription: `Informações detalhadas sobre a ${cert.name}.`,
      faq: `Dúvidas frequentes sobre a ${cert.name}.`,
      formFields: cert.id === 51 ? [
        { groupTitle: 'Dados para Pesquisa', fields: [{ id: 'cpf_cnpj', label: 'CPF ou CNPJ a ser pesquisado', type: 'text', required: true }] },
        formTemplateRequerente
      ] : formTemplateImoveis,
    };
  }),

  // --- Cartório de Registro Civil (3 itens) ---
  ...[
    { id: 47, name: 'Certidão de Óbito' }, { id: 48, name: 'Certidão de Casamento' }, { id: 49, name: 'Certidão de Nascimento' },
  ].map(cert => {
    const slug = toSlug(cert.name);
    return {
      ...cert,
      slug: slug,
      atribuicaoId: 3, // REGISTRO CIVIL PESSOAS NATURAIS
      category: 'Cartório de Registro Civil',
      icon: icons.DOCUMENT,
      imageSrc: `/product-images/${slug}.png`,
      description: `Solicite a 2ª via da sua ${cert.name} de forma online e receba em casa.`,
      longDescription: `A ${cert.name} é um documento civil essencial. Oferecemos a emissão da segunda via (inteiro teor ou breve relato).`,
      faq: `Dúvidas frequentes sobre a ${cert.name}.`,
      formFields: formTemplateCompleto,
    };
  }),

  // --- Tabelionato de Notas (Escrituras) (14 itens) ---
  ...[
    { id: 31, name: 'Certidão de Escritura' }, { id: 32, name: 'Certidão de Escritura de Compra e Venda' }, { id: 33, name: 'Certidão de Escritura de Inventário' }, { id: 34, name: 'Certidão de Escritura de Doação' }, { id: 35, name: 'Certidão de Escritura de Testamento' }, { id: 36, name: 'Certidão de Escritura de Divórcio' }, { id: 37, name: 'Certidão de Escritura de Ata Notarial' }, { id: 38, name: 'Certidão de Escritura de Emancipação' }, { id: 39, name: 'Certidão de Escritura de Hipoteca' }, { id: 40, name: 'Certidão de Escritura de Permuta' }, { id: 41, name: 'Certidão de Escritura de Pacto Antenupcial' }, { id: 42, name: 'Certidão de Escritura de União Estável' }, { id: 43, name: 'Certidão de Interdição' }, { id: 44, name: 'Certidão de Procuração' },
  ].map(cert => {
    const slug = toSlug(cert.name);
    return {
      ...cert,
      slug: slug,
      atribuicaoId: 1, // NOTAS
      category: 'Tabelionato de Notas (Escrituras)',
      icon: icons.DOCUMENT,
      imageSrc: `/product-images/${slug}.png`,
      description: `Solicite a segunda via da ${cert.name} de forma rápida e segura.`,
      longDescription: `A ${cert.name} é um documento fundamental para a formalização de atos e negócios jurídicos, emitida pelo Tabelionato de Notas.`,
      faq: `Dúvidas frequentes sobre a ${cert.name}.`,
      formFields: formTemplateCompleto,
    };
  }),

  // --- Cartório de Protesto (1 item) ---
  {
    id: 45, name: 'Certidão de Protesto', slug: 'certidao-de-protesto', category: 'Cartório de Protesto', icon: icons.PROTEST,
    atribuicaoId: 2, // PROTESTO DE TITULOS
    imageSrc: '/product-images/certidao-de-protesto.png',
    description: 'Verifique a existência de protestos em um CPF ou CNPJ.',
    longDescription: 'A Certidão de Protesto informa se existem dívidas protestadas em cartório em nome de uma pessoa física ou jurídica.',
    faq: 'Dúvidas frequentes sobre a Certidão de Protesto.',
    formFields: [
      formTemplateCompleto[0],
      {
        groupTitle: 'Informações da Pesquisa',
        fields: [{ id: 'cpf_cnpj', label: 'CPF ou CNPJ a ser pesquisado', type: 'text', required: true }]
      },
      formTemplateRequerente
    ],
  },

  // --- Certidões Federais e Estaduais (30 itens) ---
  ...[
    { id: 1, name: 'TJ – Certidões de Distribuição das Justiças Estaduais' }, { id: 2, name: 'TRF – Certidões de Distribuição da Justiça Federal' }, { id: 3, name: 'STJ – Certidão de Distribuição do Supremo Tribunal de Justiça' }, { id: 4, name: 'STF – Certidão de Distribuição do STF' }, { id: 5, name: 'TSE – Certidão de Regularidade Eleitoral' }, { id: 6, name: 'TST – Certidão Negativa de Débitos Trabalhistas' }, { id: 7, name: 'STM – Certidão Negativa de Ações Criminais' }, { id: 8, name: 'TRT – (CEAT) – Certidão de Ações Trabalhistas' }, { id: 9, name: 'TCU – Certidão do Tribunal de Contas' }, { id: 10, name: 'CNJ – Inelegibilidade e Improbidade Administrativa' }, { id: 11, name: 'Certidão de Antecedentes Criminais' }, { id: 12, name: 'Receita Federal – Certidão Negativa de Tributos Federais e Dívida Ativa' }, { id: 13, name: 'SEFAZ – Certidão Negativa de Débitos Tributários Municipais (CND Municipal)' }, { id: 14, name: 'Certidão Negativa de Débitos de Tributos Imobiliários' }, { id: 15, name: 'Junta Comercial – Certidão da Empresa' }, { id: 16, name: 'SEFAZ – Certidão Negativa de Débitos Tributários Estaduais (CND Estadual)' }, { id: 17, name: 'MPE – Certidão de Inquérito Criminal' }, { id: 18, name: 'MPE – Certidão de Inquérito Civil' }, { id: 19, name: 'Certidão Negativa de Débitos Ambientais' }, { id: 20, name: 'PGE – Certidão de Tributos da Procuradoria Geral do Estado' }, { id: 21, name: 'Receita Federal – Certidão de Tributos Federais e Dívida da União de Imóvel Rural (ITR)' }, { id: 22, name: 'Receita Federal – Cadastro de Imóveis Rurais (CAFIR)' }, { id: 23, name: 'FGTS – Certidão Negativa do FGTS' }, { id: 24, name: 'Certidão Negativa de Débitos (CND) do Ibama' }, { id: 25, name: 'MT – Certidão de Cumprimento da Cota Legal de PCDs' }, { id: 26, name: 'MT – Certidão de Infrações Trabalhistas' }, { id: 27, name: 'MT – Certidão de Débitos' }, { id: 28, 'name': 'MPF – Certidão Negativa' }, { id: 29, name: 'Certidão IBAMA – Certidão de Embargos' }, { id: 30, name: 'Certidão de Propriedade de Aeronave' },
  ].map(cert => {
    const slug = toSlug(cert.name);
    return {
      ...cert,
      slug: slug,
      category: 'Certidões Federais e Estaduais',
      icon: [1, 2, 3, 7, 8, 17, 18, 28].includes(cert.id) ? icons.JUSTICE : icons.DOCUMENT,
      imageSrc: `/product-images/${slug}.png`,
      description: `Emissão online da ${cert.name} junto a órgãos federais e estaduais.`,
      longDescription: `Informações detalhadas sobre a ${cert.name}. Este documento é essencial para diversas finalidades legais e administrativas, comprovando a situação do requerente perante o órgão emissor.`,
      faq: `Dúvidas frequentes sobre a ${cert.name}. Consulte os prazos e documentos necessários.`,
      formFields: formTemplateCompleto,
    };
  }),
  
  // --- Assessoria Jurídica (1 item) ---
  {
    id: 50,
    name: 'Assessoria Jurídica (Contrate um advogado)',
    slug: 'assessoria-juridica',
    category: 'Assessoria Jurídica',
    icon: icons.LAWYER,
    imageSrc: '/product-images/assessoria-juridica.png',
    description: 'Precisa de orientação legal? Contrate uma consulta com um de nossos advogados especialistas.',
    customUrl: '/assessoria',
  },
];