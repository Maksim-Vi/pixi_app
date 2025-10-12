import {Controller} from "../../../core/mvc/Controller";
import GuessCardGameScreenModel from "./GuessCardGameScreenModel";
import GuessCardGameScreenView from "./GuessCardGameScreenView";
import {DI} from "../../../core/di/DI";
import {SceneManager, SceneType} from "../../SceneManager";
import {DeckController} from "./deck/DeckController";
import DeckModel from "./deck/DeckModel";
import DeckView from "./deck/DeckView";
import * as PIXI from "pixi.js";
import GlobalDispatcher, {IGDEvent} from "../../../events/GlobalDispatcher";

export class GuessCardGameScreenController extends Controller<GuessCardGameScreenModel, GuessCardGameScreenView> {

    private sceneManager!: SceneManager;
    private deckController!: DeckController;

    async init() {
        this.view.create();

        this.view.buttonBack?.onClick(() => this.handleButtonBackClick());

        GlobalDispatcher.add("DECK_ROUND_START", this.startRound, this);
        GlobalDispatcher.add("DECK_ROUND_END", this.endRound, this);

        this.hideScreen();
    }

    private handleButtonBackClick(): void {
        if (!this.sceneManager)
            this.sceneManager = DI.container.resolve<SceneManager>("SceneManager");

        this.sceneManager.loadScene(SceneType.MainScene)
    }

    async showScreen() {
        this.view.show();

        this.deckController = new DeckController(new DeckModel(), new DeckView());
        await this.deckController.init();
        this.view.addChild(this.deckController.view as PIXI.DisplayObject);

        this.deckController.view.interactive = true;
        this.deckController.view.on("pointertap", () => this.deckController.onClickDeck());
    }

    startRound(event: IGDEvent) {
        this.view.setText("", 0x8fce00);
    }

    endRound(event: IGDEvent<{won: boolean}>) {
        if(event.params.won){
            this.view.setText("You are right, congratulation!", 0x8fce00);
            return;
        }

        this.view.setText("Sorry but this is not my card", 0xff0000);
    }

    hideScreen() {
        this.view.hide();
    }

    destroy(): void {
        GlobalDispatcher.remove("DECK_ROUND_START", this.startRound);
        GlobalDispatcher.remove("DECK_ROUND_END", this.endRound);
        this.view.destroyView()
    }
}
