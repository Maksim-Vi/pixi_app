import DeckModel from "./DeckModel";
import DeckView from "./DeckView";

import gsap from "gsap";
import * as PIXI from "pixi.js";
import { PixiPlugin } from "gsap/PixiPlugin";

import {Controller} from "../../../../core/mvc/Controller";
import CardController from "../../../../common/card/CardController";
import AssetsLoader from "../../../../assetsLoader/AssetsLoader";
import GameModel from "../../../../store/gameModel/GameModel";
import CardModel from "../../../../common/card/CardModel";
import CardView from "../../../../common/card/CardView";
import GlobalDispatcher from "../../../../events/GlobalDispatcher";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class DeckController extends Controller<DeckModel, DeckView> {

    private _cardsOnTable: CardController[] = [];

    private _secretCardName: string = "";
    private _isRoundStart: boolean = false;
    private _isLocked: boolean = false;

    async init() {
        this.view.create();

        const backTexture = AssetsLoader.get("Back_Card");
        this.view.createDeckBacks(backTexture, 4);
        this.startAutoShuffle();
        this.view.setDeckText("Tap To Start", 0x8fce00);

        this.view.onDeckClick(() => this.onClickDeck());
    }

    startAutoShuffle() {
        const loop = async () => {
            await this.view.playShuffleAnimation();
            setTimeout(loop, 7000);
        };

        loop();
    }

    async onClickDeck() {
        if (this._isLocked || this._isRoundStart) {
            this.view.playTextPulseAnimation()
            return;
        }

        GlobalDispatcher.dispatch("DECK_ROUND_START");
        this.view.setDeckText("Wait Next Round", 0xff0000);

        this._isLocked = true;
        this._isRoundStart = true;
        await this.dealCards(this.model.currentLevel);
    }

    async dealCards(count: number) {
        this.model.shuffleDeck();
        let drawn = this.model.draw(count);

        this._secretCardName = drawn[Math.floor(Math.random() * count)];

        console.log("My Card:", this._secretCardName);

        const deckX = GameModel.centerX - 1000;
        const startX = deckX + 800;
        const spacing = 25;
        const y = GameModel.centerY;

        this._cardsOnTable = [];

        for (let i = 0; i < count; i++) {
            const cardCtrl = new CardController(new CardModel(), new CardView());

            await cardCtrl.init();
            await cardCtrl.createCardByNameAsync(i, drawn[i]);
            cardCtrl.view.alpha = 0;
            cardCtrl.view.position.set(GameModel.centerX, GameModel.centerY - 600);

            this.view.addChild(cardCtrl.view as any);

            this._cardsOnTable.push(cardCtrl);
        }

        const tweens = this._cardsOnTable.map((c, i) => {
            return gsap.to(c.view, {
                duration: 0.6,
                delay: i * 0.5,
                x: startX + i * (c.view.width + spacing),
                y: y,
                alpha: 1,
                ease: "power2.out",
                paused: true
            });
        });

        tweens.forEach(t => t.play());
        await Promise.all(tweens.map(t =>
            new Promise(res => t.eventCallback("onComplete", res))
        ));

        for (let i = 0; i < this._cardsOnTable.length; i++) {

            const cardCtrl = this._cardsOnTable[i];
            cardCtrl.view.interactive = true;

            cardCtrl.view.once("pointertap", async () => {
                if (this._isLocked) return;
                this._isLocked = true;

                await this.handleCardSelect(drawn[i]);
            });
        }

        this._isLocked = false;
    }

    private async handleCardSelect(chosenName: string) {
        this._isLocked = true;
        const won = chosenName === this._secretCardName;

        const animations = this._cardsOnTable.map((c, i) => {
            return new Promise<void>(res => {
                gsap.to(c.view, {
                    duration: 0.6,
                    y: c.view.y - 800,
                    delay: i * 0.5,
                    alpha: 0,
                    ease: "power2.in",
                    onComplete: () => res()
                });
            });
        });

        await Promise.all(animations);

        for (const c of this._cardsOnTable) {
            if (c.view.parent) c.view.parent.removeChild(c.view as any);
            c.destroy();
        }

        this._cardsOnTable = [];

        this.model.setCurrentLevel(won)


        GlobalDispatcher.dispatch("DECK_ROUND_END", {won: won});

        this.view.setDeckText("Tap To Start", 0x8fce00);
        this._isRoundStart = false;
        this._isLocked = false;
    }

    destroy() {
        this.view.destroyView();
    }
}
