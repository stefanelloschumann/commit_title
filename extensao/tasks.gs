function getTasks(issue) {
  let taskLists = Tasks.Tasklists.list().items
  let tasks
  let retorno = '<b>Tasks da tarefa:</b> '
  let optionalArgs = {showHidden: true}
  let list
  let encontrou = false
  let possui = false

  if (taskLists && taskLists.length > 0) {
    for (i in taskLists) {
      if (taskLists[i].title == issue) {
        encontrou = true
        list = taskLists[i]
        tasks = Tasks.Tasks.list(list.id, optionalArgs).getItems()
        if (tasks && tasks.length > 0) {
          for (j in tasks) {
            possui = true
            retorno += getCheckTask(list.id, tasks[j], issue)
          }
        }
        break
      }
    }
  }

  if (!possui)
    retorno += 'Nenhuma task'

  if (!encontrou)
    retorno += getNewTaskInput('none', issue)
  else
    retorno += getNewTaskInput(list.id, issue)
  
  return retorno + '<hr class="my-2">'
}


function getCheckTask(list, task, issue){
  let retorno = '<div class="form-check m-0">'
  retorno += '<input class="form-check-input" type="checkbox" id="' + task.id + '" onchange="this.disabled=true;' + getTasksEvent(issue, task, list, 'toggleTask') + '"'
  if (task.status == 'completed')
    retorno += ' checked'
  retorno += '><label class="form-check-label" for="' + task.id + '">'
  retorno +=   task.title
  retorno += '</label>'
  retorno += '</div>'
  return retorno
}


function toggleTask(issue, taskId, listId, completed) {
  var task = Tasks.newTask();
  if (!completed) {
    task.setStatus('completed');
  } else {
    task.setStatus('needsAction');
    task.setCompleted(null);
  }
  Tasks.Tasks.patch(task, listId, taskId);
  return getTasks(issue)
}


function getTasksEvent(issue, task, list, func) {
  if (task.status == 'completed')
    completed = 'true'
  else
    completed = 'false'

  return "google.script.run.withSuccessHandler(function(conteudo){document.getElementById('tasks').innerHTML = conteudo})." 
    + func + "(" + issue + ", '" + task.id + "', '" + list + "', " + completed + ")"
}


function addTask(taskListId, title, issue) {
  if (taskListId == 'none') {
    list = {title: issue}
    list = Tasks.Tasklists.insert(list);
    taskListId = list.id
  }

  var task = Tasks.newTask().setTitle(title)
  Tasks.Tasks.insert(task, taskListId)

  return getTasks(issue)
}


function getNewTaskInput(list, issue) {
  return '<div class="input-group">'
  + '  <input type="text" class="form-control" placeholder="Nova task" id="newTaskInputText">'
  + '  <button class="input-group-text" onclick="' + getSubmitEvent(list, issue) + '">Adicionar</button>'
  + '</div>'
}


function getSubmitEvent(list, issue) {
  return "google.script.run.withSuccessHandler(function(conteudo){document.getElementById('tasks').innerHTML = conteudo})." 
    + "addTask('" + list + "', document.getElementById('newTaskInputText').value, '" + issue + "')"
}