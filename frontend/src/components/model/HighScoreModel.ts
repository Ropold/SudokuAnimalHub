import {DifficultyEnum} from "./DifficultyEnum.ts";
import {DeckEnum} from "./DeckEnum.ts";

export type HighScoreModel = {
    id: string;
    playerName: string;
    githubId: string;
    difficultyEnum: DifficultyEnum;
    deckEnum: DeckEnum;
    scoreTime: number;
    numberOfClicks: number;
    date: string;
}