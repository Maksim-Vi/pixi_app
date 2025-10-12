import {View} from "../../../core/mvc/View";
import AssetsLoader from "../../../assetsLoader/AssetsLoader";
import {Button} from "../../../common/button/Button";
import * as PIXI from "pixi.js";
import GameModel from "../../../store/gameModel/GameModel";
import GuessCardGameScreenModel from "./GuessCardGameScreenModel";
import GlobalDispatcher from "../../../events/GlobalDispatcher";

export default class GuessCardGameScreenView extends View<GuessCardGameScreenModel> {

    private _background!: PIXI.Sprite;
    private _buttonBack!: Button;
    private text!: PIXI.Text;

     create() {
        this.createBackground();
        this.createDeckText();
        this.createButtonBack();
    }

    createBackground() {
        const galaxyTexture = AssetsLoader.get("galexy_bg");
        this._background = new PIXI.Sprite(galaxyTexture);
        this.addChild(this._background as PIXI.DisplayObject);

        this.updateBackgroundLayout();
    }

    createButtonBack() {
        const buttonTexture = AssetsLoader.get("button_page_back");
        this._buttonBack = new Button(buttonTexture, 250, 250);
        this.addChild(this._buttonBack as PIXI.DisplayObject);

        this.updateButtonBackLayout();
    }

    private createDeckText(){
        this.text = new PIXI.Text("", {
            fontFamily: "Arial",
            fontSize: 120,
            fill: 0xfff,
            fontWeight: "bold",
        });

        this.text.x = GameModel.centerX - 1000;
        this.text.y = GameModel.centerY - 1000;

        this.addChild(this.text as PIXI.DisplayObject);
    }

    public setText(text: string, color: any){
        if (!this.text) return;

        this.text.text = text;
        this.text.style.fill = color;
    }

    private updateBackgroundLayout() {
        const galaxyTexture = this._background.texture;

        const scaleX = GameModel.visibleWidth / galaxyTexture.width;
        const scaleY = GameModel.visibleHeight / galaxyTexture.height;

        const scale = Math.max(scaleX, scaleY);

        this._background.width = galaxyTexture.width * scale + 2000;
        this._background.height = galaxyTexture.height * scale + 2000;

        this._background.x = (GameModel.visibleWidth - this._background.width) / 2;
        this._background.y = (GameModel.visibleHeight - this._background.height) / 2;
    }

    private updateButtonBackLayout() {
        this._buttonBack.x = GameModel.left + 50;
        this._buttonBack.y = GameModel.top + 50;
    }

    private resize = () => {
        this.updateBackgroundLayout();
        this.updateButtonBackLayout();
    }

    public get buttonBack(): Button {
        return this._buttonBack;
    }

    public show(){
        this.visible = true;
    }

    public hide(){
        this.visible = false;
    }

    destroyView(): void {
        this.destroy();
        GlobalDispatcher.remove("RESIZE_APP", this.resize);
    }
}