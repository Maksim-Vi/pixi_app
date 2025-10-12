import {View} from "../../../core/mvc/View";
import AssetsLoader from "../../../assetsLoader/AssetsLoader";
import {Button} from "../../../common/button/Button";
import * as PIXI from "pixi.js";
import GameModel from "../../../store/gameModel/GameModel";
import MainSceneModel from "./MainSceneModel";
import GlobalDispatcher from "../../../events/GlobalDispatcher";

export default class MainSceneView extends View<MainSceneModel> {

    private _buttonAceOfShadow: Button;
    private _buttonMagicWords: Button;
    private _buttonPhoenixFlame: Button;
    private _buttonGuessGame: Button;

    private _background!: PIXI.Sprite;
    private _scaleRatio: number = 1;

    create() {
        this.createBackground();
        this.createButtons();
        this.updateLayout();

        GlobalDispatcher.add("RESIZE_APP", this.resize, this);
    }

    private createBackground() {
        const galaxyTexture = AssetsLoader.get("galexy_bg");
        this._background = new PIXI.Sprite(galaxyTexture);

        this._scaleRatio = GameModel.visibleWidth / galaxyTexture.width;

        this._background.width = galaxyTexture.width * this._scaleRatio + 2000;
        this._background.height = galaxyTexture.height * this._scaleRatio + 2000;

        this._background.x = (GameModel.visibleWidth - this._background.width) / 2;
        this._background.y = (GameModel.visibleHeight - this._background.height) / 2;

        this.addChild(this._background as PIXI.DisplayObject);
    }

    private createButtons() {
        const createButton = (text: string): Button => {
            const tex = AssetsLoader.get("Btn2");
            tex.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;

            const btn = new Button(tex, 600, 120);
            btn.setText(text, { fontSize: 50, fill: 0xffffff });
            this.addChild(btn as PIXI.DisplayObject);

            return btn;
        };

        this._buttonAceOfShadow = createButton("Ace Of Shadow");
        this._buttonMagicWords = createButton("Magic Words");
        this._buttonPhoenixFlame = createButton("Phoenix Flame");
        this._buttonGuessGame = createButton("Guess Game");
    }

    private updateLayout() {
        const baseWidth = 600 * this._scaleRatio;
        const baseHeight = 120 * this._scaleRatio;
        const fontSize = 50 * this._scaleRatio;

        const buttons = [
            { btn: this._buttonAceOfShadow, offsetY: -150 },
            { btn: this._buttonMagicWords, offsetY: 0 },
            { btn: this._buttonPhoenixFlame, offsetY: 150 },
            { btn: this._buttonGuessGame, offsetY: 350 }
        ];

        for (const { btn, offsetY } of buttons) {
            btn.resize(baseWidth, baseHeight);
            btn.setTextStyle({ fontSize, fill: 0xffffff });
            btn.x = GameModel.centerX - btn.width / 2;
            btn.y = GameModel.centerY - btn.height / 2 + offsetY * this._scaleRatio;
        }
    }

    private resize() {
        this.updateLayout();
    }

    public get buttonGuessGame(): Button {
        return this._buttonGuessGame;
    }

    public get buttonAceOfShadow(): Button {
        return this._buttonAceOfShadow;
    }

    public get buttonMagicWords(): Button {
        return this._buttonMagicWords;
    }

    public get buttonPhoenixFlame(): Button {
        return this._buttonPhoenixFlame;
    }

    public show() {
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }

    destroyView(): void {
        GlobalDispatcher.remove("RESIZE_APP", this.resize);
        this.destroy({ children: true });
    }
}