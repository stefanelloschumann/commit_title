function getFolderRedmine() {
  let folders = DriveApp.getFoldersByName('redmine')
  if (folders.hasNext())
    return folders.next()
  else
    return DriveApp.createFolder('redmine')
}

function getFileApiKey() {
  let files = getFolderRedmine().getFilesByName('apikey.txt')
  if (files.hasNext())
    return files.next()
  else
    return getFolderRedmine().createFile('apikey.txt', '')
}

function get_apikey() {
  return getFileApiKey().getBlob().getDataAsString()
}

var apikey = get_apikey()
var header = {"headers": {"X-Redmine-API-Key": apikey}, 'muteHttpExceptions': true}
var header_post = {"X-Redmine-API-Key": apikey, 'Content-Type': 'application/json'}


function get_issue(id) {
    var url = 'http://redmine.schumann.com.br:81/redmine/issues/' + id + '.json?include=journals'
    var response = UrlFetchApp.fetch(url, header)
    dados = response.getContentText()
    return JSON.parse(dados)['issue']
}


function get_query(id) {
    var url = 'http://redmine.schumann.com.br:81/redmine/projects/schumann/issues.json?query_id=' + id
    var response = UrlFetchApp.fetch(url, header)
    dados = response.getContentText()
    return JSON.parse(dados)['issues']
}


function get_time_entries(periodo, page) {
    var url = 'http://redmine.schumann.com.br:81/redmine/time_entries.json?'
    var spent = 'f[]=spent_on&op[spent_on]=' + periodo
    var user = '&f[]=user_id&op[user_id]=%3D&v[user_id][]=me'
    var options = '&page=' + page
    var response = UrlFetchApp.fetch(url + spent + user + options, header)
    dados = response.getContentText()
    return JSON.parse(dados)['time_entries']
}


function get_status() {
    var url = 'http://redmine.schumann.com.br:81/redmine/issue_statuses.json'
    var response = UrlFetchApp.fetch(url, header)
    dados = response.getContentText()
    return JSON.parse(dados)['issue_statuses']
}


function post_time_entry(issue_id, hours, activity_id, comments) {
    var data = {
        'time_entry': {
            'issue_id': issue_id,
            'hours': hours,
            'activity_id': activity_id,
            'comments': comments
        }
    }

    var options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(data),
      'headers': header_post
    }
    
    UrlFetchApp.fetch('http://redmine.schumann.com.br:81/redmine/time_entries.json', options)
}


function put_issue_data(issue_id, data) {
    var options = {
      'method': 'put',
      'contentType': 'application/json',
      'payload' : JSON.stringify(data),
      'headers': header_post
    }
    Logger.log(issue_id)
    UrlFetchApp.fetch('http://redmine.schumann.com.br:81/redmine/issues/' + issue_id + '.json', options)
}

var hoje = new Date()
var mensagem = ''

function fazerHoje(data) {
    if (data === undefined || data === null) return true
    var teste = new Date(data + ' 08:00')
    Logger.log(teste)
    return teste.getDate() <= hoje.getDate() && teste.getMonth() <= hoje.getMonth() && teste.getFullYear() <= hoje.getFullYear()
}


function addIssue(issue) {
    mensagem += '#' + issue['id'] + ' - ' + issue['subject'] + '<br>'
}
