function getIssues() {
    var url = Redmine.getBaseUrl() + 'projects/schumann/issues.json/?query_id=484&limit=100'
    var response = UrlFetchApp.fetch(url, Redmine.getHeader())
    dados = response.getContentText()
    return JSON.parse(dados)['issues']
}

function getIssue(id) {
    var url = Redmine.getBaseUrl() + 'issues/' + id + '.json?include=journals'
    var response = UrlFetchApp.fetch(url, Redmine.getHeader())
    dados = response.getContentText()
    return JSON.parse(dados)['issue']
}

function addTask(titulo, issue, prioridade) {
  let due = new Date()
  
  switch(prioridade) {
    case 1: if (due.getHours() >= 16) due.setDate(due.getDate() + 1); break;
    case 2: if (due.getHours() >= 15) due.setDate(due.getDate() + 1); break;
    case 3: if (due.getHours() >= 14) due.setDate(due.getDate() + 1); break;
    default: return
  }

  titulo += ' ' + issue.tracker.name.toLowerCase() + ' #' + issue.id

  let task = {
    title: titulo,
    due: due.toISOString(),
    notes: 'http://redmine.schumann.com.br:81/redmine/issues/' + issue.id,
  }
  task = Tasks.Tasks.insert(task, getTaskListId())
  return task.id
}

function getTaskListId() {
  return 'MDQ2MzIwMzcyODExNTMyNDk1NDc6MDow'
}

function stopTimer(){
  Redmine.finishTimer(null, '')
}

function autoStart() {
  let todayStart = new Date()
  todayStart.setHours(8)
  todayStart.setMinutes(30)
  let day = todayStart.getDay()
  if (day == 0 || day == 6)
    return

  let file = Redmine.getFileTracker()
  let content = file.getBlob().getDataAsString()
  let obj = JSON.parse(content)
  if (obj.issue != undefined)
    return

  let todayEnd = new Date()
  todayEnd.setHours(18)
  todayEnd.setMinutes(00)
  let events = CalendarApp.getDefaultCalendar().getEvents(todayStart, todayEnd)
  if (events.length != 0)
    return

  let issues = getIssues()
  for (let i = 0; i < issues.length; i++)
    if (issues[i].status.id == 2 && issues[i].assigned_to.id == 114) {  // Em desenvolvimento
      Redmine.startTimer(issues[i].id, 'autoStart')
      MailApp.sendEmail('eduardo.stefanello@schumann.com.br', 'Início automático do timer', '#' + issues[i].id + ' - ' + issues[i].subject, {name: 'StartTimer', noReply: true})
      return
    }
}

function getObjFile() {
  let files = Redmine.getFolderRedmine().getFilesByName('issues.json')
  if (files.hasNext())
    return files.next()
  else
    return Redmine.getFolderRedmine().createFile('issues.json', '{}')
}

function getMyIssues() {
  let file = getObjFile()
  let content = file.getBlob().getDataAsString()
  return JSON.parse(content)
}

function setMyIssues(content) {
  var file = getObjFile()
  file.setContent(content)
}