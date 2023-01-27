function getIssueAction(event, notification) {
    Logger.log(event)
    Logger.log(notification)
    var issue_obj = JSON.parse(event.parameters.issue)
    var interface = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader()
            .setTitle(issue_obj.subject))
        .addSection(CardService.newCardSection()
            .setHeader('descrição')
            .addWidget(CardService.newTextParagraph()
                .setText('<a href="http://redmine.schumann.com.br:81/redmine/issues/' + issue_obj.id + '">' + issue_obj.tracker.name + ' #' + issue_obj.id + ' - ' + issue_obj.status.name + '</a>'))
            .addWidget(CardService.newTextParagraph()
                .setText(getFormatedText(issue_obj.description)
                    .replace('\r\n\r\n', '\r\n')
                    .replace('\r\n\r\n', '\r\n')
                    .replace('\r\n\r\n', '\r\n'))))

    var section_historico = CardService.newCardSection()
        .setHeader('histórico')
        .setNumUncollapsibleWidgets(1)
        .setCollapsible(true)

    if (getJournals(issue_obj.id, section_historico))
        interface.addSection(section_historico)

    var section_tempo = CardService.newCardSection()
        .setHeader('tempo')

    if (configurarSectionTempo(issue_obj, section_tempo))
        interface.addSection(section_tempo)

    var section_workflow = CardService.newCardSection()
        .setHeader('workflow')

    if (getWorkflow(issue_obj, section_workflow))
        interface.addSection(section_workflow)

    let retorno = CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation()
            .popToRoot()
            .pushCard(interface.build()))

    if (notification != undefined)
        retorno.setNotification(CardService.newNotification()
            .setText(notification))

    return retorno.build()
}


function getJournals(issue_id, section) {
    var journals = get_issue(issue_id)['journals']
    var retorno = false
    for (i in journals) {
        if (journals[i].notes != null && journals[i].notes != '') {
            var retorno = true
            data = new Date(journals[i].created_on)
            let dataFormatada = ((data.getDate())) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear()

            section.addWidget(CardService.newDecoratedText()
                    .setText(journals[i].notes
                        .replace('\r\n\r\n', '\r\n')
                        .replace('\r\n\r\n', '\r\n')
                        .replace('\r\n\r\n', '\r\n'))
                    .setTopLabel(journals[i].user.name)
                    .setBottomLabel(dataFormatada)
                    .setWrapText(true))
        }
    }
    return retorno
}
