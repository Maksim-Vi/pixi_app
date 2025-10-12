import * as PIXI from "pixi.js";
import { MagicWordsTextParser } from "./MagicWordsTextParser";
import {EmojiItem} from "../MagicWordsScreenModel";
import { gsap } from "gsap";

export interface BubbleConfig {
    maxWidth?: number;
    minHeight?: number;
    paddingX?: number;
    paddingY?: number;
    radius?: number;
    backgroundColor?: number;
    backgroundAlpha?: number;
    textSize?: number;
    emojiSize?: number;
    offsetX?: number;
    offsetY?: number;
    lineSpacing?: number;
}

export class MagicWordsDialogBubble extends PIXI.Container {
    private bg: PIXI.Graphics;
    private magicWordsTextParser: MagicWordsTextParser;

    private textContainer: PIXI.Container;
    private target: PIXI.Sprite;
    private nameText: PIXI.Text;

    private config: Required<BubbleConfig>;

    constructor(
        text: string,
        speakerName: string,
        target: PIXI.Sprite,
        emojis: EmojiItem[],
        config?: BubbleConfig
    ) {
        super();
        this.target = target;
        this.config = {
            maxWidth: config?.maxWidth ?? 600,
            minHeight: config?.minHeight ?? 120,
            paddingX: config?.paddingX ?? 20,
            paddingY: config?.paddingY ?? 20,
            radius: config?.radius ?? 20,
            backgroundColor: config?.backgroundColor ?? 0xffffff,
            backgroundAlpha: config?.backgroundAlpha ?? 0.9,
            textSize: config?.textSize ?? 40,
            emojiSize: config?.emojiSize ?? 60,
            offsetX: config?.offsetX ?? 0,
            offsetY: config?.offsetY ?? -150,
            lineSpacing: config?.lineSpacing ?? 10,
        };

        this.magicWordsTextParser = new MagicWordsTextParser();
        this.createBubble(text, speakerName, emojis);
    }
    private createBubble(text: string, speakerName: string, emojis: EmojiItem[]) {
        this.bg = new PIXI.Graphics();
        this.addChild(this.bg as PIXI.DisplayObject);

        this.textContainer = new PIXI.Container();
        this.addChild(this.textContainer as PIXI.DisplayObject);

        this.nameText = new PIXI.Text(speakerName, {
            fontFamily: "Arial",
            fontSize: this.config.textSize * 0.7,
            fill: 0x333333,
            fontWeight: "bold",
        });
        this.nameText.x = this.config.paddingX;
        this.nameText.y = this.config.paddingY / 2;
        this.textContainer.addChild(this.nameText as PIXI.DisplayObject);

        const parsedElements = this.magicWordsTextParser.parse(text, emojis, {
            textSize: this.config.textSize,
            emojiSize: this.config.emojiSize,
            maxWidth: this.config.maxWidth - this.config.paddingX * 2,
            lineSpacing: this.config.lineSpacing,
        });

        let xOffset = this.config.paddingX;
        let yOffset = this.nameText.y + this.nameText.height + this.config.paddingY;
        let currentLineHeight = 0;

        parsedElements.forEach(el => {
            const bounds = el.getLocalBounds();
            const elWidth = bounds.width;
            const elHeight = bounds.height;

            if (xOffset + elWidth > this.config.maxWidth - this.config.paddingX) {
                xOffset = this.config.paddingX;
                yOffset += currentLineHeight + this.config.lineSpacing;
                currentLineHeight = 0;
            }

            el.x = xOffset;
            el.y = yOffset;
            this.textContainer.addChild(el);

            xOffset += elWidth + 5;
            currentLineHeight = Math.max(currentLineHeight, elHeight);
        });

        const bubbleWidth = this.config.maxWidth;
        const bubbleHeight = Math.max(yOffset + currentLineHeight + this.config.paddingY, this.config.minHeight);

        this.bg.clear();
        this.bg.beginFill(this.config.backgroundColor, this.config.backgroundAlpha);
        this.bg.drawRoundedRect(0, 0, bubbleWidth, bubbleHeight, this.config.radius);
        this.bg.endFill();

        this.x = this.target.x - bubbleWidth / 2 + this.config.offsetX;
        this.y = this.target.y + this.config.offsetY;
        this.alpha = 0;
    }

    public async show() {
        await gsap.to(this, { alpha: 1, duration: 1 });
        await gsap.to(this, { alpha: 1, duration: 2 });
        await gsap.to(this, { alpha: 0, duration: 1 });
        this.destroy();
    }
}
