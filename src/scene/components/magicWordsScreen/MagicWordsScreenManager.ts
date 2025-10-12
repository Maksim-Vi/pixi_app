import MagicWordsScreenView from "./MagicWordsScreenView";
import MagicWordsScreenController from "./MagicWordsScreenController";
import MagicWordsScreenModel from "./MagicWordsScreenModel";
import {Application} from "pixi.js";
import {ScreenManagerBase} from "../Base/ScreenManagerBase";

export class MagicWordsScreenManager extends ScreenManagerBase {

    private magicWordsScreenController: MagicWordsScreenController = null;

    constructor(app: Application) {
        super(app);
        this.init();
    }

    override init() {}

    private createController(){
        this.magicWordsScreenController = new MagicWordsScreenController(new MagicWordsScreenModel(), new MagicWordsScreenView());
        this.magicWordsScreenController.init()
        this.addView(this.magicWordsScreenController.view)
    }

    public loadScene() {
        this.createController();
        this.magicWordsScreenController?.showScreen();
    }

    public hideScene() {
        this.destroy();
    }

    override destroy() {
        this.magicWordsScreenController?.destroy();
        this.magicWordsScreenController = null;
    }
}