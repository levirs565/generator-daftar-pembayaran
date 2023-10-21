import Dexie from "dexie";

class AppStore {
  #db;
  #liabilityTypeTable;
  #liabilityTable;
  #recipientTable;

  constructor() {
    this.#db = new Dexie("liability");

    this.#db.version(1).stores({
      liabilityType: "++id,name",
      liability: "++id,[recipientId+typeId],typeId",
      recipient: "++id,name",
    });

    this.#liabilityTypeTable = this.#db.liabilityType;
    this.#liabilityTable = this.#db.liability;
    this.#recipientTable = this.#db.recipient;
  }

  open() {
    return this.#db.open();
  }

  async exportData() {
    return {
      liabilityType: await this.#liabilityTypeTable.toArray(),
      liability: await this.#liabilityTable.toArray(),
      recipient: await this.#recipientTable.toArray(),
    };
  }

  importData(data) {
    return this.#db.transaction(
      "rw",
      [this.#liabilityTypeTable, this.#recipientTable, this.#liabilityTable],
      () => {
        this.#liabilityTypeTable
          .clear()
          .then(() => this.#liabilityTypeTable.bulkAdd(data.liabilityType));
        this.#liabilityTable
          .clear()
          .then(() => this.#liabilityTable.bulkAdd(data.liability));
        this.#recipientTable
          .clear()
          .then(() => this.#recipientTable.bulkAdd(data.recipient));
      }
    );
  }

  clear() {
    return this.#db.transaction(
      "rw",
      [this.#liabilityTypeTable, this.#recipientTable, this.#liabilityTable],
      () => {
        this.#liabilityTypeTable.clear();
        this.#liabilityTable.clear();
        this.#recipientTable.clear();
      }
    );
  }

  getLiabilityTypeList() {
    return this.#liabilityTypeTable.toArray();
  }

  getLiabilityTypeListExcept(idList) {
    return this.#liabilityTypeTable.where("id").noneOf(idList).toArray();
  }

  putLiabilityType(item) {
    return this.#liabilityTypeTable.put(item);
  }

  deleteLiabilityType(item) {
    return this.#db.transaction(
      "rw",
      [this.#liabilityTable, this.#liabilityTypeTable],
      () => {
        this.#liabilityTypeTable.delete(item.id);
        this.#liabilityTable.where("typeId").equals(item.id).delete();
      }
    );
  }

  #getRecipientLiabilityCollection(id) {
    return this.#liabilityTable.where("recipientId").equals(id);
  }

  async getRecipientList() {
    return Promise.all(
      (await this.#recipientTable.toArray()).map(async ({ name, id }) => ({
        id,
        name,
        liabilityList: await Promise.all(
          (
            await this.#getRecipientLiabilityCollection(id).sortBy("index")
          ).map(async ({ typeId, ...rest }) => ({
            typeId,
            name: (await this.#liabilityTypeTable.get(typeId)).name,
            ...rest,
          }))
        ),
      }))
    );
  }

  async putRecipient({ id, name, liabilityList }) {
    return this.#db.transaction(
      "rw",
      [this.#recipientTable, this.#liabilityTable],
      async () => {
        const recipientId = await this.#recipientTable.put({ id, name });

        const liabilityTypeIdList = liabilityList.map(({ typeId }) => typeId);
        await this.#getRecipientLiabilityCollection(recipientId)
          .filter((item) => !liabilityTypeIdList.includes(item.typeId))
          .delete();

        await this.#liabilityTable.bulkPut(
          await Promise.all(
            liabilityList.map(async ({ id, typeId, amount }, index) => ({
              id:
                id ??
                (
                  await this.#liabilityTable.get({ recipientId, typeId })
                )?.id,
              recipientId,
              typeId,
              amount,
              index,
            }))
          )
        );
      }
    );
  }

  async deleteRecipient(item) {
    return this.#db.transaction(
      "rw",
      [this.#recipientTable, this.#liabilityTable],
      () => {
        this.#recipientTable.delete(item.id);
        this.#getRecipientLiabilityCollection(item.id).delete();
      }
    );
  }
}

export const appStore = new AppStore();
