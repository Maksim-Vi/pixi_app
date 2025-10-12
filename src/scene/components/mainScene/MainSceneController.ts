import {Controller} from "../../../core/mvc/Controller";
import MainSceneModel from "./MainSceneModel";
import MainSceneView from "./MainSceneView";
import {DI} from "../../../core/di/DI";
import {SceneManager, SceneType} from "../../SceneManager";

export default class MainSceneController extends Controller<MainSceneModel, MainSceneView>{

    private sceneManager!: SceneManager;

    async init() {
        this.view.create();

        this.view.buttonAceOfShadow?.onClick(() => this.handleButtonAceOfShadowClick());
        this.view.buttonMagicWords?.onClick(() => this.handleButtonMagicWordsClick());
        this.view.buttonPhoenixFlame?.onClick(() => this.handleButtonPhoenixFlameClick());
        this.view.buttonGuessGame?.onClick(() => this.handleButtonGuessGameClick());
        this.hideScreen();
    }

    private handleButtonAceOfShadowClick(): void {
        if (!this.sceneManager)
            this.sceneManager = DI.container.resolve<SceneManager>("SceneManager");

        this.sceneManager.loadScene(SceneType.AceOfShadowsScene)
    }

    private handleButtonMagicWordsClick(): void {
        if (!this.sceneManager)
            this.sceneManager = DI.container.resolve<SceneManager>("SceneManager");

        this.sceneManager.loadScene(SceneType.MagicWordsScene)
    }

    private handleButtonPhoenixFlameClick(): void {
        if (!this.sceneManager)
            this.sceneManager = DI.container.resolve<SceneManager>("SceneManager");

        this.sceneManager.loadScene(SceneType.PhoenixFlameScreen)
    }

    private handleButtonGuessGameClick(): void {
        if (!this.sceneManager)
            this.sceneManager = DI.container.resolve<SceneManager>("SceneManager");

        this.sceneManager.loadScene(SceneType.GuessCardGameScreen)
    }

    showScreen(){
        this.view.show();
    }

    hideScreen(){
        this.view.hide();
    }

    destroy(): void {
        this.view.destroyView()
    }
}
