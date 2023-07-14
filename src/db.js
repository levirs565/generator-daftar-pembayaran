import Dexie from "dexie";

const db = new Dexie("liability");

db.version(1).stores({
  liabilityType: "++id,name",
  recipient: "++id,name",
});

class LiabilityStore {
  add(item) {
    return db.liabilityType.add(item);
  }

  getAll() {
    return db.liabilityType.toArray();
  }

  getAllExcept(idList) {
    return db.liabilityType.where("id").noneOf(idList).toArray();
  }

  get(id) {
    return db.liabilityType.get(id);
  }

  put(item) {
    return db.liabilityType.put(item);
  }

  delete(item) {
    return db.liabilityType.delete(item.id);
  }
}

class RecipientStore {
  async #mapFromDb({ id, name, liabilityList }) {
    return {
      id,
      name,
      liabilityList: await Promise.all(
        liabilityList.map(async ({ id, amount }) => ({
          id,
          name: (await liabilityStore.get(id)).name,
          amount,
        }))
      ),
    };
  }
  #mapToDb({ id, name, liabilityList }) {
    return {
      id,
      name,
      liabilityList: liabilityList.map(({ id, amount }) => ({
        id,
        amount,
      })),
    };
  }

  add(item) {
    return db.recipient.add(this.#mapToDb(item));
  }

  async getAll() {
    return await Promise.all(
      (await db.recipient.toArray()).map((item) => this.#mapFromDb(item))
    );
  }
  async get(id) {
    return this.#mapFromDb(await db.recipient.get(id));
  }

  put(item) {
    return db.recipient.put(this.#mapToDb(item));
  }

  delete(item) {
    return db.recipient.delete(item.id);
  }
}

export const liabilityStore = new LiabilityStore();
export const recipientStore = new RecipientStore();

export function openDb() {
  return db.open();
}

export async function getExportData() {
  return {
    liabilityType: await liabilityStore.getAll(),
    recipient: await recipientStore.getAll(),
  };
}
