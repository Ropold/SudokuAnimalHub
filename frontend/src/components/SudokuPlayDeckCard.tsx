import "./styles/SudokuPlayDeckCard.css";
import * as React from "react";
import { useState } from "react";
import {ResolveImageUrl} from "./utils/ResolveImageUrl.ts";

type SudokuPlayDeckCardProps = {
    initialGrid: number[][];
    solutionGrid: number[][];
    deckMapping: { [key: number]: string };
    setGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SudokuPlayDeckCard(props: Readonly<SudokuPlayDeckCardProps>) {
    const [playGrid, setPlayGrid] = useState<number[][]>(structuredClone(props.initialGrid));

    function handleCellClick(row: number, col: number) {
        setPlayGrid(prev => {
            const newGrid = structuredClone(prev);
            newGrid[row][col] = (newGrid[row][col] % 9) + 1; // Loop 1–9
            checkForCompletion(newGrid);
            return newGrid;
        });
    }

    function checkForCompletion(grid: number[][]) {
        const isSolved = grid.every((row, rIdx) =>
            row.every((val, cIdx) => val === props.solutionGrid[rIdx][cIdx])
        );
        if (isSolved) {
            props.setGameFinished(true);
        }
    }

    return (
            <div className="sudoku-deck-center">
                <div className="sudoku-play-board">
                    {Array.from({length: 3}, (_, blockRow) => (
                        <div key={blockRow} className="sudoku-play-block-row">
                            {Array.from({length: 3}, (_, blockCol) => (
                                <div key={blockCol} className="sudoku-play-block">
                                    {Array.from({length: 3}, (_, innerRow) =>
                                        Array.from({length: 3}, (_, innerCol) => {
                                            const row = blockRow * 3 + innerRow;
                                            const col = blockCol * 3 + innerCol;
                                            const value = playGrid[row][col];
                                            const isInitial = props.initialGrid[row][col] !== 0;

                                            const imageUrl = ResolveImageUrl(value, props.deckMapping);  // <-- hier verwenden

                                            return (
                                                <div
                                                    key={`${row}-${col}`}
                                                    className={`sudoku-play-cell ${isInitial ? "cell-fixed" : "cell-editable"}`}
                                                    onClick={() => !isInitial && handleCellClick(row, col)}
                                                >
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt="Deck" className="sudoku-play-image"/>
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