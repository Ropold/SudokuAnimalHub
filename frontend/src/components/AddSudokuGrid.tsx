import {useState} from "react";
import {DEFAULT_GRID} from "./model/SudokuGridModel.ts";

type AddSudokuGridProps = {
    user: string;
}

export default function AddSudokuGrid(props: Readonly<AddSudokuGridProps>) {
    const [difficultyEnum, setDifficultyEnum] = useState<string | null>(null);
    const [grid, setGrid] = useState<number[][]>(DEFAULT_GRID);

    return(
        <>
            <h3>Add Sudoku Grid</h3>
            <p>{props.user}</p>
        </>
    )
}