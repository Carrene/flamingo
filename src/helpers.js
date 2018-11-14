import moment from 'moment'

// eslint-disable-next-line
String.prototype.capitalize = function () {
  return this
    .split(' ')
    .map(item => {
      return `${item[0].toUpperCase()}${item.substr(1)}`
    })
    .join(' ')
}

export function updateDate (container) {
  container.dueDate = container.dueDate ? moment(container.dueDate).format('MM/DD/YYYY') : container.dueDate
  return container
}

export function updateDateNugget (nugget) {
  nugget.dueDate = nugget.dueDate ? moment(nugget.dueDate).format('MM/DD/YYYY') : nugget.dueDate
  return nugget
}
