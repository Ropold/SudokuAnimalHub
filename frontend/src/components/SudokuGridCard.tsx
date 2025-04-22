import * as React from "react";

type SudokuGridCardProps = {
    grid: number[][];
    setGrid: React.Dispatch<React.SetStateAction<number[][]>>;
    title?: string;
};

export default function SudokuGridCard(props: Readonly<SudokuGridCardProps>){
    return(
        <div className="sudoku-grid-card">
            <h3>{props.title}</h3>
        </div>
    )
}