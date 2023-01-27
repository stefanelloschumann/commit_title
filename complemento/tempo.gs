function possuiAndamento() {
    let file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
    let content = file.getBlob().getDataAsString()
    let obj = JSON.parse(content)

    return (obj['issue'] != null)
}


function chamadoAtual(issue) {
    let file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
    let content = file.getBlob().getDataAsString()
    let obj = JSON.parse(content)

    return (obj['issue'] != null && obj['issue'] == issue)
}


function configurarSectionTempo(issue, section) {
    let retorno = false
    if (chamadoAtual(issue.id)) {
        section.addWidget(getInput())
        section.addWidget(CardService.newTextButton()
            .setText('Parar Timer')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(CardService.newAction()
                .setFunctionName('finishIssue')
                .setParameters({'issue': JSON.stringify(issue)})))
        let file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
        let content = file.getBlob().getDataAsString()
        let obj = JSON.parse(content)
        let inicio = new Date(obj['inicio'])
        section.addWidget(CardService.newTextParagraph()
            .setText('Iniciada às ' + inicio.getHours().toString().padStart(2, '0') + ':' + inicio.getMinutes().toString().padStart(2, '0')))
        retorno = true
    } else if (possuiAndamento()) {
        section.addWidget(getInput())
        section.addWidget(CardService.newTextButton()
            .setText('Iniciar Timer')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(CardService.newAction()
                .setFunctionName('startIssue')
                .setParameters({'issue': JSON.stringify(issue)})))
        section.addWidget(CardService.newTextButton()
            .setText('Parar Timer atual')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(CardService.newAction()
                .setFunctionName('finishIssue')
                .setParameters({'issue': JSON.stringify(issue)})))
        let file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
        let content = file.getBlob().getDataAsString()
        let obj = JSON.parse(content)
        let inicio = new Date(obj['inicio'])
        section.addWidget(CardService.newTextParagraph()
            .setText('#' + obj['issue'] + ' iniciada às ' + inicio.getHours().toString().padStart(2, '0') + ':' + inicio.getMinutes().toString().padStart(2, '0')))
        retorno = true
    } else {
        section.addWidget(CardService.newTextButton()
            .setText('Iniciar Timer')
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
            .setOnClickAction(CardService.newAction()
                .setFunctionName('startIssue')
                .setParameters({'issue': JSON.stringify(issue)})))
        retorno = true
    }
    return retorno
}


function getInput() {
    var file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
    var content = file.getBlob()
        .getDataAsString()
    var obj = JSON.parse(content)

    return CardService.newTextInput()
        .setTitle('Comentário')
        .setFieldName('comments')
        .setValue(obj['comment'] || '')
}


function startIssue(event) {
    var issue = JSON.parse(event.parameters.issue)
    
    var inicio = new Date()
    let comment = ''

    if (issue.status.id == 2)
        comment = 'Desenvolvimento'
    else if (issue.status.id == 10)
        comment = 'Produção'
    else if (issue.status.id == 15)
        comment = 'Entrega'

    var file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
    file.setContent('{"issue": ' + issue.id + ', "inicio": "' + inicio.toJSON() + '", "comment": "' + comment + '", "activity": 9}')

    return getIssueAction(event)
}


function finishIssue(event) {
    var issue = JSON.parse(event.parameters.issue)

    var file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
    var content = file.getBlob()
        .getDataAsString()
    var obj = JSON.parse(content)
    
    var inicio = new Date(obj['inicio'])
    var final = new Date()
    var hours = Math.abs(inicio - final) / 36e5

    post_time_entry(obj['issue'], hours, obj['activity'], event.formInput.comments || obj['comment']) /** Desenvolvimento */

    file.setContent('{}')

    let mensagem = 'Tempo gasto: ' + (Math.round(hours * 100) / 100).toString() + ' h'

    if (obj['activity'] != 12)
      addEvent(issue, inicio, final)

    if (issue.status.id == 5)
      return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
            .setText(mensagem))
        .setNavigation(CardService.newNavigation()
            .popToRoot().updateCard(getInterface()))
        .build()
    return getIssueAction(event, mensagem)
}


function pararTimerSimples() {
    var file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
    var content = file.getBlob()
        .getDataAsString()
    var obj = JSON.parse(content)

    if (obj['inicio'] == undefined || obj['inicio'] == null)
      return

    var inicio = new Date(obj['inicio'])
    var final = new Date()
    var hours = Math.abs(inicio - final) / 36e5
    
    post_time_entry(obj['issue'], hours, obj['activity'], obj['comment'])
    file.setContent('{}')
    
    if (obj['activity'] != 12)
      addEvent(obj, inicio, final)
}


function iniciarTimerReuniao() {
    var inicio = new Date()

    var file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
    file.setContent('{"issue": 8326, "inicio": "' + inicio.toJSON() + '", "comment": "Reunião", "activity": 12}')

    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation()
            .popToRoot()
            .updateCard(getInterface()))
        .build()
}


function startFile() {
    var file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
    file.setContent('{}')
}
