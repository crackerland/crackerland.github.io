import { AppContainerController } from "./Controllers/AppContainerController";
var Application = /** @class */ (function () {
    function Application(window, installer) {
        window.onload = function () {
            new AppContainerController().bind(document.getElementById('content'));
            //var el = document.getElementById('content');
            //var greeter = new Greeter(el);
            //greeter.start();
        };
        if ('serviceWorker' in navigator) {
            navigator
                .serviceWorker
                .register('/service-worker.js')
                .then(function () { return console.log('Service Worker Registered'); });
        }
        window.addEventListener("beforeinstallprompt", function (e) {
            e.preventDefault();
            installer.promptInstallation({
                platforms: e.platforms,
                userChoice: e.userChoice,
                prompt: function () { return e.prompt.call(e); }
            });
        });
    }
    return Application;
}());
var PwaInstallerDef = /** @class */ (function () {
    function PwaInstallerDef() {
    }
    PwaInstallerDef.prototype.promptInstallation = function (prompt) {
        var button = document.getElementById('butAdd');
        button.hidden = false;
        button.onclick = prompt.prompt;
    };
    return PwaInstallerDef;
}());
new Application(window, new PwaInstallerDef());
//# sourceMappingURL=app.js.map