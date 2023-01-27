function status01to12(myIssue, obj, issue, journal) { // Aguardando Análise -> Pronta para Desenvolvimento
    if (obj.de != 01 || obj.para != 12)
      return
  
    let idTask = addTask('Desenvolver', issue, 2)
    myIssue.task = idTask
  }
  
  function status12to02(myIssue, obj, issue, journal) { // Pronta para Desenvolvimento -> Em desenvolvimento
    if (obj.de != 12 || obj.para != 02)
      return
  
    Redmine.startTimer(issue.id, '')
  }
  
  function status02to03(myIssue, obj, issue, journal) { // Em desenvolvimento -> Desenvolvida
    if (obj.de != 02 || obj.para != 03)
      return
  
    if (myIssue.task != undefined) {
      let task = Tasks.newTask().setStatus('completed');
      Tasks.Tasks.patch(task, getTaskListId(), myIssue.task);
      myIssue.task = undefined
    }
  
    Redmine.finishTimer(null, '')
  }
  
  function status03to04(myIssue, obj, issue, journal) { // Desenvolvida -> Em testes
    if (obj.de != 03 || obj.para != 04)
      return 
  }
  
  function status04to10(myIssue, obj, issue, journal) { // Em testes -> Testado
    if (obj.de != 04 || obj.para != 10)
      return
  
    let idTask = addTask('Preparar', issue, 3)
    myIssue.task = idTask
  }
  
  function status04to11(myIssue, obj, issue, journal) { // Em testes -> Aguardando Correção
    if (obj.de != 04 || obj.para != 11)
      return
  
    let idTask = addTask('Corrigir', issue, 1)
    myIssue.task = idTask
  
    let mail = ''
    if (journal.notes != undefined)
      mail += '\n' + journal.notes
  
    MailApp.sendEmail(
      'eduardo.stefanello@schumann.com.br',
      'Correção da tarefa #' + issue.id,
      '#' + issue.id + ' - ' + issue.subject + mail,
      {name: 'Corrigir', noReply: true})
  }
  
  function status11to02(myIssue, obj, issue, journal) { // Aguardando Correção -> Em desenvolvimento
    if (obj.de != 11 || obj.para != 02)
      return
  
    Redmine.startTimer(issue.id, '')
  }
  
  function status10to13(myIssue, obj, issue, journal) { // Testado -> Pronta para Produção
    if (obj.de != 10 || obj.para != 13)
      return
  
    if (myIssue.task != undefined) {
      let task = Tasks.newTask().setStatus('completed');
      Tasks.Tasks.patch(task, getTaskListId(), myIssue.task);
      myIssue.task = undefined
    }
  }
  
  function status13to15(myIssue, obj, issue, journal) { // Pronta para Produção -> Em produção
    if (obj.de != 13 || obj.para != 15)
      return
  
    if (myIssue.task != undefined) {
      let task = Tasks.newTask().setStatus('completed');
      Tasks.Tasks.patch(task, getTaskListId(), myIssue.task);
      myIssue.task = undefined
    }
  }
  