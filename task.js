let issue = window.location.href.split(/([0-9]{4,5})/)[1]

var sidebar = document.getElementById('sidebar')

var iframe = document.createElement('iframe')
iframe.src = 'https://script.google.com/a/macros/schumann.com.br/s/AKfycbyozfcPm70FMkZ5RhHluoX2QgmqGeZJ2E3UFmU75RcSl82E3eobQGK3JRe99Df_x4Td/exec' + '?issue=' + issue
iframe.style = 'border: 0px; padding-top: 20px; height: 800px; width: 350px'

sidebar.insertBefore(iframe, sidebar.firstElementChild)
