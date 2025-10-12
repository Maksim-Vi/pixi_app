
import { Controller } from "../../../core/mvc/Controller";
import PhoenixFlameScreenModel from "./PhoenixFlameScreenModel";
import PhoenixFlameScreenView from "./PhoenixFlameScreenView";
import { DI } from "../../../core/di/DI";
import { SceneManager, SceneType } from "../../SceneManager";

export default class PhoenixFlameScreenController extends Controller<PhoenixFlameScreenModel, PhoenixFlameScreenView> {

    private readonly countOfCard: number = 10;

    private sceneManager!: SceneManager;

    async init() {
        this.view.create();
        this.hideScreen();

        this.view.buttonBack?.onClick(() => this.handleButtonBackClick());
    }

    handleButtonBackClick() {
        if (!this.sceneManager)
            this.sceneManager = DI.container.resolve<SceneManager>("SceneManager");

        this.sceneManager.loadScene(SceneType.MainScene);
    }

    showScreen() {
        this.view.show();
        this.view.createFire();
    }

    hideScreen() {
        this.view.hide();
    }

    destroy(): void {
        this.view.destroyView();
    }
}