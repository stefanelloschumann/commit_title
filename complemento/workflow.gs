function getWorkflow(issue_obj, section) {   
    if (issue_obj['status']['id'] == 12 || issue_obj['status']['id'] == 11) {
        section.addWidget(CardService.newDecoratedText()
            .setEndIcon(CardService.newIconImage()
              .setIcon(CardService.Icon.DESCRIPTION))
            .setTopLabel('Branch')
            .setText(getBranchName(issue_obj)))
        .addWidget(CardService.newTextButton()
                .setText('Em desenvolvimento').setOnClickAction(CardService.newAction()
.setFunctionName('paraDesenvolvimento').setParameters({'issue': JSON.stringify(issue_obj)}))
        )
        return true
    }
    if (issue_obj['status']['id'] == 2) { /* Em Desenvolvimento */
        section.addWidget(CardService.newTextInput()
            .setTitle('Notas')
            .setFieldName('notas')
            .setMultiline(true))
        .addWidget(CardService.newTextInput()
            .setTitle('Fontes')
            .setFieldName('fonte')
            .setMultiline(true))
        .addWidget(CardService.newTextInput()
            .setTitle('Roteiro de testes')
            .setFieldName('testes')
            .setMultiline(true))
        .addWidget(CardService.newDecoratedText()
            .setEndIcon(CardService.newIconImage()
              .setIcon(CardService.Icon.DESCRIPTION))
            .setTopLabel('Commit')
            .setText(getCommitName(issue_obj))
            .setBottomLabel(getBranchName(issue_obj)))
        .addWidget(CardService.newTextButton()
            .setText('Desenvolvida')
            .setOnClickAction(CardService.newAction()
                .setFunctionName('paraDesenvolvida')
                .setParameters({'issue': JSON.stringify(issue_obj)}))
        )
        return true
    }
    if (issue_obj['status']['id'] == 10) {
        section.addWidget(CardService.newTextInput()
            .setTitle('Notas')
            .setFieldName('notas')
            .setMultiline(true))
        .addWidget(CardService.newTextInput()
            .setTitle('Pull request (id)')
            .setFieldName('pull'))
        .addWidget(CardService.newTextButton()
            .setText('Criar pull request')
            .setOpenLink(CardService.newOpenLink()
                .setUrl("https://github.com/schumannlabs/protheus/compare/" + getBranchName(issue_obj).replace('#', '%23'))))
        .addWidget(CardService.newTextButton()
            .setText('Pronta para produção')
            .setOnClickAction(CardService.newAction()
                .setFunctionName('paraProducao').setParameters({'issue': JSON.stringify(issue_obj)}))
        )
        return true
    }
    if (issue_obj['status']['id'] == 15) {
        section.addWidget(CardService.newTextInput()
              .setTitle('Notas')
              .setFieldName('notas')
              .setMultiline(true))
            .addWidget(CardService.newDecoratedText()
                .setTopLabel('Movidesk')
                .setText(getTicketMovidesk(issue_obj) || ''))
            .addWidget(CardService.newTextButton()
                .setText('Entregar no movidesk')
                .setOpenLink(CardService.newOpenLink()
                    .setUrl("https://schumann.movidesk.com/Ticket/Edit/" + getTicketMovidesk(issue_obj))))
            .addWidget(CardService.newTextButton()
                .setText('Finalizada')
                .setOnClickAction(CardService.newAction()
                    .setFunctionName('paraFinalizado')
                    .setParameters({'issue': JSON.stringify(issue_obj)}))
        )
        return true
    }
    return false
}


function paraDesenvolvimento(event) {
    var issue_obj = JSON.parse(event.parameters.issue)
    var data = {
        "issue": {
            "status_id": 2 
        }
    }

    put_issue_data(issue_obj['id'], data)

    return getIssueAction(event)
}


function paraDesenvolvida(event) {
    var issue_obj = JSON.parse(event.parameters.issue)
    var data = {
        "issue": {
            "notes": event.formInput.notas,
            "status_id": 3,
            "custom_fields": [
                {
                    "id": 21,
                    "value": event.formInput.fonte
                },
                {
                    "id": 29,
                    "value": getBranchName(issue_obj)
                },
                {
                    "id": 22,
                    "value": event.formInput.testes
                }
            ]
        }
    }

    put_issue_data(issue_obj['id'], data)

    return getIssueAction(event)
}


function paraProducao(event) {
    var issue_obj = JSON.parse(event.parameters.issue)
    var data = {
        "issue": {
            "notes": event.formInput.notas + '\r\n\r\n"Pull request ' + event.formInput.pull + '":https://github.com/schumannlabs/protheus/pull/' + event.formInput.pull,
            "status_id": 13
        }
    }

    put_issue_data(issue_obj['id'], data)

    return getIssueAction(event)
}


function paraFinalizado(event) {
    var issue_obj = JSON.parse(event.parameters.issue)
    var data = {
        "issue": {
            "notes": event.formInput.notas,
            "status_id": 5
        }
    }

    put_issue_data(issue_obj['id'], data)

    return getIssueAction(event)
}


function getBranchName(issue_obj) {
    if (issue_obj['tracker']['id'] == 2 || issue_obj['tracker']['id'] == 4)
        return 'kanbancorrecoes/feat/#' + issue_obj['id']
    if (issue_obj['tracker']['id'] == 1)
        return 'kanbancorrecoes/hotfix/#' + issue_obj['id']
    return ''
}


function getCommitName(issue_obj) {
    return 'Kanban Correções - #' + issue_obj['id']
}


function getTicketMovidesk(issue_obj) {
    for (i in issue_obj['custom_fields'])
        if (issue_obj['custom_fields'][i]['id'] == 20)
            return issue_obj['custom_fields'][i]['value']
}
