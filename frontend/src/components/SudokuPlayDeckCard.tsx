import "./styles/SudokuPlayDeckCard.css";
import * as React from "react";
import { useState } from "react";
import { ResolveImageUrl } from "./utils/ResolveImageUrl.ts";

type SudokuPlayDeckCardProps = {
    initialGrid: number[][];
    solutionGrid: number[][];
    deckMapping: { [key: number]: string };
    setGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SudokuPlayDeckCard(props: Readonly<SudokuPlayDeckCardProps>) {
    const [playGrid, setPlayGrid] = useState<number[][]>(structuredClone(props.initialGrid));

    // Funktion für Linksklick
    function handleCellClick(row: number, col: number) {
        setPlayGrid(prev => {
            const newGrid = structuredClone(prev);
            // Wenn der Wert 0 ist, setzen wir ihn auf 1, ansonsten erhöhen wir ihn um 1
            if (newGrid[row][col] === 0) {
                newGrid[row][col] = 1; // Start mit 1, wenn es leer ist
            } else if (newGrid[row][col] < 9) {
                newGrid[row][col] += 1; // Zyklisch von 1–9
            } else {
                newGrid[row][col] = 0; // Nach 9 auf 0 zurücksetzen
            }
            checkForCompletion(newGrid);
            return newGrid;
        });
    }

    // Funktion für Rechtsklick
    function handleRightClick(row: number, col: number, e: React.MouseEvent) {
        e.preventDefault(); // Verhindert das Standard-Kontextmenü
        setPlayGrid(prev => {
            const newGrid = structuredClone(prev);
            // Wenn der Wert 0 ist, setzen wir ihn auf 9, sonst verringern wir den Wert um 1
            if (newGrid[row][col] === 0) {
                newGrid[row][col] = 9; // Wenn leer, setze auf 9
            } else if (newGrid[row][col] > 0) {
                newGrid[row][col] -= 1; // Wenn > 0, verringern
            } else {
                newGrid[row][col] = 9; // Wenn 0, auf 9 setzen
            }
            checkForCompletion(newGrid);
            return newGrid;
        });
    }

    // Überprüfen, ob das Sudoku gelöst ist
    function checkForCompletion(grid: number[][]) {
        const isSolved = grid.every((row, rIdx) =>
            row.every((val, cIdx) => val === props.solutionGrid[rIdx][cIdx])
        );
        if (isSolved) {
            props.setGameFinished(true);
        }
    }

    return (
        <div className="sudoku-deck-center margin-top-20">
            <div className="sudoku-play-board">
                {Array.from({ length: 3 }, (_, blockRow) => (
                    <div key={blockRow} className="sudoku-play-block-row">
                        {Array.from({ length: 3 }, (_, blockCol) => (
                            <div key={blockCol} className="sudoku-play-block">
                                {Array.from({ length: 3 }, (_, innerRow) =>
                                    Array.from({ length: 3 }, (_, innerCol) => {
                                        const row = blockRow * 3 + innerRow;
                                        const col = blockCol * 3 + innerCol;
                                        const value = playGrid[row][col];
                                        const isInitial = props.initialGrid[row][col] !== 0;

                                        const imageUrl = ResolveImageUrl(value, props.deckMapping);  // <-- hier verwenden

                                        return (
                                            <div
                                                key={`${row}-${col}`}
                                                className={`sudoku-play-cell ${isInitial ? "cell-fixed" : "cell-editable"}`}
                                                onClick={() => !isInitial && handleCellClick(row, col)} // Linksklick
                                                onContextMenu={(e) => !isInitial && handleRightClick(row, col, e)} // Rechtsklick
                                            >
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt="Deck" className="sudoku-play-image" />
                                                ) : value !== 0 ? (
                                                    <span>{value}</span>
                                                ) : null}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
