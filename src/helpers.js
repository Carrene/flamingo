import moment from 'moment'

export function updateDate (project) {
  project.dueDate = moment(project.dueDate).format('MM/DD/YYYY')
  return project
}
