import {View} from "../../../core/mvc/View";
import AssetsLoader from "../../../assetsLoader/AssetsLoader";
import {Button} from "../../../common/button/Button";
import GameModel from "../../../store/gameModel/GameModel";
import * as PIXI from "pixi.js";
import PhoenixFlameScreenModel from "./PhoenixFlameScreenModel";
import ParticleEffect from "../../../common/particleEffect/ParticleEffect";
import config from './config/emitter.json'
import GlobalDispatcher from "../../../events/GlobalDispatcher";

export default class PhoenixFlameScreenView extends View<PhoenixFlameScreenModel> {

    private _mWidth: number = GameModel.visibleWidth;
    private _mHeight: number = GameModel.visibleHeight;

    private _fireEffectsContainer: PIXI.Container | undefined;
    private _firePlace: PIXI.Container | undefined;

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
        this._buttonBack = new Button(buttonTexture, 250, 250);
        this.addChild(this._buttonBack as PIXI.DisplayObject);

        this.updateButtonBackLayout();
    }

    public createFire(){
        this._firePlace = new PIXI.Container();
        this._firePlace.width = 700;
        this._firePlace.height = 700;

        this._firePlace.x = this._mWidth / 2;
        this._firePlace.y = this._mHeight / 2;

        this.addChild(this._firePlace as PIXI.DisplayObject);

        const firePlaceTexture = AssetsLoader.get("fire_place");
        const background = new PIXI.Sprite(firePlaceTexture);

        background.width = 700;
        background.height = 700;

        background.x = 0;
        background.y = 0;

        this._firePlace.addChild(background as PIXI.DisplayObject);

        this.createFireParticle();
     }

    private createFireParticle(){
        this._fireEffectsContainer = new PIXI.Container();
        this._fireEffectsContainer.width = 700;
        this._fireEffectsContainer.height = 700;

        this._fireEffectsContainer.x = (this._firePlace.width - this._fireEffectsContainer.width) / 2;
        this._fireEffectsContainer.y = (this._firePlace.height - this._fireEffectsContainer.height) / 2;

        const fireTexture = AssetsLoader.get("particle");
        const effect = new ParticleEffect(this._fireEffectsContainer, config, fireTexture);
        this._fireEffectsContainer.scale.set(10);

        this._firePlace.addChild(this._fireEffectsContainer as PIXI.DisplayObject);

        effect.playParticle()
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