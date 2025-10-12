import { Installer } from "./core/di/Installer";
import {GameInstaller} from "./game/GameInstaller";

export class RootInstaller extends Installer {
    install(): void {
        const gameInstaller = new GameInstaller(this.container, this.app);
        gameInstaller.install()
    }
}