import * as React from "react";
import "./styles/SudokuGridCard.css";

type SudokuGridCardProps = {
    grid: number[][];
    setGrid: React.Dispatch<React.SetStateAction<number[][]>>;
    title?: string;
};

export default function SudokuGridCard(props: Readonly<SudokuGridCardProps>) {
    const { grid, setGrid, title } = props;

    const handleChange = (row: number, col: number, value: string) => {
        const newGrid = grid.map((r) => [...r]);
        const parsed = parseInt(value);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 9) {
            newGrid[row][col] = parsed;
        } else if (value === "") {
            newGrid[row][col] = 0;
        }
        setGrid(newGrid);
    };

    return (
        <>
            <h3>{title || "Sudoku Grid"}</h3>
        <div className="sudoku-grid-card">
            <div className="sudoku-board">
                {Array.from({ length: 3 }, (_, blockRow) => (
                    <div key={blockRow} className="sudoku-block-row">
                        {Array.from({ length: 3 }, (_, blockCol) => (
                            <div key={blockCol} className="sudoku-block">
                                {Array.from({ length: 3 }, (_, innerRow) =>
                                    Array.from({ length: 3 }, (_, innerCol) => {
                                        const row = blockRow * 3 + innerRow;
                                        const col = blockCol * 3 + innerCol;
                                        const value = grid[row][col];
                                        return (
                                            <input
                                                key={`${row}-${col}`}
                                                className="sudoku-cell"
                                                type="text"
                                                maxLength={1}
                                                value={value === 0 ? "" : value}
                                                onChange={(e) =>
                                                    handleChange(row, col, e.target.value)
                                                }
                                            />
                                        );
                                    })
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}
