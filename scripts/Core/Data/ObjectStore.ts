import { IdDto } from "./Dto.js";

export interface ObjectStore<TDto> {
    save(dto: TDto): Promise<TDto>
    getAll(): Promise<TDto[]>
}

class AutoIncrementStore<TDto extends IdDto> implements ObjectStore<TDto> {
    private readonly getDb: () => IDBOpenDBRequest
    private readonly storeName: string

    constructor(dbProvider: () => IDBOpenDBRequest, storeName: string) {
        this.getDb = dbProvider;
        this.storeName = storeName
    }

    public async save(dto: TDto): Promise<TDto> {
        let db = await this.open();
        let transaction = db.transaction(this.storeName, "readwrite");
        let entriesStore = transaction.objectStore(this.storeName);

        let request: IDBRequest<IDBValidKey>
        if (!dto.id) {
            // Adding a new item.
            // This is a touch of hackery that simply copies the DTO and removes the "id" property 
            // to comply with the add() method, which expects the key path (id in this case) to be missing.
            let adding = Object.assign({}, dto)
            delete adding["id"]
            request = entriesStore.add(adding)
        } else {
            // Updating an existing item.
            request = entriesStore.put(dto)
        }

        return new Promise<TDto>((resolve, reject) => {
            request.onsuccess = (e) => {
                // Assign the ID back since it could have been empty if this is a new entry.
                dto.id = <number>request.result
                resolve(dto)
            }

            request.onerror = (e) => {
                reject()
            }
        })
    }

    public async getAll(): Promise<TDto[]> {
        let db = await this.open();
        let request = db.transaction(this.storeName).objectStore(this.storeName).getAll();

        return new Promise<TDto[]>((resolve, reject) => {
            request.onsuccess = x => {
                let resultSet: TDto[] = request.result as TDto[] || [];
                resolve(resultSet);
            };
        });
    }

    private open(): Promise<IDBDatabase> {
        let request = this.getDb()

        return new Promise((resolve, reject) => {
            request.onupgradeneeded = event => {
                let db = request.result;
                if (db) {
                    db.createObjectStore(this.storeName, { autoIncrement: true, keyPath: "id" });
                }
            };

            request.onsuccess = event => {
                let db = request.result;
                if (db) {
                    resolve(db);
                } else {
                    reject(new Error("Could not open SearchMan database."));
                }
            };
        })
    }
}

class KeyPathStore<TDto, TKey> implements ObjectStore<TDto> {
    private readonly getDb: () => IDBOpenDBRequest
    private readonly storeName: string
    private readonly keyPath: string[];

    constructor(
        dbProvider: () => IDBOpenDBRequest,
        storeName: string,
        keyProvider: (dto: TDto) => TKey,
        keyPath: string[]) {

        this.getDb = dbProvider;
        this.storeName = storeName
        this.keyPath = keyPath
    }

    public async save(dto: TDto): Promise<TDto> {
        let db = await this.open();
        let transaction = db.transaction(this.storeName, "readwrite");
        let entriesStore = transaction.objectStore(this.storeName);

        let request: IDBRequest<IDBValidKey>
        request = entriesStore.put(dto)

        return new Promise<TDto>((resolve, reject) => {
            request.onsuccess = (e) => {
                resolve(dto)
            }

            request.onerror = (e) => {
                reject()
            }
        })
    }

    public async getAll(): Promise<TDto[]> {
        let db = await this.open();
        let request = db.transaction(this.storeName).objectStore(this.storeName).getAll();

        return new Promise<TDto[]>((resolve, reject) => {
            request.onsuccess = x => {
                let resultSet: TDto[] = request.result as TDto[] || [];
                resolve(resultSet);
            };
        });
    }

    private open(): Promise<IDBDatabase> {
        let request = this.getDb()

        return new Promise((resolve, reject) => {
            request.onupgradeneeded = event => {
                let db = request.result;
                if (db) {
                    db.createObjectStore(this.storeName, { autoIncrement: false, keyPath: this.keyPath });
                }
            };

            request.onsuccess = event => {
                let db = request.result;
                if (db) {
                    resolve(db);
                } else {
                    reject(new Error("Could not open SearchMan database."));
                }
            };
        })
    }
}

export class ObjectStoreFactory {
    private constructor() { }

    public static createAutoIncrementStore<TDto extends IdDto>(
        dbFactory: IDBFactory,
        storeName: string,
        version: number): ObjectStore<TDto> {

        return new AutoIncrementStore(
            () => dbFactory.open("SearchMan", version),
            storeName)
    }

    public static createKeyPathStore<TDto, TKey>(
        dbFactory: IDBFactory,
        storeName: string,
        version: number,
        keyProvider: (dto: TDto) => TKey,
        keyPath: string[]): ObjectStore<TDto> {

        return new KeyPathStore(
            () => dbFactory.open("SearchMan", version),
            storeName,
            keyProvider,
            keyPath)
    }
}