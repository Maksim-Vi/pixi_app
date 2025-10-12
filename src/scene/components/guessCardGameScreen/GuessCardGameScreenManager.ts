import GuessCardGameScreenView from "./GuessCardGameScreenView";
import {GuessCardGameScreenController} from "./GuessCardGameScreenController";
import GuessCardGameScreenModel from "./GuessCardGameScreenModel";
import {Application} from "pixi.js";
import {ScreenManagerBase} from "../Base/ScreenManagerBase";

export class GuessCardGameScreenManager extends ScreenManagerBase {

    private guessCardGameScreenController: GuessCardGameScreenController = null;

    constructor(app: Application) {
        super(app);
        this.init();
    }

    override init() {
    }

    private createController(){
        this.guessCardGameScreenController = new GuessCardGameScreenController(new GuessCardGameScreenModel(), new GuessCardGameScreenView());
        this.guessCardGameScreenController.init()
        this.addView(this.guessCardGameScreenController.view)
    }

    public loadScene() {
        this.createController();
        this.guessCardGameScreenController?.showScreen();
    }

    public hideScene() {
        this.destroy();
    }

    override destroy() {
        this.guessCardGameScreenController?.destroy();
        this.guessCardGameScreenController = null;
    }
}