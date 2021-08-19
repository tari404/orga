const DB_NAME = 'orga'
const DB_VERSION = 1

// eslint-disable-next-line no-unused-vars
const _diary_template = {
  date: 18807,
  dateStr: '2021/6/29',
  targets: [
    {
      content: '今天要完成BalaBala...',
      finished: false,
    },
  ],
  goal: 300,
  rewards: -10,
  updated: false,
  delay: false,
}

// eslint-disable-next-line no-unused-vars
const _monthly_template = {
  month: 1457,
  grow: 900,
  spend: [
    {
      content: '买了什么东西',
      value: 120,
    },
  ],
}

export default class Database {
  constructor() {
    this.afterOpened = []
    this.opening = false
  }

  async openDB() {
    if (this.db && this.db instanceof IDBDatabase) {
      return true
    }
    const p = new Promise((resolve) => {
      this.afterOpened.push(resolve)
    })

    if (!this.opening) {
      this.opening = true

      let upgradeneeded = false
      const db = await new Promise((resolve) => {
        const openRequest = indexedDB.open(DB_NAME, DB_VERSION)
        openRequest.onupgradeneeded = (event) => {
          upgradeneeded = true
          const db = event.target.result
          db.createObjectStore('diary', { keyPath: 'date' })
          db.createObjectStore('monthly', { keyPath: 'month' })
          db.createObjectStore('states')
        }
        openRequest.onsuccess = () => {
          console.log(
            'Use IndexedDB:',
            openRequest.result.name,
            'version:',
            openRequest.result.version
          )
          resolve(openRequest.result)
        }
        openRequest.onerror = () => {
          console.warn('IndexedDB could not be initialized')
          resolve(null)
        }
      })
      let status = true
      this.db = db
      if (db && upgradeneeded) {
        status = await this.initDB(this.db)
      }
      const result = db && status
      this.afterOpened.forEach((cb) => {
        cb(result)
      })
    }

    return p
  }

  async initDB(db) {
    if (!db || !(db instanceof IDBDatabase)) {
      throw new TypeError('expect IDBDatabase')
    }

    const store = db.transaction('states', 'readwrite').objectStore('states')
    store.add('orga', 'name')
    store.add(0, 'balance')
    store.add(0, 'updateAt')
  }

  async add(store, date) {
    return new Promise((resolve) => {
      if (!(this.db instanceof IDBDatabase)) {
        return resolve(false)
      }
      const saveRequest = this.db.transaction(store, 'readwrite').objectStore(store).add(date)
      saveRequest.onsuccess = async () => {
        resolve(true)
      }
      saveRequest.onerror = () => {
        resolve(false)
      }
    })
  }

  async set(store, date, key) {
    return new Promise((resolve) => {
      if (!(this.db instanceof IDBDatabase)) {
        return resolve(false)
      }
      const saveRequest = this.db.transaction(store, 'readwrite').objectStore(store).put(date, key)
      saveRequest.onsuccess = async () => {
        resolve(true)
      }
      saveRequest.onerror = () => {
        resolve(false)
      }
    })
  }

  async get(store, key) {
    return new Promise((resolve) => {
      if (!(this.db instanceof IDBDatabase)) {
        return resolve(null)
      }
      const getRequest = this.db.transaction(store, 'readonly').objectStore(store).get(key)
      getRequest.onsuccess = (event) => {
        resolve(event.target.result)
      }
      getRequest.onerror = () => {
        resolve(null)
      }
    })
  }
}

// const actions = {
//   async initDB ({ state, dispatch }) {
//     let upgradeneeded = false
//     state.db = await new Promise(resolve => {
//       const openRequest = indexedDB.open(DB_NAME, DB_VERSION)
//       openRequest.onupgradeneeded = event => {
//         const db = event.target.result
//         db.createObjectStore('contract', { keyPath: 'name' })
//         upgradeneeded = true
//       }
//       openRequest.onsuccess = () => {
//         console.log('Use IndexDB:', openRequest.result.name, 'version:', openRequest.result.version)
//         state.state = true
//         resolve(openRequest.result)
//       }
//       openRequest.onerror = () => {
//         console.warn('IndexDB could not be initialized')
//         resolve(null)
//       }
//     })
//     if (upgradeneeded) {
//       await staticContracts.map(contract => {
//         return dispatch('saveContract', contract)
//       })
//     }
//     await dispatch('updateAllContracts')
//   },
//   async saveContract ({ state, dispatch }, { name, address, abi }) {
//     const db = state.db
//     if (!db || !(db instanceof IDBDatabase)) {
//       return false
//     }
//     const res = new Promise(resolve => {
//       const saveRequest = db.transaction(['contract'], 'readwrite')
//         .objectStore('contract')
//         .add({ name, address, abi })
//       saveRequest.onsuccess = () => {
//         resolve(true)
//       }
//       saveRequest.onerror = () => {
//         resolve(false)
//       }
//     })
//     if (res) {
//       await dispatch('updateAllContracts')
//     }
//     return res
//   },
//   async updateContract ({ state, dispatch }, { name, address, abi }) {
//     const db = state.db
//     if (!db || !(db instanceof IDBDatabase)) {
//       return false
//     }
//     const res = new Promise(resolve => {
//       const delRequest = db.transaction(['contract'], 'readwrite')
//         .objectStore('contract')
//         .put({ name, address, abi })
//       delRequest.onsuccess = () => {
//         resolve(true)
//       }
//       delRequest.onerror = () => {
//         resolve(false)
//       }
//     })
//     if (res) {
//       await dispatch('updateAllContracts')
//     }
//     return res
//   },
//   async removeContract ({ state, dispatch }, name) {
//     const db = state.db
//     if (!db || !(db instanceof IDBDatabase)) {
//       return false
//     }
//     const res = new Promise(resolve => {
//       const delRequest = db.transaction(['contract'], 'readwrite')
//         .objectStore('contract')
//         .delete(name)
//       delRequest.onsuccess = () => {
//         resolve(true)
//       }
//       delRequest.onerror = () => {
//         resolve(false)
//       }
//     })
//     if (res) {
//       await dispatch('updateAllContracts')
//     }
//     return res
//   },
//   async updateAllContracts ({ state }) {
//     const db = state.db
//     if (!db || !(db instanceof IDBDatabase)) {
//       return false
//     }
//     return new Promise(resolve => {
//       const getRequest = db.transaction(['contract'])
//         .objectStore('contract')
//         .getAll()
//       getRequest.onsuccess = event => {
//         state.contracts = event.target.result
//         resolve(event.target.result)
//       }
//       getRequest.onerror = () => {
//         resolve(false)
//       }
//     })
//   }
// }
