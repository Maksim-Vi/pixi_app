import AceOfShadowsScreenView from "./AceOfShadowsScreenView";
import AceOfShadowsScreenController from "./AceOfShadowsScreenController";
import AceOfShadowsScreenModel from "./AceOfShadowsScreenModel";
import {Application} from "pixi.js";
import {ScreenManagerBase} from "../Base/ScreenManagerBase";

export class AceOfShadowsScreenManager extends ScreenManagerBase {

    private aceOfShadowsScreenController: AceOfShadowsScreenController = null;

    constructor(app: Application) {
        super(app);
        this.init();
    }

    override init() {
        console.log("[AceOfShadowsScreenManager] Initialized");
    }

    private createController(){
        this.aceOfShadowsScreenController = new AceOfShadowsScreenController(new AceOfShadowsScreenModel(), new AceOfShadowsScreenView());
        this.aceOfShadowsScreenController.init()
        this.addView(this.aceOfShadowsScreenController.view)
    }

    public loadScene() {
        this.createController();
        this.aceOfShadowsScreenController?.showScreen();
    }

    public hideScene() {
        this.destroy();
    }

    override destroy() {
        this.aceOfShadowsScreenController?.destroy();
        this.aceOfShadowsScreenController = null;
    }
}