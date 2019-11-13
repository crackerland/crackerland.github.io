import { FileLoaderFactory } from "/web_modules/ts-libs.js"
import { InstallChoice } from "./InstallChoice.js"
import { InstallPrompt } from "./InstallPrompt.js"
import { PwaInstaller } from "./PwaInstaller.js"
import { RootPageController } from "./Controllers/RootPageController.js"
import { RootViewModel } from "./ViewModels/RootViewModel.js"

class Application {

    constructor(window: Window, installer: PwaInstaller) {
        window.onload = async () => {
            await this.onWindowLoaded();
        };

        if ('serviceWorker' in navigator) {
            this.registerServiceWorker(navigator.serviceWorker);
        }

        // Show the install prompt.
        window.addEventListener("beforeinstallprompt", (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            installer.promptInstallation({
                platforms: e.platforms,
                userChoice: e.userChoice,
                prompt: () => e.prompt.call(e)
            });
        });

        window.addEventListener("DOMContentLoaded", () => {
            console.log("DOMContentLoaded ")
        });
    }

    /**
     * Entry point for loading the UI. Called after the window is loaded and ready. 
     */
    private async onWindowLoaded() {
        // Make sure the app is cached first.
        await navigator.serviceWorker.ready;

        let viewLoader = FileLoaderFactory.createFetchHtmlLoader(window as WindowOrWorkerGlobalScope);

        let main = document.getElementById('main');
        if (!main) {
            return;
        }

        new RootPageController(viewLoader, new RootViewModel(window.indexedDB)).loadIntoParent(main)
    }

    /**
     * Called when a new ServiceWorker is installed.
     * This indicates that the app needs to be refreshed to reflect the changes.
     * 
     * @param newWorker The newly installed service worker.
     */
    private onServiceWorkerChanged(newWorker: ServiceWorker) {
        let refreshButton = document.getElementById('butRefresh');
        if (!refreshButton) {
            return;
        }

        refreshButton.addEventListener('click', function () {
            newWorker.postMessage({ action: 'skipWaiting' });
        });

        // New service worker installed, show the refresh button and allow the update.
        refreshButton.hidden = false;
    }

    private registerServiceWorker(serviceWorker: ServiceWorkerContainer) {
        serviceWorker
            .register('/service-worker.js')
            .then(reg => {
                reg.addEventListener('updatefound', () => {
                    // Updated service worker found. 
                    let newWorker = reg.installing;
                    if (!newWorker) {
                        return;
                    }

                    newWorker.addEventListener('statechange', () => {
                        if (!newWorker) {
                            return;
                        }

                        switch (newWorker.state) {
                            case 'installed':
                                if (navigator.serviceWorker.controller) {
                                    this.onServiceWorkerChanged(newWorker);
                                }
                                break;
                        }
                    });
                });
            });

        let refreshing: boolean;

        // The event listener that is fired when the service worker updates
        // Here we reload the page
        serviceWorker.addEventListener('controllerchange', function () {
            if (refreshing) {
                return;
            }

            window.location.reload();
            refreshing = true;
        });
    }
}

class PwaInstallerDef implements PwaInstaller {
    promptInstallation(prompt: InstallPrompt) {
        let button = document.getElementById('butAdd');
        if (button) {
            button.hidden = false;
            button.onclick = prompt.prompt;
        }
    }
}

interface BeforeInstallPromptEvent extends Event {
    userChoice: Promise<InstallChoice>;
    prompt(): void;
    platforms: string,
}

new Application(window, new PwaInstallerDef());