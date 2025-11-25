import {Installer} from "../core/di/Installer";
import {SceneManager} from "./SceneManager";
import {MainSceneManager} from "./components/mainScene/MainSceneManager";
import {AceOfShadowsScreenManager} from "./components/aceOfShadowsScreen/AceOfShadowsScreenManager";
import {MagicWordsScreenManager} from "./components/magicWordsScreen/MagicWordsScreenManager";
import {PhoenixFlameScreenManager} from "./components/phoenixFlameScreen/PhoenixFlameScreenManager";
import {GuessCardGameScreenManager} from "./components/guessCardGameScreen/GuessCardGameScreenManager";
import {LoadingSceneManager} from "./components/loadScreen/LoadingSceneManager";

export class SceneInstaller extends Installer {
    install(): void {
        this.container.bind("LoadingSceneManager", new LoadingSceneManager(this.app));
        this.container.bind("MainSceneManager", new MainSceneManager(this.app));
        this.container.bind("AceOfShadowsScreenManager", new AceOfShadowsScreenManager(this.app));
        this.container.bind("MagicWordsScreenManager", new MagicWordsScreenManager(this.app));
        this.container.bind("PhoenixFlameScreenManager", new PhoenixFlameScreenManager(this.app));
        this.container.bind("GuessCardGameScreenManager", new GuessCardGameScreenManager(this.app));

        this.container.bind("SceneManager", new SceneManager(this.app, this.container));
    }
}