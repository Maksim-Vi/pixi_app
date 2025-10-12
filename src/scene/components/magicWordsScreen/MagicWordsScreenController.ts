import {Controller} from "../../../core/mvc/Controller";
import MagicWordsScreenModel, {ConversationPayload} from "./MagicWordsScreenModel";
import MagicWordsScreenView from "./MagicWordsScreenView";
import {DI} from "../../../core/di/DI";
import {SceneManager, SceneType} from "../../SceneManager";
import WordsModel from "../../../store/wordsModel/WordsModel";
import {MagicWordsDialogBubble} from "./components/MagicWordsDialogBubble";
import * as PIXI from "pixi.js";

export default class MagicWordsScreenController extends Controller<MagicWordsScreenModel, MagicWordsScreenView>{

    private sceneManager!: SceneManager;
    private dialogueData: ConversationPayload;

    async init() {
        this.view.create()

        this.view.buttonBack?.onClick(() => this.handleButtonBackClick());
        this.hideScreen();
    }

    async showDialogue(){
        this.dialogueData = WordsModel.dialogueData;
        this.model.dialogueData = WordsModel.dialogueData;

        this.view.init(this.dialogueData)
        await this.startDialogue();
    }

    async startDialogue() {
        let index = 0;
        const bubbleConfig = {
            maxWidth: 700,
            textSize: 50,
            emojiSize: 60,
            offsetY: -600,
            backgroundColor: 0xffffe0,
            backgroundAlpha: 0.95,
            radius: 25,
        };

        const nextMessage = () => {
            if (index >= this.dialogueData.dialogue.length) return;
            const { name, text } = this.dialogueData.dialogue[index];
            const speaker = this.view.getCharacterByName(name);

            if (!speaker) {
                console.warn(`No character found for name "${name}"`);
                index++;
                nextMessage();
                return;
            }

            const bubble = new MagicWordsDialogBubble(text, name, speaker.texture, this.dialogueData.emojies, bubbleConfig);
            this.view.dialogContainer.addChild(bubble as PIXI.DisplayObject);

            bubble.show().then(() => {
                index++;
                nextMessage();
            });
        };

        nextMessage();
    }

    handleButtonBackClick() {
        if (!this.sceneManager)
            this.sceneManager = DI.container.resolve<SceneManager>("SceneManager");

        this.sceneManager.loadScene(SceneType.MainScene);
    }

    showScreen(){
        this.view.show();
        this.showDialogue();
    }

    hideScreen(){
        this.view.hide();
    }

    destroy(): void {
        this.view.destroyView()
    }
}
