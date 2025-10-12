import {Model} from "../../../../core/mvc/Model";
import {CardConfig} from "../config/CardConfig";

export default class DeckModel extends Model {

    public cards: string[] = [];
    public currentLevel: number = 2;

    constructor() {
        super();
        this.resetDeck();
    }

    resetDeck() {
        this.cards = CardConfig.getAllCards();
    }

    shuffleDeck() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(count: number): string[] {
        const shuffled = [...this.cards].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    setCurrentLevel(won: boolean) {
        if(won && this.currentLevel === 4) return;

        if (won) {
            if (this.currentLevel < 4) this.currentLevel++;
        } else {
            this.currentLevel = 2;
        }
    }
}
