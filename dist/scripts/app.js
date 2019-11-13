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
import { FileLoaderFactory } from "/web_modules/ts-libs.js";
import { RootPageController } from "./Controllers/RootPageController.js";
import { RootViewModel } from "./ViewModels/RootViewModel.js";
var Application = /** @class */ (function () {
    function Application(window, installer) {
        var _this = this;
        window.onload = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.onWindowLoaded()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker(navigator.serviceWorker);
        }
        // Show the install prompt.
        window.addEventListener("beforeinstallprompt", function (e) {
            e.preventDefault();
            installer.promptInstallation({
                platforms: e.platforms,
                userChoice: e.userChoice,
                prompt: function () { return e.prompt.call(e); }
            });
        });
        window.addEventListener("DOMContentLoaded", function () {
            console.log("DOMContentLoaded ");
        });
    }
    /**
     * Entry point for loading the UI. Called after the window is loaded and ready.
     */
    Application.prototype.onWindowLoaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var viewLoader, main;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Make sure the app is cached first.
                    return [4 /*yield*/, navigator.serviceWorker.ready];
                    case 1:
                        // Make sure the app is cached first.
                        _a.sent();
                        viewLoader = FileLoaderFactory.createFetchHtmlLoader(window);
                        main = document.getElementById('main');
                        if (!main) {
                            return [2 /*return*/];
                        }
                        new RootPageController(viewLoader, new RootViewModel(window.indexedDB)).loadIntoParent(main);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Called when a new ServiceWorker is installed.
     * This indicates that the app needs to be refreshed to reflect the changes.
     *
     * @param newWorker The newly installed service worker.
     */
    Application.prototype.onServiceWorkerChanged = function (newWorker) {
        var refreshButton = document.getElementById('butRefresh');
        if (!refreshButton) {
            return;
        }
        refreshButton.addEventListener('click', function () {
            newWorker.postMessage({ action: 'skipWaiting' });
        });
        // New service worker installed, show the refresh button and allow the update.
        refreshButton.hidden = false;
    };
    Application.prototype.registerServiceWorker = function (serviceWorker) {
        var _this = this;
        serviceWorker
            .register('/service-worker.js')
            .then(function (reg) {
            reg.addEventListener('updatefound', function () {
                // Updated service worker found. 
                var newWorker = reg.installing;
                if (!newWorker) {
                    return;
                }
                newWorker.addEventListener('statechange', function () {
                    if (!newWorker) {
                        return;
                    }
                    switch (newWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                _this.onServiceWorkerChanged(newWorker);
                            }
                            break;
                    }
                });
            });
        });
        var refreshing;
        // The event listener that is fired when the service worker updates
        // Here we reload the page
        serviceWorker.addEventListener('controllerchange', function () {
            if (refreshing) {
                return;
            }
            window.location.reload();
            refreshing = true;
        });
    };
    return Application;
}());
var PwaInstallerDef = /** @class */ (function () {
    function PwaInstallerDef() {
    }
    PwaInstallerDef.prototype.promptInstallation = function (prompt) {
        var button = document.getElementById('butAdd');
        if (button) {
            button.hidden = false;
            button.onclick = prompt.prompt;
        }
    };
    return PwaInstallerDef;
}());
new Application(window, new PwaInstallerDef());
//# sourceMappingURL=app.js.map