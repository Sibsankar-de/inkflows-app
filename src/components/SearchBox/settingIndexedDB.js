import { openDB } from "idb"

const DB_NAME = "SearchData"
const STORE_NAME = "SearchList"

const initDB = async () => {
    const idb = openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { autoIncrement: true })
            }
        }
    })

    return idb
}

export const addListToDb = async (list) => {
    const db = await initDB()
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)
    for (let item of list) {
        store.add(item)
    }
    await tx.done
}

export const getListFromDb = async () => {
    const db = await initDB()
    const tx = db.transaction(STORE_NAME, "readonly")
    const store = tx.objectStore(STORE_NAME)
    const list = store.getAll()
    await tx.done
    return list
}

export const clearListFromDb = async () => {
    const db = await initDB()
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)
    store.clear()
    await tx.done
}