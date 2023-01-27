function getTimeEntriesAction(event) {
    var interface = CardService.newCardBuilder()
    var section = CardService.newCardSection()
    var hours = 0

    var entries = JSON.parse(event.parameters.entries)

    function compare(a, b) {
        if (a.comments < b.comments)
            return -1
        if (a.comments > b.comments)
            return 1
        return 0
    }

    entries['lista'].sort(compare)

    for (i in entries['lista']){
        hours += entries['lista'][i].hours

        if (entries['lista'][i] == null || entries['lista'][i].activity.id == 12)
          continue

        let issue = get_issue(entries['lista'][i].issue.id)

        section.addWidget(CardService.newDecoratedText()
            .setText(entries['lista'][i].comments)
            .setBottomLabel(entries['lista'][i].hours)
            .setTopLabel(issue['subject'])
            .setOpenLink(CardService.newOpenLink()
                .setUrl('http://redmine.schumann.com.br:81/redmine/issues/' + entries['lista'][i].issue.id.toString())))
    }
    
    interface.setHeader(CardService.newCardHeader()
        .setTitle(event.parameters.consulta)
        .setSubtitle('Total: ' + (Math.round(hours * 100) / 100).toString() + ' horas'))
        .addSection(section)
    return interface.build()
}
