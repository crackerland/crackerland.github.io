import { InstallChoice } from "./InstallChoice.js";

export interface InstallPrompt {
    platforms: string;
    userChoice: Promise<InstallChoice>;
    prompt(): void;
}
