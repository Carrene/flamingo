import moment from 'moment'

// eslint-disable-next-line
String.prototype.capitalize = function() {
  return this.split(' ')
    .map(item => {
      return `${item[0].toUpperCase()}${item.substr(1)}`
    })
    .join(' ')
}

// eslint-disable-next-line
String.prototype.formatText = function() {
  return this.split('-')
    .join(' ')
    .capitalize()
}

export function updateDate (project) {
  project.dueDate = project.dueDate
    ? moment(project.dueDate).format('MM/DD/YYYY')
    : project.dueDate
  return project
}

export function updateDateNugget (nugget) {
  nugget.dueDate = nugget.dueDate
    ? moment(nugget.dueDate).format('MM/DD/YYYY')
    : nugget.dueDate
  return nugget
}
