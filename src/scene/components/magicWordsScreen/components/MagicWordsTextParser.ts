import * as PIXI from "pixi.js";
import {EmojiItem} from "../MagicWordsScreenModel";
import AssetsLoader from "../../../../assetsLoader/AssetsLoader";
import {DI} from "../../../../core/di/DI";

export class MagicWordsTextParser {
    public parse(
        text: string,
        emojis: EmojiItem[],
        opts: { textSize: number; emojiSize: number; maxWidth: number; lineSpacing: number }
    ) {
        const parts = text.split(" ");
        const elements: PIXI.DisplayObject[] = [];

        parts.forEach((part) => {
            if (part.startsWith("{") && part.endsWith("}")) {

                const name = part.slice(1, -1);
                const emoji = emojis.find(e => e.name === name);

                if (emoji) {
                    const texture = this.getIcon(emoji.name);
                    const sprite = new PIXI.Sprite(texture);
                    sprite.width = sprite.height = opts.emojiSize;
                    elements.push(sprite as PIXI.DisplayObject);
                } else {
                    const label = new PIXI.Text(part, {
                        fontFamily: "Arial",
                        fontSize: opts.textSize,
                        fill: 0x000000,
                    });
                    elements.push(label as PIXI.DisplayObject);
                }

            } else {
                const label = new PIXI.Text(part, {
                    fontFamily: "Arial",
                    fontSize: opts.textSize,
                    fill: 0x000000,
                    wordWrap: true,
                    wordWrapWidth: opts.maxWidth,
                });

                elements.push(label as PIXI.DisplayObject);
            }
        });

        return elements;
    }

    private getIcon(name: string): PIXI.Texture {
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

        return texture;
    }
}

