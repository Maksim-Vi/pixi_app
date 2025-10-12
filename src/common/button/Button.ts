import * as PIXI from "pixi.js";

export class Button extends PIXI.Container {

    private buttonSprite: PIXI.Sprite | PIXI.Graphics;
    private content: PIXI.Sprite | PIXI.Text | null = null;
    private eventEmitter: PIXI.utils.EventEmitter;
    private _isEnabled: boolean = true;
    private _buttonWidth: number;
    private _buttonHeight: number;

    constructor(texture: PIXI.Texture | null, width: number, height: number) {
        super();
        this._buttonWidth = width;
        this._buttonHeight = height;
        this.eventEmitter = new PIXI.utils.EventEmitter();

        if (texture) {
           this.buttonSprite = new PIXI.Sprite(texture);
        } else {
            const g = new PIXI.Graphics();
            const radius = 10;
            g.beginFill(0x3498db);
            g.lineStyle(2, 0xffffff);
            g.drawRoundedRect(0, 0, width, height, radius);
            g.endFill();
            this.buttonSprite = g;
        }

        if (this.buttonSprite instanceof PIXI.Sprite) {
            this.buttonSprite.width = width;
            this.buttonSprite.height = height;
        }

        this.addChild(this.buttonSprite as PIXI.DisplayObject);

        this.interactive = true;
        this.cursor = "pointer";

        this.on("pointerdown", () => {
            if (this._isEnabled) {
                this.eventEmitter.emit("click");
            }
        });
    }

    public setText(label: string, style?: Partial<PIXI.ITextStyle>): void {
        if (this.content) {
            this.removeChild(this.content as PIXI.DisplayObject);
            this.content = null;
        }

        this.content = new PIXI.Text(label, {
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0xffffff,
            align: "center",
            ...style
        });
        this.centerContent();
        this.addChild(this.content as PIXI.DisplayObject);
    }

    public setSprite(sprite: PIXI.Sprite): void {
        if (this.content) {
            this.removeChild(this.content as PIXI.DisplayObject);
            this.content = null;
        }
        this.content = sprite;
        this.centerContent();
        this.addChild(this.content as PIXI.DisplayObject);
    }

    private centerContent(): void {
        if (this.content) {
            this.content.x = (this._buttonWidth - this.content.width) / 2;
            this.content.y = (this._buttonHeight - this.content.height) / 2;
        }
    }

    public set enabled(value: boolean) {
        this._isEnabled = value;
        this.interactive = value;
        this.buttonSprite.alpha = value ? 1.0 : 0.5;
    }

    public get enabled(): boolean {
        return this._isEnabled;
    }

    public onClick(callback: () => void): void {
        this.eventEmitter.on("click", callback);
    }

    public resize(width: number, height: number): void {
        this._buttonWidth = width;
        this._buttonHeight = height;

        if (this.buttonSprite instanceof PIXI.Sprite) {
            this.buttonSprite.width = width;
            this.buttonSprite.height = height;
        } else if (this.buttonSprite instanceof PIXI.Graphics) {
            this.buttonSprite.clear();
            const radius = Math.min(width, height) * 0.1;
            this.buttonSprite.beginFill(0x3498db);
            this.buttonSprite.lineStyle(2, 0xffffff);
            this.buttonSprite.drawRoundedRect(0, 0, width, height, radius);
            this.buttonSprite.endFill();
        }

        this.centerContent();
    }

    public setTextStyle(style: Partial<PIXI.ITextStyle>): void {
        if (this.content instanceof PIXI.Text) {
            this.content.style = new PIXI.TextStyle({
                ...this.content.style,
                ...style
            });
            this.centerContent();
        }
    }

    public setTexture(texture: PIXI.Texture): void {
        if (this.buttonSprite instanceof PIXI.Sprite) {
            this.buttonSprite.texture = texture;
        }
    }

    public destroy(options?: PIXI.IDestroyOptions): void {
        this.eventEmitter.removeAllListeners();
        super.destroy({ children: true, ...options });
    }
}
