import {Installer} from "../core/di/Installer";
import {GameManager} from "./GameManager";
import {SceneInstaller} from "../scene/SceneInstaller";
import {SceneManager} from "../scene/SceneManager";

export class GameInstaller extends Installer {
    install(): void {
        const sceneInstaller = new SceneInstaller(this.container, this.app);
        sceneInstaller.install()

        const sceneManager = this.container.resolve<SceneManager>("SceneManager")
        this.container.bind("GameManager", new GameManager(sceneManager))
    }
}