function getFileNotas() {
  let files = getFolderRedmine().getFilesByName('notes.json')
  if (files.hasNext())
    return files.next()
  else
    return getFolderRedmine().createFile('notes.json', '{}')
}

function getNotas(issue) {
  let retorno = '<b>Anotações privadas:</b><br>'
  retorno += '<textarea class="form-control mt-2" id="anotacoesTextInput" rows="10" onchange="this.disabled=true;' + getNotasEvent(issue) + '">' + getValueNota(issue) + '</textarea>'
  return retorno
}

function getNotasEvent(issue) {
  return "google.script.run.withSuccessHandler(function(conteudo){document.getElementById('notas').innerHTML = conteudo}).anotar('"
    + issue + "', document.getElementById('anotacoesTextInput').value)"
}

function anotar(issue, text) {
  var file = getFileNotas()
  let content = file.getBlob().getDataAsString()
  let obj = JSON.parse(content)

  obj[issue] = text

  file.setContent(JSON.stringify(obj))

  return getNotas(issue)
}

function getValueNota(issue) {
  var file = getFileNotas()
  let content = file.getBlob().getDataAsString()
  let obj = JSON.parse(content)

  return obj[issue] || ''
}