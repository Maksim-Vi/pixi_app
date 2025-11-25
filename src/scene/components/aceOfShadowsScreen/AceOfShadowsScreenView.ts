import {View} from "../../../core/mvc/View";
import AssetsLoader from "../../../assetsLoader/AssetsLoader";
import {Button} from "../../../common/button/Button";
import GameModel from "../../../store/gameModel/GameModel";
import * as PIXI from "pixi.js";
import AceOfShadowsScreenModel from "./AceOfShadowsScreenModel";
import GlobalDispatcher from "../../../events/GlobalDispatcher";

export default class AceOfShadowsScreenView extends View<AceOfShadowsScreenModel> {

    private _background!: PIXI.Sprite;
    private _buttonBack!: Button;

     create() {
         this.createBackground();
         this.createButtonBack();

         GlobalDispatcher.add("RESIZE_APP", this.resize, this);
     }

    createBackground() {
        const galaxyTexture = AssetsLoader.get("galexy_bg");
        this._background = new PIXI.Sprite(galaxyTexture);
        this.addChild(this._background as PIXI.DisplayObject);

        this.updateBackgroundLayout();
    }

    createButtonBack() {
        const buttonTexture = AssetsLoader.get("button_page_back");
        this._buttonBack = new Button(buttonTexture, 100, 100);
        this.addChild(this._buttonBack as PIXI.DisplayObject);

        this.updateButtonBackLayout();
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