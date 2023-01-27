function getHoras(periodo, pagina, entries) {
    var times = get_time_entries(periodo, pagina)
      
    if (entries != undefined)
        entries.lista = times

    var result = 0
    for (i in times)
        result += times[i]['hours']

    if (times.length > 0)
        return result + getHoras(periodo, ++pagina)

    return result
}


function getHorasOntem(entries) {
    return getHoras('ld', 1, entries)
}


function getHorasDia(entries) {
    return getHoras('t', 1, entries)
}


function getHorasSemana(entries) {
    return getHoras('w', 1, entries)
}


function getHorasMes(entries) {
    return getHoras('m', 1, entries)
}


function getPercentual(alcancado, esperado) {
    if (esperado === 0)
        return 0

    return Math.round(((alcancado * 100) / esperado) * 10) / 10
}


function getDesenvolvimento() {
    issues = get_query(378)

    if (issues.length > 0)
        return issues[0]

    return undefined
}


function getStatusName(id) {
    var statuses = get_status()

    for (i in statuses)
        if (statuses[i]['id'] === id)
            return statuses[i]['name']

    return result
}
