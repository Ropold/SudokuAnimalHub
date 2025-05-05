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
    const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);


    // Funktion für Linksklick
    function handleCellClick(row: number, col: number) {
        setSelectedCell({ row, col });
    }


    function handleNumberInput(num: number) {
        if (!selectedCell) return;

        const isEditable = props.initialGrid[selectedCell.row][selectedCell.col] === 0;
        if (!isEditable) return;

        setPlayGrid(prev => {
            const newGrid = structuredClone(prev);
            newGrid[selectedCell.row][selectedCell.col] = num;
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

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (!selectedCell) return;

            const num = parseInt(e.key, 10);
            if (!isNaN(num) && num >= 0 && num <= 9) {
                handleNumberInput(num);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedCell]);


    return (
        <div className="sudoku-deck-center margin-top-20">
            <div>
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

                                        const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                                        const selectedValue = selectedCell ? playGrid[selectedCell.row][selectedCell.col] : null;
                                        const highlight = value !== 0 && value === selectedValue && selectedValue !== 0;

                                        return (
                                            <div
                                                key={`${row}-${col}`}
                                                className={`sudoku-play-cell
                                                    ${isInitial ? "cell-fixed" : "cell-editable"}
                                                    ${props.showErrorBorders && hasError ? "error-cell" : ""}
                                                    ${isSelected ? "selected-cell" : ""}
                                                    ${highlight ? "highlight-same-value" : ""}
                                                `}
                                                onClick={() => handleCellClick(row, col)}
                                                onContextMenu={(e) => e.preventDefault()}
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
                <div className="number-picker margin-top-20">
                    {Array.from({ length: 10 }, (_, i) => {
                        const imageUrl = ResolveImageUrl(i, props.deckMapping);

                        return (
                            <button key={i} onClick={() => handleNumberInput(i)} className="number-button">
                                <div className="number-button-content">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={`Symbol ${i}`} className="number-button-image" />
                                    ) : (
                                        <div className="number-button-placeholder" />
                                    )}
                                    <span className="number-overlay">{i}</span>
                                </div>
                            </button>

                        );
                    })}
                </div>

            </div>
        </div>

    );
}
