function getChamadoAtual() {
    var chamado = getDesenvolvimento()
    var section = CardService.newCardSection()
        .setHeader('Tarefa atual')

    if (chamado !== undefined) {
        let widget = CardService.newDecoratedText()
            .setText(chamado['subject'].replace(/[A-Z]{1}[0-9]{3} - /, ''))
            .setWrapText(true)
            .setBottomLabel(chamado['description'].replaceAll('*', ''))
            .setOnClickAction(CardService.newAction()
                .setFunctionName("getIssueAction")
                .setParameters({'issue': JSON.stringify(chamado)}))
            .setTopLabel('#' + chamado['id'])
        if (chamadoAtual(chamado['id'])) {
            let file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
            let content = file.getBlob().getDataAsString()
            let obj = JSON.parse(content)
            let inicio = new Date(obj['inicio'])
            widget.setTopLabel('#' + chamado['id'] + ' - Iniciada às ' + inicio.getHours().toString().padStart(2, '0') + ':' + inicio.getMinutes().toString().padStart(2, '0'))
        }
        section.addWidget(widget)
    } else if (possuiAndamento()) {
        let file = DriveApp.getFileById('1gM97iZJRIGI86FDrKxkeEJnv_GWcfkJD')
        let content = file.getBlob().getDataAsString()
        let obj = JSON.parse(content)
        let inicio = new Date(obj['inicio'])
        chamado = get_issue(obj['issue'])
        section.addWidget(CardService.newDecoratedText()
            .setTopLabel('#' + chamado['id'] + ' - Iniciada às ' + inicio.getHours().toString().padStart(2, '0') + ':' + inicio.getMinutes().toString().padStart(2, '0'))
            .setText(chamado['subject'].replace(/[A-Z]{1}[0-9]{3} - /, ''))
            .setWrapText(true)
            .setBottomLabel(chamado['status']['name'])
            .setOnClickAction(CardService.newAction()
                .setFunctionName("getIssueAction")
                .setParameters({'issue': JSON.stringify(chamado)})))
    } else
        section.addWidget(CardService.newTextParagraph()
            .setText('Nenhum chamado em desenvolvimento'))

    return section
}
