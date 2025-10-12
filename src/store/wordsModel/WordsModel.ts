import {ConversationPayload} from "../../scene/components/magicWordsScreen/MagicWordsScreenModel";
import AssetsLoader from "../../assetsLoader/AssetsLoader";

export default new class WordsModel {

    private _dialogueData: ConversationPayload;

    public async loadWordData(){
        try {
            const response = await fetch("https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords");
            const data = await response.json();
            this._dialogueData = data;
            await this.setTextures();

            return data || [];

        } catch (e) {
            return null;
        }
    }

    private setTextures(){
        this._dialogueData.avatars.forEach(async (item) => {
            if(item.url){
                await AssetsLoader.loadFromUrl(item.name, item.url);
            }
        })

        this._dialogueData.emojies.forEach(async (item) => {
            if(item.url){
                await AssetsLoader.loadFromUrl(item.name, item.url);
            }
        })
    }

    get dialogueData(){
        return this._dialogueData
    }

}()