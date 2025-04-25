import {NumberToAnimalMap} from "./model/NumberToAnimalMap.ts";
import {HighScoreModel} from "./model/HighScoreModel.ts";
import {useEffect, useState} from "react";
import {SudokuGridModel} from "./model/SudokuGridModel.ts";
import {DeckEnum} from "./model/DeckEnum.ts";

type PlayProps = {
    user: string;
    tempDeck: NumberToAnimalMap;
    savedDeck: NumberToAnimalMap;
    highScoreEasy: HighScoreModel[];
    getHighScoreEasy: () => void;
    highScoreMedium: HighScoreModel[];
    getHighScoreMedium: () => void;
    highScoreHard: HighScoreModel[];
    getHighScoreHard: () => void;
    allSudokuGrids: SudokuGridModel[];
}

export default function Play(props: Readonly<PlayProps>) {
    const [showPreviewMode, setShowPreviewMode] = useState<boolean>(true);
    const [gameFinished, setGameFinished] = useState<boolean>(true);
    const [deckEnum, setDeckEnum] = useState<DeckEnum>("TEMP_DECK");
    const [time, setTime] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [showNameInput, setShowNameInput] = useState<boolean>(false);


    // Timer starten, wenn das Spiel beginnt
    useEffect(() => {
        if (!showPreviewMode && !gameFinished) {
            setTime(0);
            const id = window.setInterval(() => {
                setTime((prev) => prev + 0.1);
            }, 100);
            setIntervalId(id);
        } else if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }, [showPreviewMode, gameFinished]);

    return(
        <>
        <h3>Play</h3>
        <p>{props.user}</p>
        </>
    )
}