import {View} from "../../../core/mvc/View";
import AssetsLoader from "../../../assetsLoader/AssetsLoader";
import {Button} from "../../../common/button/Button";
import * as PIXI from "pixi.js";
import GameModel from "../../../store/gameModel/GameModel";
import {DI} from "../../../core/di/DI";
import MagicWordsScreenModel, {AvatarPosition, ConversationPayload} from "./MagicWordsScreenModel";
import {Container} from "pixi.js";
import GlobalDispatcher from "../../../events/GlobalDispatcher";

type Character = {
    name: string,
    texture: PIXI.Sprite
    position: AvatarPosition
}

export default class MagicWordsScreenView extends View<MagicWordsScreenModel> {

    private _background!: PIXI.Sprite;
    private _buttonBack!: Button;

    private characters?: Character[] = [];

    private _dialogContainer: PIXI.Container;

    private dialogueData: ConversationPayload;

    create() {
        this.createBackground();
        this.createButtonBack();

        GlobalDispatcher.add("RESIZE_APP", this.resize, this);
    }

    public init(dialogueData: ConversationPayload) {
        this.dialogueData = dialogueData;

        this._dialogContainer = new PIXI.Container();
        this.addChild(this._dialogContainer as PIXI.DisplayObject);

        this.createCharacters();
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

    private createCharacters() {
        this.dialogueData.avatars.forEach((avatar) => {
            if(!avatar) return;

            const sprite = this.createCharacterSprite(avatar.name, avatar.url);

            const exists = this.characters.some(char => char.position === avatar.position);
            if(exists) return;

            this.characters.push({
                name: avatar.name,
                texture: sprite,
                position: avatar.position,
            });

            switch (avatar.position) {
                case "left":
                    sprite.x = GameModel.centerX - 600;
                    sprite.y = GameModel.centerY;
                    break;
                case "right":
                    sprite.x = GameModel.centerX + 600;
                    sprite.y = GameModel.centerY;
                    break;
                case "center":
                default:
                    sprite.x = GameModel.centerX;
                    sprite.y = GameModel.centerY;
                    break;
            }
            this.addChild(sprite as PIXI.DisplayObject);
        });
    }

    private createCharacterSprite(name: string, url: string): PIXI.Sprite {
        let texture: PIXI.Texture | null = null;

        texture = AssetsLoader.get(name);

        if (!texture) {
            const gfx = new PIXI.Graphics();
            gfx.beginFill(0x9999ff);
            gfx.drawRoundedRect(0, 0, 500, 500, 20);
            gfx.endFill();

            const label = new PIXI.Text(name, {
                fontFamily: "Arial",
                fontSize: 28,
                fill: 0xffffff,
                align: "center",
            });
            label.anchor.set(0.5);
            label.x = 0;
            label.y = 0;
            gfx.addChild(label as PIXI.DisplayObject);

            texture = DI.app.renderer.generateTexture(gfx);
        }

        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.scale.set(3);
        return sprite;
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

    public getCharacterByName(name: string): Character | undefined {
        return this.characters.find((c: Character) => c.name === name);
    }

    public get buttonBack(): Button {
        return this._buttonBack;
    }

    public get dialogContainer(): Container {
        return this._dialogContainer;
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