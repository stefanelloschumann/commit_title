function addJournal(my, rm, issue) {
    if (rm.details != undefined) for (let i in rm.details) {
      if (rm.details[i].property != undefined && rm.details[i].property === 'attr' && rm.details[i].name == 'status_id') {
        obj = {
          de: rm.details[i].old_value,
          para: rm.details[i].new_value,
          data: new Date(rm.created_on)
        }
  
        Logger.log(JSON.stringify(obj) + issue.id)
  
        status02to03(my, obj, issue, rm)
        status01to12(my, obj, issue, rm)
        status12to02(my, obj, issue, rm)
        status03to04(my, obj, issue, rm)
        status04to10(my, obj, issue, rm)
        status04to11(my, obj, issue, rm)
        status11to02(my, obj, issue, rm)
        status10to13(my, obj, issue, rm)
        status13to15(my, obj, issue, rm)
        
        my.journals[rm.id] = obj
      }
    }
  }
  
  function redmine() {
    let agora = new Date()
    if ((agora.getHours() >= 18 && agora.getHours() <= 23) || 
        (agora.getHours() >=  0 && agora.getHours() <= 07) ||
        (agora.getHours() == 12))
      return
  
    let myIssues = getMyIssues()
    let rmIssues = getIssues()
  
    function loop(i) {
      if (rmIssues[i].assigned_to != undefined && rmIssues[i].assigned_to.id != 114)
        return
  
      if (myIssues[rmIssues[i].id] == undefined)
        myIssues[rmIssues[i].id] = {subject: rmIssues[i].subject, journals: {}}
  
      let rmIssue = getIssue(rmIssues[i].id)
      let myIssue = myIssues[rmIssues[i].id]
      
      if (rmIssue.journals != undefined) for (let j in rmIssue.journals) {
        let rmJournal = rmIssue.journals[j]
  
        if (rmJournal != undefined && myIssue.journals[rmJournal.id] == undefined)
          addJournal(myIssue, rmJournal, rmIssue)
      }
    }
  
    for (let i in rmIssues)
      if (rmIssues[i].status.id == 3) // Desenvolvida
        loop(i)
  
    for (let i in rmIssues)
      if (rmIssues[i].status.id != 3) // Outras
        loop(i)
  
    setMyIssues(JSON.stringify(myIssues))
  }
  