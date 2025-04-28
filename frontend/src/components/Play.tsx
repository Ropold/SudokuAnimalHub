import {NumberToAnimalMap} from "./model/NumberToAnimalMap.ts";
import {HighScoreModel} from "./model/HighScoreModel.ts";
import {useEffect, useState} from "react";
import {SudokuGridModel} from "./model/SudokuGridModel.ts";
import {DeckEnum} from "./model/DeckEnum.ts";
import "./styles/Play.css"

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
    const [difficultyEnum, setDifficultyEnum] = useState<string>("EASY");
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

    function handleResetGame() {
        setShowPreviewMode(true);
        setGameFinished(true);
        setTime(0);
    }

    return(
        <>
            <div className="space-between">
                <button className="button-group-button">start</button>
                <button className="button-group-button" onClick={handleResetGame}>reset</button>
            </div>

            {showPreviewMode && (
                <div className="border">
                    <div className="space-between">
                    <h4>Choose a deck:</h4>
                        <button onClick={() => setDeckEnum("TEMP_DECK")} className={`button-group-button ${deckEnum === "TEMP_DECK" ? "active-button-deck-difficulty" : ""}`}>Temp Deck</button>
                        <button onClick={() => setDeckEnum("SAVED_DECK")} className={`button-group-button ${deckEnum === "SAVED_DECK" ? "active-button-deck-difficulty" : ""}`}>Saved Deck</button>
                        <button onClick={() => setDeckEnum("NUMBER_DECK")} className={`button-group-button ${deckEnum === "NUMBER_DECK" ? "active-button-deck-difficulty" : ""}`}>Number Deck</button>
                    </div>
                    <div className="space-difficulty">
                    <h4>Choose a difficulty:</h4>
                        <button onClick={() => setDifficultyEnum("EASY")} className={`button-group-button ${difficultyEnum === "EASY" ? "active-button-deck-difficulty" : ""}`}>Easy</button>
                        <button onClick={() => setDifficultyEnum("MEDIUM")} className={`button-group-button ${difficultyEnum === "MEDIUM" ? "active-button-deck-difficulty" : ""}`}>Medium</button>
                        <button onClick={() => setDifficultyEnum("HARD")} className={`button-group-button ${difficultyEnum === "HARD" ? "active-button-deck-difficulty" : ""}`}>Hard</button>
                    </div>
                </div>
            )}
        </>

    )
}