export const CardConfig = {
    suits: ["Clovers", "Hearts", "Pikes", "Tiles"],
    values: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "A"],
    suffix: "_white",

    getAllCards(): string[] {
        const cards: string[] = [];
        for (const suit of this.suits)
            for (const value of this.values)
                cards.push(`${suit}_${value}${this.suffix}`);
        return cards;
    }
};
