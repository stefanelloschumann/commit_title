function getFileTracker() {
  let files = getFolderRedmine().getFilesByName('tracker.json')
  if (files.hasNext())
    return files.next()
  else
    return getFolderRedmine().createFile('tracker.json', '{}')
}


function getTimer(issue, alert) {
    let retorno = ''
    let file = getFileTracker()
    let content = file.getBlob().getDataAsString()
    let obj = JSON.parse(content)

    if (alert != undefined)
      retorno += getAlert(alert)

    if (obj.issue != undefined){
      retorno += getTimerAtual(obj.issue, issue != obj.issue)

      if (obj.comment == undefined)
        obj.comment = ''

      if (issue == obj.issue)
        retorno += '<div class="input-group mt-2">'
          + '  <input type="text" class="form-control" placeholder="Descrição da atividade" value="' + obj.comment + '" id="commentTextInput" >'
          + '  <button class="input-group-text btn-primary" onclick="' + getTimerFinishEvent(issue) + '">Parar timer</button>'
          + '</div>'
      else
        retorno += '<div class="input-group mt-2">'
          + '  <input type="text" class="form-control" placeholder="Descrição da atividade" value="' + obj.comment + '" id="commentTextInput" >'
          + '  <button class="input-group-text btn-primary" onclick="' + getTimerFinishEvent(issue) + '">Parar timer atual</button>'
          + '  <button class="input-group-text btn-outline-primary" onclick="' + getTimerStartEvent(issue) + '">Iniciar timer</button>'
          + '</div>'

    } else {
        retorno += '<b>Timer da tarefa</b>: Nenhum timer em execução'
        retorno += '<div class="input-group mt-2">'
          + '  <input type="text" class="form-control" placeholder="Descrição da atividade" id="commentTextInput" value="' + getIssueTracker(issue).name + '">'
          + '  <button class="input-group-text btn-primary" onclick="' + getTimerStartEvent(issue) + '">Iniciar timer</button>'
          + '</div>'
    }

    return retorno + '<hr class="my-2">'
}


function finishTimer(issue, comment) {
  var file = getFileTracker()
  let content = file.getBlob().getDataAsString()
  let obj = JSON.parse(content)

  if (obj.inicio == undefined)
    return

  var inicio = new Date(obj.inicio)
  var final = new Date()
  var hours = Math.abs(inicio - final) / 36e5

  postTimeEntry(obj.issue, hours, obj.activity, comment || obj.comment)
  file.setContent('{}')

  addEvent(getIssueObject(obj.issue), inicio, final)

  let alert = 'Tempo gasto: ' + (Math.round(hours * 100) / 100).toString() + ' h'
  return getTimer(issue, alert)
}


function startTimer(issue, comment) {
  let inicio = new Date()
  let file = getFileTracker()
  if (comment == 'Reunião')
    file.setContent('{"issue": ' + issue + ', "inicio": "' + inicio.toJSON() + '", "comment": "' + comment + '", "activity": 12}')
  else
    file.setContent('{"issue": ' + issue + ', "inicio": "' + inicio.toJSON() + '", "comment": "' + comment + '", "activity": 9}')

  return getTimer(issue)
}


function addEvent(issue, inicio, final) {
    getCalendar().createEvent('#' + issue.id + ' - ' + issue.subject, inicio, final)
}


function getTimerFinishEvent(issue) {
  return "google.script.run.withSuccessHandler(function(conteudo){document.getElementById('timer').innerHTML = conteudo}).finishTimer("
    + issue + ", document.getElementById('commentTextInput').value)"
}


function getTimerStartEvent(issue) {
  return "google.script.run.withSuccessHandler(function(conteudo){document.getElementById('timer').innerHTML = conteudo}).startTimer("
    + issue + ", document.getElementById('commentTextInput').value)"
}


function getAlert(alert, type) {
  if (type == undefined)
    type = 'success'

  return '<div class="alert alert-' + type + ' alert-dismissible fade show m-2" role="alert">'
    + alert
    + ' <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'
    + '</div>'
}


function getTimerAtual(issue, showIssue) {
  let file = getFileTracker()
  let content = file.getBlob().getDataAsString()
  let obj = JSON.parse(content)
  let inicio = new Date(obj['inicio'])
  let retorno = 'Iniciado às ' + inicio.getHours().toString().padStart(2, '0') + ':' + inicio.getMinutes().toString().padStart(2, '0')
  if (showIssue)
    retorno = '<b>Timer atual</b>: Tarefa #' + issue + ' - ' + retorno
  else
    retorno = '<b>Timer da tarefa</b>: ' + retorno
  return retorno
}


function getCalendar() {
  calendars = CalendarApp.getCalendarsByName('redmine')

  if (calendars.length > 0)
    for (i in calendars)
      if (calendars[i].isOwnedByMe())
        return calendars[i]

  return CalendarApp.createCalendar('redmine')
}