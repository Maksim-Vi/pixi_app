import * as PIXI from "pixi.js";
import gsap from "gsap";
import DeckModel from "./DeckModel";
import {View} from "../../../../core/mvc/View";
import GlobalDispatcher from "../../../../events/GlobalDispatcher";
import GameModel from "../../../../store/gameModel/GameModel";


export default class DeckView extends View<DeckModel> {

    private container!: PIXI.Container;

    private deckSprites: PIXI.Sprite[] = [];
    private text!: PIXI.Text;

    private _onDeckClick?: () => void;

    create(): void {
        this.container = new PIXI.Container();
        this.addChild(this.container as any);

        GlobalDispatcher.add("RESIZE_APP", this.resize, this);
    }

    createDeckBacks(backTexture: PIXI.Texture, count: number = 4) {
        this.container.removeChildren();
        this.deckSprites = [];

        for (let i = 0; i < count; i++) {
            const sprite = new PIXI.Sprite(backTexture);

            sprite.anchor.set(0.5);
            sprite.x = GameModel.centerX - 1200;
            sprite.y = GameModel.centerY - i * 4;
            sprite.rotation = (Math.random() - 0.5) * 0.1;

            this.container.addChild(sprite as any);

            this.deckSprites.push(sprite);
        }

        this.createDeckText();
        this.makeDeckInteractive();
    }

    private makeDeckInteractive() {
        const topCard = this.deckSprites[this.deckSprites.length - 1];

        if (!topCard) return;

        topCard.interactive = true;
        topCard.cursor = "pointer";
        topCard.removeAllListeners();

        topCard.on("pointertap", () => this._onDeckClick);
    }

    private createDeckText(){
        const topCard = this.deckSprites[this.deckSprites.length - 1];
        if (!topCard) return;

        this.text = new PIXI.Text("init", {
            fontFamily: "Arial",
            fontSize: 120,
            fill: 0xfff,
            fontWeight: "bold",
        });

        this.text.anchor.set(0.5, 0);
        this.text.x = topCard.x;
        this.text.y = topCard.y + topCard.height / 2 + 50;

        this.addChild(this.text as PIXI.DisplayObject);
    }

    public setDeckText(text: string, color: any){
        if (!this.text) return;

        this.text.text = text;
        this.text.style.fill = color;
    }

    onDeckClick(callback: () => void) {
        this._onDeckClick = callback;
    }

    public playTextPulseAnimation() {
        if (!this.text) return;

        gsap.fromTo(
            this.text.scale,
            { x: 1, y: 1 },
            {
                x: 1.2,
                y: 1.2,
                duration: 0.15,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
            }
        );
    }

    async playShuffleAnimation() {
        const tl = gsap.timeline();

        this.deckSprites.forEach((sprite, i) => {
            tl.to(sprite, {
                x: sprite.x + (Math.random() - 0.5) * 200,
                y: sprite.y - 100 - Math.random() * 50,
                rotation: (Math.random() - 0.5) * 0.5,
                duration: 0.2,
                ease: "power1.inOut",
                yoyo: true,
                repeat: 1,
                delay: i * 0.1
            }, 0);
        });
    }

    private resize = () => {

    }

    destroyView() {
        GlobalDispatcher.remove("RESIZE_APP", this.resize);
        this.destroy({ children: true });
    }
}
