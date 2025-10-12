
import { Controller } from "../../../core/mvc/Controller";
import AceOfShadowsScreenModel from "./AceOfShadowsScreenModel";
import AceOfShadowsScreenView from "./AceOfShadowsScreenView";
import { DI } from "../../../core/di/DI";
import { SceneManager, SceneType } from "../../SceneManager";
import CardController from "../../../common/card/CardController";
import CardView from "../../../common/card/CardView";
import CardModel from "../../../common/card/CardModel";
import * as PIXI from "pixi.js";

export default class AceOfShadowsScreenController extends Controller<AceOfShadowsScreenModel, AceOfShadowsScreenView> {

    private readonly countOfCard: number = 10;

    private sceneManager!: SceneManager;
    private cardControllerList: CardController[] = [];

    private stackA: CardController[] = [];
    private stackB: CardController[] = [];

    private isAnimating: boolean = false;

    async init() {
        this.view.create();
        this.hideScreen();

        this.view.sortableChildren = true;
        this.addCards();

        this.view.buttonBack?.onClick(() => this.handleButtonBackClick());
    }

    handleButtonBackClick() {
        if (!this.sceneManager)
            this.sceneManager = DI.container.resolve<SceneManager>("SceneManager");

        this.sceneManager.loadScene(SceneType.MainScene);
    }

    addCards() {
        for (let i = 0; i < this.countOfCard; i++) {
            const cardController = new CardController(new CardModel(), new CardView());
            cardController.init();
            cardController.createCardByName(i, "Back_Card");

            this.view.addChild(cardController.view  as PIXI.DisplayObject);
            this.cardControllerList.push(cardController);
        }
    }

    async startCardAnimation() {
        if (this.cardControllerList.length === 0) return;

        this.isAnimating = true;

        const baseX = this.cardControllerList[0].view.x;
        const baseY = this.cardControllerList[0].view.y;

        const stackA_X = baseX;
        const stackA_Y = baseY;

        const stackB_X = baseX - this.cardControllerList[0].view.width - 100 * 2 - 500;
        const stackB_Y = baseY;

        this.stackA = [...this.cardControllerList];
        this.stackB = [];

        const offset = 2;
        let isMovingToB = true;

        while (this.isAnimating) {
            const sourceStack = isMovingToB ? this.stackA : this.stackB;
            const targetStack = isMovingToB ? this.stackB : this.stackA;

            if (sourceStack.length === 0) {
                isMovingToB = !isMovingToB;
                continue;
            }

            let topCard =  sourceStack.pop()!;

            const targetBaseX = isMovingToB ? stackB_X : stackA_X;
            const targetBaseY = isMovingToB ? stackB_Y : stackA_Y;

            const targetIndex = targetStack.length;

            const targetX = targetBaseX + (-targetIndex * offset);
            const targetY = targetBaseY + (-targetIndex * offset);

            targetStack.push(topCard);

            this.view.addChild(topCard.view as any);

            await topCard.view.moveTo(targetX, targetY, 2);
            await new Promise((r) => setTimeout(r, 1000));
        }
    }

    resetCards() {
        this.isAnimating = false;

        this.cardControllerList.forEach((card) => {
            if (card.view["currentTween"]) {
                card.view["currentTween"].kill();
                delete card.view["currentTween"];
            }

            card.view.resetPosition();
        });

        this.stackA = [...this.cardControllerList];
        this.stackB = [];
    }

    showScreen() {
        this.view.show();
        this.resetCards();
        this.startCardAnimation();
    }

    hideScreen() {
        this.view.hide();
        this.resetCards();
    }

    destroy(): void {
        this.resetCards();

        this.cardControllerList.forEach((card) => {
            card.destroy();
        })

        this.view.destroyView();
    }
}