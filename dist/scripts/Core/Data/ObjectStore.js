var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var AutoIncrementStore = /** @class */ (function () {
    function AutoIncrementStore(dbProvider, storeName) {
        this.getDb = dbProvider;
        this.storeName = storeName;
    }
    AutoIncrementStore.prototype.save = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var db, transaction, entriesStore, request, adding;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.open()];
                    case 1:
                        db = _a.sent();
                        transaction = db.transaction(this.storeName, "readwrite");
                        entriesStore = transaction.objectStore(this.storeName);
                        if (!dto.id) {
                            adding = Object.assign({}, dto);
                            delete adding["id"];
                            request = entriesStore.add(adding);
                        }
                        else {
                            // Updating an existing item.
                            request = entriesStore.put(dto);
                        }
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                request.onsuccess = function (e) {
                                    // Assign the ID back since it could have been empty if this is a new entry.
                                    dto.id = request.result;
                                    resolve(dto);
                                };
                                request.onerror = function (e) {
                                    reject();
                                };
                            })];
                }
            });
        });
    };
    AutoIncrementStore.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.open()];
                    case 1:
                        db = _a.sent();
                        request = db.transaction(this.storeName).objectStore(this.storeName).getAll();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                request.onsuccess = function (x) {
                                    var resultSet = request.result || [];
                                    resolve(resultSet);
                                };
                            })];
                }
            });
        });
    };
    AutoIncrementStore.prototype.open = function () {
        var _this = this;
        var request = this.getDb();
        return new Promise(function (resolve, reject) {
            request.onupgradeneeded = function (event) {
                var db = request.result;
                if (db) {
                    db.createObjectStore(_this.storeName, { autoIncrement: true, keyPath: "id" });
                }
            };
            request.onsuccess = function (event) {
                var db = request.result;
                if (db) {
                    resolve(db);
                }
                else {
                    reject(new Error("Could not open SearchMan database."));
                }
            };
        });
    };
    return AutoIncrementStore;
}());
var KeyPathStore = /** @class */ (function () {
    function KeyPathStore(dbProvider, storeName, keyProvider, keyPath) {
        this.getDb = dbProvider;
        this.storeName = storeName;
        this.keyPath = keyPath;
    }
    KeyPathStore.prototype.save = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var db, transaction, entriesStore, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.open()];
                    case 1:
                        db = _a.sent();
                        transaction = db.transaction(this.storeName, "readwrite");
                        entriesStore = transaction.objectStore(this.storeName);
                        request = entriesStore.put(dto);
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                request.onsuccess = function (e) {
                                    resolve(dto);
                                };
                                request.onerror = function (e) {
                                    reject();
                                };
                            })];
                }
            });
        });
    };
    KeyPathStore.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.open()];
                    case 1:
                        db = _a.sent();
                        request = db.transaction(this.storeName).objectStore(this.storeName).getAll();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                request.onsuccess = function (x) {
                                    var resultSet = request.result || [];
                                    resolve(resultSet);
                                };
                            })];
                }
            });
        });
    };
    KeyPathStore.prototype.open = function () {
        var _this = this;
        var request = this.getDb();
        return new Promise(function (resolve, reject) {
            request.onupgradeneeded = function (event) {
                var db = request.result;
                if (db) {
                    db.createObjectStore(_this.storeName, { autoIncrement: false, keyPath: _this.keyPath });
                }
            };
            request.onsuccess = function (event) {
                var db = request.result;
                if (db) {
                    resolve(db);
                }
                else {
                    reject(new Error("Could not open SearchMan database."));
                }
            };
        });
    };
    return KeyPathStore;
}());
var ObjectStoreFactory = /** @class */ (function () {
    function ObjectStoreFactory() {
    }
    ObjectStoreFactory.createAutoIncrementStore = function (dbFactory, storeName, version) {
        return new AutoIncrementStore(function () { return dbFactory.open("SearchMan", version); }, storeName);
    };
    ObjectStoreFactory.createKeyPathStore = function (dbFactory, storeName, version, keyProvider, keyPath) {
        return new KeyPathStore(function () { return dbFactory.open("SearchMan", version); }, storeName, keyProvider, keyPath);
    };
    return ObjectStoreFactory;
}());
export { ObjectStoreFactory };
//# sourceMappingURL=ObjectStore.js.map