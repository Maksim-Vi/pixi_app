import AssetsLoader from "../../assetsLoader/AssetsLoader";
import gsap from "gsap";
import GameModel from "../../store/gameModel/GameModel";
import * as PIXI from "pixi.js";
import {View} from "../../core/mvc/View";
import CardModel from "./CardModel";
import GlobalDispatcher from "../../events/GlobalDispatcher";


export default class CardView extends View<CardModel> {
    private _index: number = 0;
    private background!: PIXI.Sprite;

    private startX: number = 0;
    private startY: number = 0;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private currentTween?: gsap.core.Tween | gsap.core.Timeline;

    private baseWidth: number = 500 * 2;
    private baseHeight: number = 700 * 2;

    create() {
        GlobalDispatcher.add("RESIZE_APP", this.resize, this);
    }

    createCard(index: number, nameOfCard: string) {
        if (!nameOfCard) return;

        this._index = index;

        const texture = AssetsLoader.get(nameOfCard);
        this.setCard(texture);
    }

    async createCardAsync(index: number, nameOfCard: string) {
        if (!nameOfCard) return;

        this._index = index;

        const texture = AssetsLoader.get(nameOfCard);
        this.setCard(texture);
    }

    private setCard(texture: PIXI.Texture): void {
        this.background = new PIXI.Sprite(texture);
        this.background.anchor.set(0.5);

        this.addChild(this.background as PIXI.DisplayObject);

        this.width = this.baseWidth;
        this.height = this.baseHeight;
        this.scale.set(1);

        this.startX = GameModel.centerX + 700;
        this.startY = GameModel.centerY;
        this.offsetX = -this._index * 2;
        this.offsetY = -this._index * 2;

        this.setOffsetPosition();
    }

    setOffsetPosition() {
        this.position.set(this.startX + this.offsetX, this.startY + this.offsetY);
    }

    private resize = () => {
        const scaleX = GameModel.scaleX;
        const scaleY = GameModel.scaleY;

        this.scale.set(scaleX, scaleY);

        this.startX = GameModel.centerX + 700 * scaleX;
        this.startY = GameModel.centerY;
        this.setOffsetPosition();
    }

    moveTo(x: number, y: number, duration: number = 1): Promise<void> {
        return new Promise((resolve) => {
            if (this.currentTween) this.currentTween.kill();

            const startX = this.x;
            const startY = this.y;
            const midX = (startX + x) / 2;
            const midY = (startY + y) / 2 - 80;

            const rotateAngle = (Math.random() - 0.5) * 15;

            const tl = gsap.timeline({
                onComplete: () => {
                    this.rotation = 0;
                    this.currentTween = undefined;
                    resolve();
                }
            });

            tl.to(this, {
                duration: duration * 0.5,
                x: midX,
                y: midY,
                rotation: rotateAngle * (Math.PI / 180),
                ease: "power2.out"
            });

            tl.to(this, {
                duration: duration * 0.5,
                x,
                y,
                rotation: 0,
                ease: "power2.in"
            });

            this.currentTween = tl;
        });
    }

    resetPosition() {
        if (this.currentTween) this.currentTween.kill();
        this.setOffsetPosition();
    }

    get getBackground() {
       return this.background;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
        if (this.currentTween) this.currentTween.kill();
    }

    destroyView(): void {
        GlobalDispatcher.remove("RESIZE_APP", this.resize);
        if (this.currentTween) this.currentTween.kill();
        this.destroy({ children: true });
    }

    get index() { return this._index; }
}