import PhoenixFlameScreenView from "./PhoenixFlameScreenView";
import PhoenixFlameScreenController from "./PhoenixFlameScreenController";
import PhoenixFlameScreenModel from "./PhoenixFlameScreenModel";
import {Application} from "pixi.js";
import {ScreenManagerBase} from "../Base/ScreenManagerBase";

export class PhoenixFlameScreenManager extends ScreenManagerBase {

    private phoenixFlameScreenController: PhoenixFlameScreenController = null;

    constructor(app: Application) {
        super(app);
        this.init();
    }

    override init() {
        console.log("[PhoenixFlameScreenManager] Initialized");
    }

    private createController(){
        this.phoenixFlameScreenController = new PhoenixFlameScreenController(new PhoenixFlameScreenModel(), new PhoenixFlameScreenView());
        this.phoenixFlameScreenController.init()
        this.addView(this.phoenixFlameScreenController.view)
    }

    public loadScene() {
        this.createController();
        this.phoenixFlameScreenController?.showScreen();
    }

    public hideScene() {
        this.destroy();
    }

    override destroy() {
        this.phoenixFlameScreenController?.destroy();
        this.phoenixFlameScreenController = null;
    }
}