import { InstallPrompt } from "./InstallPrompt.js";

export interface PwaInstaller {
    promptInstallation(prompt: InstallPrompt): void;
}
