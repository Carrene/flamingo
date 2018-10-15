import moment from 'moment'

String.prototype.capitalize = function () {
  return this
    .split(' ')
    .map(item => {
      return `${item[0].toUpperCase()}${item.substr(1)}`
    })
    .join(' ')
}

export function updateDate (project) {
  project.dueDate = project.dueDate ? moment(project.dueDate).format('MM/DD/YYYY') : project.dueDate
  return project
}

