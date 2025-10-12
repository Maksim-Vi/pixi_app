import MainSceneView from "./MainSceneView";
import MainSceneController from "./MainSceneController";
import MainSceneModel from "./MainSceneModel";
import {Application} from "pixi.js";
import {ScreenManagerBase} from "../Base/ScreenManagerBase";

export class MainSceneManager extends ScreenManagerBase {

    private mainSceneController: MainSceneController = null;

    constructor(app: Application) {
        super(app);
        this.init();
    }

    override init() {
    }

    private createController(){
        this.mainSceneController = new MainSceneController(new MainSceneModel(), new MainSceneView());
        this.mainSceneController.init()
        this.addView(this.mainSceneController.view)
    }

    public loadScene() {
        this.createController();
        this.mainSceneController?.showScreen();
    }

    public hideScene() {
        this.destroy();
    }

    override destroy() {
        this.mainSceneController?.destroy();
        this.mainSceneController = null;
    }
}