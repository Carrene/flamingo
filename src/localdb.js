// IndexedDB vendor fallBacks
window.IDBTransaction = window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction ||
  {READ_WRITE: 'readwrite'}
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
if (!window.indexedDB) {
  console.error(
    'Your browser doesn\'t support a stable version of IndexedDB. Such and such feature will not be available.'
  )
}

// Opening Database
function open (dbName) {
  let db
  let request = window.indexedDB.open(dbName)

  return new Promise((resolve, reject) => {
    request.onerror = function (event) {
      console.error('The database is opened failed')
      reject(new Error('The database is opened failed'))
    }
    request.onsuccess = function (event) {
      db = request.result
      resolve(db)
    }
    request.onupgradeneeded = function (event) {
      db = event.target.result
      let objectStore
      if (!db.objectStoreNames.contains('managers')) {
        objectStore = db.createObjectStore('managers', { keyPath: 'id' })
        objectStore.createIndex('value', 'value', { unique: true })
      }
      if (!db.objectStoreNames.contains('releases')) {
        objectStore = db.createObjectStore('releases', { keyPath: 'id' })
        objectStore.createIndex('value', 'value', { unique: true })
      }
      resolve(db)
    }
  })
}

// Reading from DB
async function read (table, id) {
  let db = await open('maestroDB')
  let transaction = db.transaction([table])
  let objectStore = transaction.objectStore(table)
  let request = objectStore.get(id)

  return new Promise((resolve, reject) => {
    request.onerror = function (event) {
      console.error('Reading transaction failed')
      reject(new Error('Reading transaction failed'))
    }
    request.onsuccess = function (event) {
      if (request.result) {
        resolve({
          id: id,
          value: request.result.value
        })
      } else {
        resolve(null)
      }
    }
  })
}

// Adding record to DB
async function add (table, id, value) {
  let db = await open('maestroDB')
  let request = db.transaction([table], 'readwrite')
    .objectStore(table)
    .add({id: id, value: value})

  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      resolve()
    }

    request.onerror = function (event) {
      console.error('The data has been written failed')
      reject(new Error('The data has been written failed'))
    }
  })
}

// Updating DB
async function update (table, id, value) {
  let db = await open('maestroDB')
  let request = db.transaction([table], 'readwrite')
    .objectStore(table)
    .put({id: id, value: value})

  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      resolve()
    }

    request.onerror = function (event) {
      console.error('The data has been updated failed')
      reject(new Error('The data has been updated failed'))
    }
  })
}

// Removing from DB
async function remove (table, id) {
  let db = await open('maestroDB')
  let request = db.transaction([table], 'readwrite')
    .objectStore(table)
    .delete(id)

  return new Promise((resolve, reject) => {
    request.onsuccess = function (event) {
      resolve()
    }

    request.onerror = function (event) {
      console.error('The data has been deleted failed')
      reject(new Error('The data has been deleted failed'))
    }
  })
}

export default {
  open: open,
  add: add,
  read: read,
  update: update,
  remove: remove
}
