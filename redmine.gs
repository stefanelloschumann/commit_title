function getFileApiKey() {
  let files = getFolderRedmine().getFilesByName('apikey.txt')
  if (files.hasNext())
    return files.next()
  else
    return getFolderRedmine().createFile('apikey.txt', '')
}

function getApiKey() {
  return getFileApiKey().getBlob().getDataAsString()
}

function getHeaderPost() {
  return {'X-Redmine-API-Key': getApiKey(), 'Content-Type': 'application/json'}
}

function getHeader() {
  return {"headers": {"X-Redmine-API-Key": getApiKey()}, 'muteHttpExceptions': true}
}

function getBaseUrl() {
  return 'http://redmine.schumann.com.br:81/redmine/'
}

function postTimeEntry(issue_id, hours, activity_id, comments) {
  let data = {
    'time_entry': {
      'issue_id': issue_id,
      'hours': hours,
      'activity_id': activity_id,
      'comments': comments
    }
  }

  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data),
    'headers': getHeaderPost()
  }

  UrlFetchApp.fetch(getBaseUrl() + 'time_entries.json', options)
}

function getIssueObject(id) {
    var url = getBaseUrl() + 'issues/' + id + '.json'//?include=journals'
    var response = UrlFetchApp.fetch(url, getHeader())
    dados = response.getContentText()
    return JSON.parse(dados)['issue']
}

function putIssueData(id, data) {
    var options = {
      'method': 'put',
      'contentType': 'application/json',
      'payload' : JSON.stringify(data),
      'headers': getHeaderPost()
    }
    UrlFetchApp.fetch(getBaseUrl() + 'issues/' + id + '.json', options)
}

function getIssueTracker(issue) {
  return getIssueObject(issue).tracker
}