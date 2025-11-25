import { Application } from "pixi.js";
import {DIContainer} from "../core/di/DIContainer";
import {MainSceneManager} from "./components/mainScene/MainSceneManager";
import {Manager} from "../core/mvc/Manager";
import {AceOfShadowsScreenManager} from "./components/aceOfShadowsScreen/AceOfShadowsScreenManager";
import {ScreenManagerBase} from "./components/Base/ScreenManagerBase";
import {MagicWordsScreenManager} from "./components/magicWordsScreen/MagicWordsScreenManager";
import {PhoenixFlameScreenManager} from "./components/phoenixFlameScreen/PhoenixFlameScreenManager";
import {GuessCardGameScreenManager} from "./components/guessCardGameScreen/GuessCardGameScreenManager";
import {LoadingSceneManager} from "./components/loadScreen/LoadingSceneManager";

export enum SceneType {
    MainScene,
    AceOfShadowsScene,
    MagicWordsScene,
    PhoenixFlameScreen,
    GuessCardGameScreen,
    LoadingScreen,
}

export class SceneManager {
    private currentSceneType: SceneType | null = null;

    private prevScene: ScreenManagerBase = null;
    private currentScene: ScreenManagerBase = null;

    constructor(private app: Application, private diContainer: DIContainer) {}

    loadScene(key: SceneType) {
        this.prevScene = this.currentScene;

        switch (key) {
            case SceneType.LoadingScreen:{
                this.currentScene = this.diContainer.resolve<LoadingSceneManager>("LoadingSceneManager");
                (this.currentScene as LoadingSceneManager).loadScene();
                break;
            }
            case SceneType.MainScene:{
                this.currentScene = this.diContainer.resolve<MainSceneManager>("MainSceneManager");
                (this.currentScene as MainSceneManager).loadScene();
                break;
            }
            case SceneType.AceOfShadowsScene:{
                this.currentScene = this.diContainer.resolve<AceOfShadowsScreenManager>("AceOfShadowsScreenManager");
                (this.currentScene as AceOfShadowsScreenManager).loadScene();
                break;
            }
            case SceneType.MagicWordsScene:{
                this.currentScene = this.diContainer.resolve<MagicWordsScreenManager>("MagicWordsScreenManager");
                (this.currentScene as MagicWordsScreenManager).loadScene();
                break;
            }
            case SceneType.PhoenixFlameScreen:{
                this.currentScene = this.diContainer.resolve<PhoenixFlameScreenManager>("PhoenixFlameScreenManager");
                (this.currentScene as PhoenixFlameScreenManager).loadScene();
                break;
            }
            case SceneType.GuessCardGameScreen:{
                this.currentScene = this.diContainer.resolve<GuessCardGameScreenManager>("GuessCardGameScreenManager");
                (this.currentScene as GuessCardGameScreenManager).loadScene();
                break;
            }
        }

        this.prevScene?.hideScene();
        this.currentSceneType = key;
    }

    getCurrentSceneType(): SceneType | null {
        return this.currentSceneType;
    }

    getCurrentScene(): Manager {
        return this.currentScene;
    }
}
