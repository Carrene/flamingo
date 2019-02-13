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

export function findAndReplaceNuggets (currentNuggets, newNuggets) {
  newNuggets = [].concat(newNuggets)
  return currentNuggets.map(nugget => {
    for (let newNugget of newNuggets) {
      if (nugget.id === newNugget.id) {
        nugget = newNugget
      }
    }
    return nugget
  })
}

export function updateList (list, updatedItem) {
  let foundItem = list.find(item => {
    return item.id === updatedItem.id
  })
  let response = foundItem.reload().send()
  Promise.resolve(response)
}
