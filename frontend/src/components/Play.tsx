import { NumberToAnimalMap } from "./model/NumberToAnimalMap.ts";
import { HighScoreModel } from "./model/HighScoreModel.ts";
import { useEffect, useState } from "react";
import {DEFAULT_GRID, DefaultSudokuGrid, SudokuGridModel} from "./model/SudokuGridModel.ts";
import { DeckEnum } from "./model/DeckEnum.ts";
import SudokuPreviewDeckCard from "./SudokuPreviewDeckCard.tsx";
import "./styles/Play.css";
import SudokuPlayDeckCard from "./SudokuPlayDeckCard.tsx";
import axios from "axios";

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
};

export default function Play(props: Readonly<PlayProps>) {
    const [showPreviewMode, setShowPreviewMode] = useState<boolean>(true);
    const [gameFinished, setGameFinished] = useState<boolean>(true);
    const [deckEnum, setDeckEnum] = useState<DeckEnum>("TEMP_DECK");
    const [difficultyEnum, setDifficultyEnum] = useState<string>("EASY");
    const [time, setTime] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [currentSudoku, setCurrentSudoku] = useState<SudokuGridModel | null>(DefaultSudokuGrid);
    const [showErrorBorders, setShowErrorBorders] = useState<boolean>(false);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [showNameInput, setShowNameInput] = useState<boolean>(false);
    const [showWinAnimation, setShowWinAnimation] = useState<boolean>(false);
    const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
    const [helpCount, setHelpCount] = useState<number>(0);
    const [playerName, setPlayerName] = useState<string>("");
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [hasStartedOnce, setHasStartedOnce] = useState(false);

    function postHighScore() {
        const highScoreData = {
            id: null,
            playerName,
            githubId: props.user,
            difficultyEnum: currentSudoku?.difficultyEnum,
            deckEnum: deckEnum,
            helpCount: helpCount,
            scoreTime: parseFloat(time.toFixed(1)),
            date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        }
        console.log("High Score Data:", highScoreData);

        axios
            .post("/api/high-score", highScoreData)
            .then(() => {
                setShowNameInput(false);
                props.getHighScoreEasy();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function handleSaveHighScore() {
        if (playerName.trim().length < 3) {
            setPopupMessage("Your name must be at least 3 characters long!");
            setShowPopup(true);
            return;
        }
        postHighScore();
    }

    function checkForHighScore() {
        const highScores = difficultyEnum === "EASY" ? props.highScoreEasy :
            difficultyEnum === "MEDIUM" ? props.highScoreMedium : props.highScoreHard;

        if(highScores.length<10){
            setIsNewHighScore(true);
            setShowNameInput(true);
            return;
        }

        const lowestScore = highScores[highScores.length - 1];

        const isBetterScore = time < lowestScore.scoreTime;
        if(isBetterScore) {
            setIsNewHighScore(true);
            setShowNameInput(true);
        }else {
            return;
        }
    }

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

    function handleHardResetGame() {
        setShowPreviewMode(true);
        setGameFinished(true);
        setHasStartedOnce(false);
        setTime(0);
        setHelpCount(0);
        setIsNewHighScore(false);
    }


    function handleStartGame() {
        const filtered = props.allSudokuGrids.filter(grid => grid.difficultyEnum === difficultyEnum);
        let newGrid = DefaultSudokuGrid;

        if (filtered.length > 0) {
            const otherGrids = filtered.filter(grid => grid.id !== currentSudoku?.id);
            newGrid = otherGrids.length > 0
                ? otherGrids[Math.floor(Math.random() * otherGrids.length)]
                : filtered[0]; // Nimm das gleiche nochmal
        }
        setHasStartedOnce(true);
        setShowNameInput(false);
        setCurrentSudoku(newGrid);
        setResetTrigger(prev => prev + 1); // zwinge Re-Render durch Key-Wechsel
        setShowPreviewMode(false);
        setGameFinished(false);
        setHelpCount(0);
    }

    const handleShowErrors = () => {
        setShowErrorBorders(true);
        setTimeout(() => setShowErrorBorders(false), 2000); // Fehler-Animation 2 Sekunden
        setHelpCount(prev => prev + 1);
    };

    function handleResetCurrentSudoku() {
        setResetTrigger(prev => prev + 1);
        setTime(0);
        setHelpCount(0);
    }

    useEffect(() => {
        if(hasStartedOnce && gameFinished){
            setShowWinAnimation(true);
            checkForHighScore();
            setTimeout(() => {
                setShowWinAnimation(false);
            }, 3000); // Animation für 2 Sekunden anzeigen
        }
    }, [gameFinished]);


    return (
        <>
            <div className="space-between">
                <button className="button-group-button" id={gameFinished ? "start-button" : undefined} onClick={handleStartGame} disabled={!gameFinished}>Start</button>
                <button className="button-group-button" onClick={handleShowErrors} disabled={gameFinished}>Show Errors</button>
                <button className="button-group-button" disabled={gameFinished} onClick={handleResetCurrentSudoku}>Reset Current Sudoku</button>
                <button className="button-group-button" onClick={handleHardResetGame}>Reset Hard</button>
                <div>⏱️ Time: {time.toFixed(1)} sec</div>
            </div>

            {/* Spielername Eingabefeld, wenn ein neuer Highscore erreicht wurde */}
            {isNewHighScore && showNameInput && (
                <form
                    className="high-score-input"
                    onSubmit={(e) => {
                        e.preventDefault(); // Verhindert das Neuladen der Seite
                        handleSaveHighScore();
                    }}
                >
                    <label htmlFor="playerName">
                        Congratulations! You secured a spot on the high score list. Enter your name:
                    </label>
                    <input
                        className="playerName"
                        type="text"
                        id="playerName"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                    />
                    <button
                        className="button-group-button"
                        id="button-border-animation"
                        type="submit"
                    >
                        Save Highscore
                    </button>
                </form>
            )}

            {showWinAnimation && (
                <div className="win-animation">
                    <p>You completed the Sudoku Game game in {time.toFixed(1)} seconds!</p>
                </div>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Hinweis</h3>
                        <p>{popupMessage}</p>
                        <div className="popup-actions">
                            <button onClick={() => setShowPopup(false)} className="popup-confirm">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPreviewMode && (
                <>
                    <div className="border">
                        <div className="space-between">
                            <h4>Choose a deck:</h4>
                            <button onClick={() => setDeckEnum("TEMP_DECK")}
                                    className={`button-group-button ${deckEnum === "TEMP_DECK" ? "active-button-deck-difficulty" : ""}`}>Temp
                                Deck
                            </button>
                            <button onClick={() => setDeckEnum("SAVED_DECK")}
                                    disabled={props.user === "anonymousUser"}
                                    className={`button-group-button ${deckEnum === "SAVED_DECK" ? "active-button-deck-difficulty" : ""}`}>Saved
                                Deck
                            </button>
                            <button onClick={() => setDeckEnum("NUMBER_DECK")}
                                    className={`button-group-button ${deckEnum === "NUMBER_DECK" ? "active-button-deck-difficulty" : ""}`}>Number
                                Deck
                            </button>
                        </div>

                        <div className="space-difficulty">
                            <h4>Choose a difficulty:</h4>
                            <button onClick={() => setDifficultyEnum("EASY")}
                                    className={`button-group-button ${difficultyEnum === "EASY" ? "active-button-deck-difficulty" : ""}`}>Easy
                            </button>
                            <button onClick={() => setDifficultyEnum("MEDIUM")}
                                    className={`button-group-button ${difficultyEnum === "MEDIUM" ? "active-button-deck-difficulty" : ""}`}>Medium
                            </button>
                            <button onClick={() => setDifficultyEnum("HARD")}
                                    className={`button-group-button ${difficultyEnum === "HARD" ? "active-button-deck-difficulty" : ""}`}>Hard
                            </button>
                        </div>
                    </div>

                    <SudokuPreviewDeckCard
                        grid={DEFAULT_GRID}
                        deckMapping={deckEnum === "TEMP_DECK" ? props.tempDeck : deckEnum === "SAVED_DECK" ? props.savedDeck : {}}
                    />
                </>
            )}

            {!showPreviewMode && currentSudoku && (
             <SudokuPlayDeckCard
                 initialGrid={currentSudoku.initialGrid}
                 solutionGrid={currentSudoku.solutionGrid}
                 deckMapping={deckEnum === "TEMP_DECK" ? props.tempDeck : deckEnum === "SAVED_DECK" ? props.savedDeck : {}}
                 setGameFinished={setGameFinished}
                 showErrorBorders={showErrorBorders}
                 key={`${currentSudoku.id}-${resetTrigger}`}
             />
            )
            }
        </>
    );
}