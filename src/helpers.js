import moment from 'moment'

export function updateDate (project) {
  project.dueDate = project.dueDate ? moment(project.dueDate).format('MM/DD/YYYY') : project.dueDate
  return project
}
