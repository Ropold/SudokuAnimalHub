import "./styles/SudokuPlayDeckCard.css";
import * as React from "react";
import { useEffect, useState } from "react";
import { ResolveImageUrl } from "./utils/ResolveImageUrl.ts";

type SudokuPlayDeckCardProps = {
    initialGrid: number[][];
    solutionGrid: number[][];
    deckMapping: { [key: number]: string };
    setGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
    showErrorBorders: boolean;
};

export default function SudokuPlayDeckCard(props: Readonly<SudokuPlayDeckCardProps>) {
    const [playGrid, setPlayGrid] = useState<number[][]>(structuredClone(props.initialGrid));
    const [errors, setErrors] = useState<boolean[][]>(
        Array.from({ length: 9 }, () => Array(9).fill(false))
    );

    // Funktion für Linksklick
    function handleCellClick(row: number, col: number) {
        setPlayGrid(prev => {
            const newGrid = structuredClone(prev);
            if (newGrid[row][col] === 0) {
                newGrid[row][col] = 1;
            } else if (newGrid[row][col] < 9) {
                newGrid[row][col] += 1;
            } else {
                newGrid[row][col] = 0;
            }
            checkForCompletion(newGrid);
            return newGrid;
        });
    }

    // Funktion für Rechtsklick
    function handleRightClick(row: number, col: number, e: React.MouseEvent) {
        e.preventDefault();
        setPlayGrid(prev => {
            const newGrid = structuredClone(prev);
            if (newGrid[row][col] === 0) {
                newGrid[row][col] = 9;
            } else if (newGrid[row][col] > 0) {
                newGrid[row][col] -= 1;
            } else {
                newGrid[row][col] = 9;
            }
            checkForCompletion(newGrid);
            return newGrid;
        });
    }

    function checkForErrors(grid: number[][]) {
        const errors: boolean[][] = [];
        grid.forEach((row, rIdx) => {
            errors[rIdx] = [];
            row.forEach((val, cIdx) => {
                errors[rIdx][cIdx] = val !== props.solutionGrid[rIdx][cIdx];
            });
        });
        return errors;
    }

    function checkForCompletion(grid: number[][]) {
        const isSolved = grid.every((row, rIdx) =>
            row.every((val, cIdx) => val === props.solutionGrid[rIdx][cIdx])
        );
        if (isSolved) {
            props.setGameFinished(true);
        }
    }

    useEffect(() => {
        if (props.showErrorBorders) {
            const newErrors = checkForErrors(playGrid);
            setErrors(newErrors);
        } else {
            // Fehler-Grid zurücksetzen, wenn Fehleranzeige ausgeschaltet ist
            setErrors(Array.from({ length: 9 }, () => Array(9).fill(false)));
        }
    }, [props.showErrorBorders, playGrid]);

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
                                        const hasError = errors[row]?.[col] ?? false;

                                        const imageUrl = ResolveImageUrl(value, props.deckMapping);

                                        return (
                                            <div
                                                key={`${row}-${col}`}
                                                className={`sudoku-play-cell ${isInitial ? "cell-fixed" : "cell-editable"} ${props.showErrorBorders && hasError ? "error-cell" : ""}`}
                                                onClick={() => !isInitial && handleCellClick(row, col)}
                                                onContextMenu={(e) => !isInitial && handleRightClick(row, col, e)}
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
