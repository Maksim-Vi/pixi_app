import CardModel from "./CardModel";
import CardView from "./CardView";
import {Controller} from "../../core/mvc/Controller";

export default class CardController extends Controller<CardModel, CardView>{

    async init() {
        this.view.create();
    }

    public createCardByName(index: number, name: string){
        this.view.createCard(index, name);
        this.view.setOffsetPosition();
    }

    public async createCardByNameAsync(index: number, name: string){
        await this.view.createCardAsync(index, name);
        this.view.setOffsetPosition();
    }

    destroy(): void {
        this.view.destroyView()
    }

    get index(){
        return this.view.index;
    }
}
