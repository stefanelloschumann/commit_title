function getFolderRedmine() {
  let folders = DriveApp.getFoldersByName('redmine')
  if (folders.hasNext())
    return folders.next()
  else
    return DriveApp.createFolder('redmine')
}

function getFileModules() {
  let files = getFolderRedmine().getFilesByName('modules.json')
  if (files.hasNext())
    return files.next()
  else
    return getFolderRedmine().createFile('modules.json', '{"workf": false, "notas": true, "tasks": true, "timer": true}')
}

function getAllowWofkf() {
  let file = getFileModules()
  let content = file.getBlob().getDataAsString()
  let obj = JSON.parse(content)
  return (obj['workf'] != undefined && obj['workf'])
}

function getAllowNotas() {
  let file = getFileModules()
  let content = file.getBlob().getDataAsString()
  let obj = JSON.parse(content)
  return (obj['notas'] != undefined && obj['notas'])
}

function getAllowTasks() {
  let file = getFileModules()
  let content = file.getBlob().getDataAsString()
  let obj = JSON.parse(content)
  return (obj['tasks'] != undefined && obj['tasks'])
}

function getAllowTimer() {
  let file = getFileModules()
  let content = file.getBlob().getDataAsString()
  let obj = JSON.parse(content)
  return (obj['timer'] != undefined && obj['timer'])
}