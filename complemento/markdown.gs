exemplo = '*1. Objetivo:*' + '\n' +
  '* Implementar tela de Quitação de Consignado por Rescisão.' + '\n' +
  '' + '\n' +
  '*2. Visão Geral da Questão:*' + '\n' +
  '* Necessária a criação de uma nova rotina para quitação de consignados no momento da rescisão de contrato, pois deve-se aplicar descontos.' + '\n' +
  ' ' + '\n' +
  '*3. Visão do Analista(Sugestões de Ajustes e Testes Realizados)*' + '\n' +
  '* Verificada rotina de Baixa de Títulos Tipo CCF: *SCH06M82*;' + '\n' +
  '* Verificado junto com a solicitante que não existe a possibilidade de inserir um desconto nesta tela;' + '\n' +
  '* Como a tela é somente para as baixas de títulos que são descontados em folha, trataremos a solicitação desta atividade em uma nova rotina;' + '\n' +
  '' + '\n' +
  '* Criar uma nova rotina, com a mesma estrutura de layout da rotina: *SCH06M82*;' + '\n' +
  '* Nesta nova rotina será necessário:' + '\n' +
  '' + '\n' +
  '#### Nome Rotina: *Quitação de Consignado Tipo CCF Por Rescisão*' + '\n' +
  '# Criar um Parâmetro para que seja inserido dentro do mesmo o código do usuário que poderá utilizar a rotina;' + '\n' +
  '# Criar validação de parâmetro para acesso a rotina;' + '\n' +
  '# Quando selecionada, incluir junto aos parâmetros o campo de busca por CPF do colaborador;' + '\n' +
  '# A busca deve trazer apenas os dados do CPF incluso no parâmetro criado acima;' + '\n' +
  '# Inserir na grid de dados, um campo editável pelo usuário, chamado *DESCONTO*, isso em cada linha de título;' + '\n' +
  '# Realizar a baixa dos Títulos Tipo CCF contemplando o *DESCONTO* inserido no campo criado acima;' + '\n' +
  '# Processo da baixa e telas podem ser baseadas na rotina já existente: *SCH06M82*.' + '\n'


function parseInside(txt, left, right) {
  return left + txt + right;
}

function getFormatedText(text) {
  text = text.replace(/\*(\S[\s\S]*?)\*/g, function (wm, m) {
    return (/\S$/.test(m)) ? parseInside(m, '<b>', '</b>') : wm
  })
  return text
}