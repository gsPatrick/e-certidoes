// Salve em: src/utils/imagePaths.js
// Este arquivo centraliza todos os caminhos das imagens dos produtos.
// A chave é o "slug" da certidão para fácil associação.

export const productImagePaths = {
  // Cartório de Registro de Imóveis
  'certidao-de-imovel': '/certidoes/certidao-de-imovel.png',
  'visualizacao-de-matricula': '/certidoes/visualizacao-de-matricula.png',
  'certidao-de-matricula-com-onus-e-acoes': '/certidoes/certidao-de-matricula-com-onus-e-acoes.png',
  'certidao-de-penhor-e-safra': '/certidoes/certidao-de-penhor-e-safra.png',
  'pacote-de-certidoes-compra-e-venda-de-imoveis': '/certidoes/pacote-de-certidoes-compra-e-venda-de-imoveis.png',
  // *** ENTRADAS ADICIONADAS PARA PESQUISAS DE IMÓVEIS ***
  'pesquisa-previa-de-imoveis-por-cpf-cnpj': '/certidoes/pesquisa.png',
  'pesquisa-qualificada-de-imoveis-por-cpf-cnpj': '/certidoes/pesquisa.png',

  // Cartório de Registro Civil
  'certidao-de-nascimento': '/certidoes/certidao-de-nascimento.png',
  'certidao-de-casamento': '/certidoes/certidao-de-casamento.png',
  'certidao-de-obito': '/certidoes/certidao-de-obito.png',
  'certidao-de-interdicao': '/certidoes/certidao-de-interdicao.png',

  // Tabelionato de Notas (Escrituras)
  'certidao-de-escritura-de-compra-e-venda': '/certidoes/certidao-de-escritura-de-compra-e-venda.png',
  'certidao-de-procuracao': '/certidoes/certidao-de-procuracao.png',
  'certidao-de-escritura-de-ata-notarial': '/certidoes/certidao-de-escritura-de-ata-notarial.png',
  'certidao-de-escritura-de-pacto-antenupcial': '/certidoes/certidao-de-escritura-de-pacto-antenupcial.png',
  'certidao-de-escritura-de-doacao': '/certidoes/certidao-de-escritura-de-doacao.png',
  'certidao-de-escritura-de-hipoteca': '/certidoes/certidao-de-escritura-de-hipoteca.png',
  'certidao-de-escritura-de-testamento': '/certidoes/certidao-de-escritura-de-testamento.png',
  'certidao-de-escritura-de-uniao-estavel': '/certidoes/certidao-de-escritura-de-uniao-estavel.png',
  'certidao-de-escritura-de-permuta': '/certidoes/certidao-de-escritura-de-permuta.png',
  'certidao-de-escritura-de-inventario': '/certidoes/certidao-de-escritura-de-inventario.png',
  'certidao-de-escritura-de-divorcio': '/certidoes/certidao-de-escritura-de-divorcio.png',
  'certidao-de-escritura-de-emancipacao': '/certidoes/certidao-de-escritura-de-emancipacao.png',
  // *** LINHA MODIFICADA ***
  'pesquisa-escrituras-e-procuracoes-por-cpf-cnpj': '/certidoes/pesquisa.png',
  
  // Cartório de Protesto
  'certidao-de-protesto': '/certidoes/certidao-de-protesto.png',
  
  // Pesquisa
  'pesquisa-completa-de-veiculo': '/certidoes/pesquisa.png',
  'pesquisa-leilao-de-veiculo': '/certidoes/pesquisa.png',
  'pesquisa-gravame-de-veiculo': '/certidoes/pesquisa.png',
  'historico-de-roubo-ou-furto-de-veiculo': '/certidoes/pesquisa.png',
  'pesquisa-processos-judiciais-e-administrativos': '/certidoes/pesquisa.png',
  'pesquisa-telefone-e-endereco-pelo-cpf-cnpj': '/certidoes/pesquisa.png',
  'pesquisa-sintegra-estadual': '/certidoes/pesquisa.png',

  // Certidões Federais e Estaduais
  'certidao-de-distribuicao-da-justica-federal-trf': '/certidoes/certidao-de-distribuicao-da-justica-federal-trf.png',
  'certidao-do-distribuidor-stf': '/certidoes/certidao-do-distribuidor-stf.png',
  'certidao-do-stj': '/certidoes/certidao-do-stj.png',
  'certidao-negativa-de-acoes-criminais-stm': '/certidoes/certidao-negativa-de-acoes-criminais-stm.png',
  'certidao-de-antecedentes-criminais': '/certidoes/certidao-de-antecedentes-criminais.png',
  'certidao-negativa-do-ministerio-publico-federal-mpf': '/certidoes/certidao-negativa-do-ministerio-publico-federal-mpf.png',
  'certidao-negativa-de-debitos-trabalhistas-cndt-tst': '/certidoes/certidao-negativa-de-debitos-trabalhistas-cndt-tst.png',
  'certidao-de-cumprimento-da-cota-de-pcds-mt': '/certidoes/certidao-de-cumprimento-da-cota-de-pcds-mt.png',
  'certidao-de-debitos-trabalhistas-mt': '/certidoes/certidao-de-debitos-trabalhistas-mt.png',
  'certidao-de-infracoes-trabalhistas-mt': '/certidoes/certidao-de-infracoes-trabalhistas-mt.png',
  'certidao-negativa-do-fgts': '/certidoes/certidao-negativa-do-fgts.png',
  'cadastro-de-imoveis-rurais-cafir': '/certidoes/cadastro-de-imoveis-rurais-cafir.png',
  'certidao-de-tributos-federais-de-imovel-rural-itr': '/certidoes/certidao-de-tributos-federais-de-imovel-rural-itr.png',
  'certidao-de-embargos-ibama': '/certidoes/certidao-de-embargos-ibama.png',
  'certidao-negativa-de-debitos-cnd-do-ibama': '/certidoes/certidao-negativa-de-debitos-cnd-do-ibama.png',
  'certidao-negativa-de-debitos-da-uniao-cntnida': '/certidoes/certidao-negativa-de-debitos-da-uniao-cntnida.png',
  'certidao-de-quitacao-eleitoral-tse': '/certidoes/certidao-de-quitacao-eleitoral-tse.png',
  'certidao-de-improbidade-administrativa-cnj': '/certidoes/certidao-de-improbidade-administrativa-cnj.png',
  'certidao-do-tribunal-de-contas-tcu': '/certidoes/certidao-do-tribunal-de-contas-tcu.png',
  'certidao-de-propriedade-de-aeronave': '/certidoes/certidao-de-propriedade-de-aeronave.png',
  'certidao-de-distribuicao-estadual-tj': '/certidoes/certidao-de-distribuicao-estadual-tj.png',
  'certidao-de-inquerito-criminal-mpe': '/certidoes/certidao-de-inquerito-criminal-mpe.png',
  'certidao-de-inquerito-civil-mpe': '/certidoes/certidao-de-inquerito-civil-mpe.png',
  'certidao-de-acoes-trabalhistas-ceat-trt': '/certidoes/certidao-de-acoes-trabalhistas-ceat-trt.png',
  'certidao-negativa-de-debitos-ambientais': '/certidoes/certidao-negativa-de-debitos-ambientais.png',
  'certidao-negativa-de-debitos-tributarios-estaduais-cnd': '/certidoes/certidao-negativa-de-debitos-tributarios-estaduais-cnd.png',
  'certidao-de-tributos-da-procuradoria-geral-pge': '/certidoes/certidao-de-tributos-da-procuradoria-geral-pge.png',
  'certidao-da-empresa-junta-comercial': '/certidoes/certidao-da-empresa-junta-comercial.png',

  // Assessoria Jurídica
  'consulta-juridica': '/certidoes/consulta-juridica.png',
};