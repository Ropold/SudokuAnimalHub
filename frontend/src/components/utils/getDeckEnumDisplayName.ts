import {DeckEnum} from "../model/DeckEnum.ts";

export function getDeckEnumDisplayName(deckEnum:DeckEnum):string{
    const deckEnumDisplayNames: Record<DeckEnum, string> = {
        TEMP_DECK: "Temporary Deck",
        SAVED_DECK: "Saved Deck",
        NUMBER_DECK: "Number Deck",
    }
    return deckEnumDisplayNames[deckEnum];
}