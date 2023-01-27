var hoje = new Date()

function getResumoOntem() {
    var entries = {lista: null}
    var horas = Math.round(getHorasOntem(entries) * 100) / 100

    return CardService.newDecoratedText()
        .setText(horas + ' horas')
        .setTopLabel('Ontem')
        .setEndIcon(CardService.newIconImage()
            .setIcon(CardService.Icon.CLOCK))
        .setOnClickAction(CardService.newAction()
            .setFunctionName("getTimeEntriesAction")
            .setParameters({'entries': JSON.stringify(entries), 'consulta': 'Ontem'}))
}


function getResumoHoje() {
    var entries = {lista: null}
    var horas = Math.round(getHorasDia(entries) * 100) / 100

    return CardService.newDecoratedText()
        .setText(horas + ' horas')
        .setTopLabel('Hoje')
        .setEndIcon(CardService.newIconImage()
            .setIcon(CardService.Icon.CLOCK))
        .setOnClickAction(CardService.newAction()
            .setFunctionName("getTimeEntriesAction")
            .setParameters({'entries': JSON.stringify(entries), 'consulta': 'Hoje'}))
}


function getResumoHoras() {
    var section = CardService.newCardSection()
        .setHeader('produção')
        .addWidget(getResumoOntem())
        .addWidget(getResumoHoje())

    return section
}
