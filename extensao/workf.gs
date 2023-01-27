function getWorkf(issue, alert) {
  let retorno = '<b>Workflow:</b><br>'
  let issue_obj = getIssueObject(issue)

  if (alert != undefined)
    retorno += getAlert(alert, 'warning')

  retorno += '<table><tr><td style="padding-right: 10px;"><i>Commit:</i><br>' 
    + getCommit(issue) + '</td><td><i>Branch:</i><br>' 
    + getBranch(issue_obj) + '</td></tr></table>'

  retorno += getWorkForm(issue_obj)
  retorno += getWorkJob(issue_obj)
  retorno += getWorkAction(issue_obj)

  return retorno + '<hr class="my-2">'
}


function getCommit(issue) {
  return 'Kanban Correções - #' + issue
}


function getBranch(issue_obj) {
  let retorno = 'kanbancorrecoes/'
  if (issue_obj.tracker.id == 2 || issue_obj.tracker.id == 4)
    retorno += 'feat/'
  else if (issue_obj.tracker.id == 1)
    retorno += 'hotfix/'
  retorno += '#' + issue_obj.id
  return retorno
}


function getWorkForm(issue_obj) {
  if (issue_obj.status.id == 12) /* Pronta para desenvolvimento */
    return ''
  if (issue_obj.status.id == 2) /* Em desenvolvimento */
    return getFormDesenvolvimento(issue_obj)
  if (issue_obj.status.id == 10) /* Testado */
    return getFormTestado(issue_obj)
  if (issue_obj.status.id == 15) /* Em produção */
    return getFormProducao(issue_obj)
  return ''
}

function getFormDesenvolvimento(issue_obj) {
  return ''
    + '  <textarea class="form-control mt-2" id="notasInputText" rows="2" placeholder="Anotações"></textarea>'
    + '  <input type="text" class="form-control mt-2" id="fontesInputText" placeholder="Fontes alterados">'
    + '  <textarea class="form-control mt-2" id="roteiroInputText" rows="2" placeholder="Roteiro de testes"></textarea>'
}

function getFormTestado(issue_obj) {
  return '<div class="mb-2">'
    + '  <label for="requestInputText" class="form-label mt-2">Número da <i>pull request<i>:</label>'
    + '  <input type="email" class="form-control" id="requestInputText">'
    + '</div>'
}

function getFormProducao(issue_obj) {
  for (i in issue_obj.custom_fields)
    if (issue_obj.custom_fields[i].id == 20) /* Ticket Movidesk */
      return '<i class="mt-2">Movidesk:</i><br>' + issue_obj.custom_fields[i].value
  return 'Sem ticket movidesk'
}

function getWorkAction(issue_obj) {
  if (issue_obj.status.id == 12 || issue_obj.status.id == 7 || issue_obj.status.id == 11) /* Pronta para desenvolvimento, Impedimento, Aguardando Correção */
    return getActionPronta(issue_obj)
  if (issue_obj.status.id == 2) /* Em desenvolvimento */
    return getActionDesenvolvimento(issue_obj)
  if (issue_obj.status.id == 10) /* Testado */
    return getActionTestado(issue_obj)
  if (issue_obj.status.id == 15) /* Em produção */
    return getActionProducao(issue_obj)
  return ''
}

function getActionPronta(issue_obj) {
  return '<button type="button" class="btn btn-primary mt-2" onclick="'
      + "google.script.run.withSuccessHandler(function(conteudo){document.getElementById('workf').innerHTML = conteudo}).actionPronta(" 
        + issue_obj.id + ")"
    + '">Em desenvolvimento</button>'
}

function actionPronta(issue) {
    var data = {"issue": {"status_id": 2}} /* Em desenvolvimento */

    putIssueData(issue, data)

    return getWorkf(issue, 'Situação alterada. Atualize a página')
}

function getActionDesenvolvimento(issue_obj) {
  return '<div class="btn-group" role="group" aria-label="Basic example">'
      + '<button type="button" class="btn btn-primary mt-2" onclick="'
        + "google.script.run.withSuccessHandler(function(conteudo){document.getElementById('workf').innerHTML = conteudo}).actionDesenvolvimento(" 
          + issue_obj.id + ', '
          + "document.getElementById('notasInputText').value,"
          + "document.getElementById('fontesInputText').value,"
          + "document.getElementById('roteiroInputText').value,'" + getBranch(issue_obj) + "')"
      + '">Desenvolvida</button>'
      + '<button type="button" class="btn btn-secondary mt-2" onclick="'
                + "google.script.run.withSuccessHandler(function(conteudo){document.getElementById('workf').innerHTML = conteudo}).actionImpedimento(" 
          + issue_obj.id + ', '
          + "document.getElementById('notasInputText').value)"
      + '">Impedimento</button>'
    + '</div>'
}

function actionDesenvolvimento(issue, notas, fontes, roteiro, branch) {
    var data = {"issue": {
      "status_id": 3,
      "notes": notas,
      "custom_fields": [
          {"id": 21, "value": fontes},
          {"id": 29, "value": branch},
          {"id": 22, "value": roteiro}]
    }} /* Desenvolvida */

    putIssueData(issue, data)

    return getWorkf(issue, 'Situação alterada. Atualize a página')
}

function actionImpedimento(issue, notas) {
    var data = {"issue": {
      "status_id": 7,
      "notes": notas
    }} /* Impedimento */

    putIssueData(issue, data)

    return getWorkf(issue, 'Situação alterada. Atualize a página')
}

function getActionTestado(issue_obj) {
  return '<button type="button" class="btn btn-primary mt-2" onclick="'
    + "google.script.run.withSuccessHandler(function(conteudo){document.getElementById('workf').innerHTML = conteudo}).actionTestado(" 
      + issue_obj.id + ', '
      + "document.getElementById('requestInputText').value)"
    + '">Pronta para produção</button>'
}

function actionTestado(issue, request) {
    var data = {"issue": {
      "status_id": 13,
      "notes": '"Pull request ' + request + '":https://github.com/schumannlabs/protheus/pull/' + request
    }} /* Pronto para produção */

    putIssueData(issue, data)

    return getWorkf(issue, 'Situação alterada. Atualize a página')
}

function getActionProducao(issue_obj) {
  return '<button type="button" class="btn btn-primary mt-2" onclick="'
    + "google.script.run.withSuccessHandler(function(conteudo){document.getElementById('workf').innerHTML = conteudo}).actionProducao(" + issue_obj.id + ")"
    + '">Finalizada</button>'
}

function actionProducao(issue) {
    var data = {"issue": {"status_id": 5}} /* Finalizado */

    putIssueData(issue, data)

    return getWorkf(issue, 'Situação alterada. Atualize a página')
}

function getWorkJob(issue_obj) {
  retorno = ''
  if (issue_obj.status.id == 7) /* Impedimento */
    retorno = 'Resolver os impedimentos com o analista ou líder técnico'
  if (issue_obj.status.id == 2) /* Em desenvolvimento */
    retorno = 'Desenvolver os requisitos ou correções'
  if (issue_obj.status.id == 10) /* Testado */
    return '<p class="mt-3 mb-0"><i>Executar checklist no servidor de produção</i></p>'
      + '<ul class="mb-0"><li>Menus</li>'
      + '<li>Parâmetros</li>'
      + '<li>Definições de tabelas</li>'
      + '<li><b>Tasks anotadas</b></li></ul>'
  if (issue_obj.status.id == 15) /* Em produção */
    retorno = 'Realizar a entrega no Movidesk'
  if (retorno != '')
    return '<p class="mt-3 mb-0"><i>' + retorno + '</i></p>'
  return ''
}