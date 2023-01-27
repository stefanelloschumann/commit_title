var hoje = new Date()

function addIssue(section, issue) {
    var text = issue['subject'].replace(/[A-Z]{1}[0-9]{3} - /, '')
    if (issue['status']['id'] == 11)
        text = '<b>' + text + '</b>'
    section.addWidget(CardService.newDecoratedText()
            .setText(text)
            .setTopLabel('#' + issue['id'])
            .setWrapText(true)
            .setBottomLabel(getStatusName(issue['status']['id']))
            .setOnClickAction(CardService.newAction()
                .setFunctionName("getIssueAction")
                .setParameters({'issue': JSON.stringify(issue)})))
}


function getPlanejamento() {
    var issues = get_query(379)
    var section = CardService.newCardSection()
        .setHeader('Planejamento')

    for (i in issues)
        addIssue(section, issues[i])

    if (issues.length == 0)
        section.addWidget(CardService.newTextParagraph()
            .setText(''))

    return section
}
