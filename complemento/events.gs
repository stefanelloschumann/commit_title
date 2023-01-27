function addEvent(issue, inicio, final) {
    if (issue.subject != undefined) {
        CalendarApp.getCalendarsByName('Redmine')[0].createEvent('#' + issue.id + ' - ' + issue.subject, inicio, final)
    }
    else {
        CalendarApp.getCalendarsByName('Redmine')[0].createEvent('#' + issue['issue'], inicio, final)
    }
}
