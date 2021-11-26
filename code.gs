function doGet(event) {
  let template = HtmlService.createTemplateFromFile('index');

  template.event = event
  template.id_timer = 'timer'
  template.id_tasks = 'tasks'
  template.id_workf = 'workf'
  template.id_notas = 'notas'

  if (!getAllowTimer())
    template.id_timer = 'x_timer'
  
  if (!getAllowTasks())
    template.id_tasks = 'x_tasks'
  
  if (!getAllowWofkf())
    template.id_workf = 'x_workf'
  
  if (!getAllowNotas())
    template.id_notas = 'x_notas'

  return template.evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}
