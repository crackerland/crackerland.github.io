
interface Territory {
    id: string
    name: string
}

export class RootViewModel {
    private storeName = "Territories"
    private dbFactory: IDBFactory

    constructor(dbFactory: IDBFactory) {
        this.dbFactory = dbFactory
    }

    public readFile(file: File) {
        var reader = new FileReader()
        reader.onload = (e) => this.onFileLoaded(file, e.target.result as string) 
        reader.readAsText(file)
    }

    private async onFileLoaded(file: File, content: string) {
        let newTerritory: Territory = JSON.parse(content);
        if (!newTerritory.id) {
            return
        }

        let db = await this.open();
        let transaction = db.transaction(this.storeName, "readwrite");
        let entriesStore = transaction.objectStore(this.storeName);

        let request = entriesStore.get(newTerritory.id)
        request.onsuccess = x => {
            if (!request.result) {
                let addRequest = entriesStore.add(newTerritory)
                addRequest.onsuccess = xx => {
                    console.log("Added successfully: " + JSON.stringify(newTerritory))
                }
            } else {
                console.log("Found entry already in database: " + JSON.stringify(request.result))
            }
        }

        //entriesStore.add()
    }

    private open(): Promise<IDBDatabase> {
        //let request = this.getDb()
        let version = 1
        let storeName = "Territories"
        let request = this.dbFactory.open("Fractile", version)

        return new Promise((resolve, reject) => {
            request.onupgradeneeded = event => {
                let db = request.result;
                if (db) {
                    db.createObjectStore(storeName, { autoIncrement: false, keyPath: "id" });
                }
            };

            request.onsuccess = event => {
                let db = request.result;
                if (db) {
                    resolve(db);
                } else {
                    reject(new Error("Could not open database."));
                }
            };
        })
    }
}
