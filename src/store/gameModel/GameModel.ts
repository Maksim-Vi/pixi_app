import { Application, Container } from "pixi.js";
import '../wordsModel/WordsModel'

export default new class GameModel {
    private _stageX = 0;
    private _stageY = 0;
    private _scaleX = 1;
    private _scaleY = 1;

    private _visibleX = 0;
    private _visibleY = 0;
    private _visibleWidth = 0;
    private _visibleHeight = 0;

    private _left = 0;
    private _right = 0;
    private _top = 0;
    private _bottom = 0;
    private _centerX = 0;
    private _centerY = 0;

    public setParams(app: Application, stage: Container) {
        this._stageX = stage.x;
        this._stageY = stage.y;
        this._scaleX = stage.scale.x;
        this._scaleY = stage.scale.y;

        this._visibleX = -stage.x / this._scaleX;
        this._visibleY = -stage.y / this._scaleY;

        const resolution = app.renderer.resolution || 1;
        this._visibleWidth = app.renderer.width / this._scaleX / resolution;
        this._visibleHeight = app.renderer.height / this._scaleY / resolution;

        this._left = this._visibleX;
        this._top = this._visibleY;
        this._right = this._visibleX + this._visibleWidth;
        this._bottom = this._visibleY + this._visibleHeight;

        this._centerX = (this._left + this._right) / 2;
        this._centerY = (this._top + this._bottom) / 2;
    }

    public get stageX() { return this._stageX; }
    public get stageY() { return this._stageY; }
    public get scaleX() { return this._scaleX; }
    public get scaleY() { return this._scaleY; }
    public get visibleX() { return this._visibleX; }
    public get visibleY() { return this._visibleY; }
    public get visibleWidth() { return this._visibleWidth; }
    public get visibleHeight() { return this._visibleHeight; }
    public get left() { return this._left; }
    public get right() { return this._right; }
    public get top() { return this._top; }
    public get bottom() { return this._bottom; }
    public get centerX() { return this._centerX; }
    public get centerY() { return this._centerY; }

    public getBounds() {
        return {
            left: this._left,
            right: this._right,
            top: this._top,
            bottom: this._bottom,
            centerX: this._centerX,
            centerY: this._centerY,
            width: this._visibleWidth,
            height: this._visibleHeight,
        };
    }
}()
