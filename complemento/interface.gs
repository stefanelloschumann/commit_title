function getInterface(event) {
    return CardService.newCardBuilder()
        .addSection(getResumoHoras())
        .addSection(getChamadoAtual())
        .addSection(getPlanejamento())
        .build()
}
