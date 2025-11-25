import {View} from "../../../core/mvc/View";
import * as PIXI from "pixi.js";
import GameModel from "../../../store/gameModel/GameModel";
import LoadingSceneModel from "./LoadingSceneModel";
import GlobalDispatcher from "../../../events/GlobalDispatcher";

export default class LoadingSceneView extends View<LoadingSceneModel> {

    private _background!: PIXI.Graphics;
    private _text!: PIXI.Text;

    create() {
        GlobalDispatcher.add("RESIZE_APP", this.resize, this);

        this.createBackground();
        this.createText();
        this.updateLayout();
    }

    private createBackground() {
        this._background = new PIXI.Graphics();
        this.addChild(this._background as PIXI.DisplayObject);
    }

    private createText() {
        this._text = new PIXI.Text("Loading 0%", {
            fontFamily: "Arial",
            fontSize: 50,
            fill: 0xffffff,
            align: "center"
        });
        this._text.anchor.set(0.5);
        this._text.position.set(GameModel.centerX, GameModel.centerY);

        this.addChild(this._text as PIXI.DisplayObject);
    }

    public update(progress: number) {
        this._text.text = `Loading ${progress | 0}%`;
    }

    private updateLayout() {
        this._background.clear();
        this._background.beginFill(0x000333, 0.95);
        this._background.drawRect(0, 0, GameModel.visibleWidth * 2, GameModel.visibleHeight * 2);
        this._background.endFill();

        this._text.position.set(GameModel.centerX, GameModel.centerY);
    }

    private resize() {
        this.updateLayout();
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

// export default class LoadingSceneView extends View<LoadingSceneModel> {
//
//     private _background!: PIXI.Graphics;
//     private _text!: PIXI.Text;
//
//     create() {
//         GlobalDispatcher.add("RESIZE_APP", this.resize, this);
//
//         this.createBackground();
//         this.createText();
//     }
//
//     createBackground() {
//         this._background = new PIXI.Graphics();
//
//         this._background.beginFill(0x000333, 0.95);
//         this._background.drawRect(0, 0, LOGIC_WIDTH, LOGIC_HEIGHT);
//         this._background.endFill();
//         this.addChild(this._background as PIXI.DisplayObject);
//
//         this.updateBackgroundLayout();
//     }
//
//     createText(){
//         this._text = new PIXI.Text("Loading 0%", {
//             fontFamily: "Arial",
//             fontSize: 50,
//             fill: 0xffffff,
//             align: "center"
//         });
//
//         this._text.anchor.set(0.5);
//         this._text.position.set(LOGIC_WIDTH / 2, LOGIC_HEIGHT / 2);
//
//         this.addChild(this._text as PIXI.DisplayObject);
//     }
//
//     public update(progress: number) {
//         this._text.text = `Loading ${progress}%`;
//     }
//
//     private updateBackgroundLayout() {
//         const bg = this._background;
//
//         const scaleX = GameModel.visibleWidth / bg.width;
//         const scaleY = GameModel.visibleHeight / bg.height;
//
//         const scale = Math.max(scaleX, scaleY);
//
//         this._background.width = bg.width * scale + 2000;
//         this._background.height = bg.height * scale + 2000;
//
//         this._background.x = (GameModel.visibleWidth - this._background.width) / 2;
//         this._background.y = (GameModel.visibleHeight - this._background.height) / 2;
//     }
//
//     private updateLayout() {
//
//     }
//
//     private resize() {
//         this.updateLayout();
//     }
//
//     public show() {
//         this.visible = true;
//     }
//
//     public hide() {
//         this.visible = false;
//     }
//
//     destroyView(): void {
//         GlobalDispatcher.remove("RESIZE_APP", this.resize);
//         this.destroy({ children: true });
//     }
// }