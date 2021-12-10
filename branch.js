let cf_29 = document.getElementsByClassName('cf_29 attribute')[0]

if (cf_29 != undefined && cf_29.lastChild != undefined && cf_29.lastChild.innerText != undefined) {
    let link = document.createElement('a')
    link.href = 'https://github.com/schumannlabs/protheus/tree/' + cf_29.lastChild.innerText.replace('#', '%23')
    link.innerText = cf_29.lastChild.innerText
    cf_29.lastChild.innerText = ''
    cf_29.lastChild.appendChild(link)
}


let cf_20 = document.getElementsByClassName('cf_20 attribute')[0]

if (cf_20 != undefined && cf_20.lastChild != undefined && cf_20.lastChild.innerText != undefined) {
    let link = document.createElement('a')
    link.href = 'https://schumann.movidesk.com/Ticket/Edit/' + cf_20.lastChild.innerText
    link.innerText = cf_20.lastChild.innerText
    cf_20.lastChild.innerText = ''
    cf_20.lastChild.appendChild(link)
}

let cf_29_s = document.getElementsByClassName('cf_29 string')

for (i in cf_29_s) {
    cf_29 = cf_29_s[i]
    if (cf_29 != undefined && cf_29.lastChild != undefined) {
        let link = document.createElement('a')
        link.href = 'https://github.com/schumannlabs/protheus/tree/' + cf_29.innerText.replace('#', '%23')
        link.innerText = cf_29.innerText
        cf_29.innerText = ''
        cf_29.appendChild(link)
    }
}


let cf_20_s = document.getElementsByClassName('cf_20 int')

for (i in cf_20_s) {
    cf_20 = cf_20_s[i]
    if (cf_20 != undefined && cf_20.lastChild != undefined) {
        let link = document.createElement('a')
        link.href = 'https://schumann.movidesk.com/Ticket/Edit/' + cf_20.innerText
        link.innerText = cf_20.innerText
        cf_20.innerText = ''
        cf_20.appendChild(link)
    }
}
