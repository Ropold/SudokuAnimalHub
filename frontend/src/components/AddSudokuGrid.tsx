import {useState} from "react";
import {DEFAULT_GRID} from "./model/SudokuGridModel.ts";
import SudokuGridCard from "./SudokuGridCard.tsx";
import {ALL_DIFFICULTY, DifficultyEnum} from "./model/DifficultyEnum.ts";
import {getDifficultyEnumDisplayName} from "./utils/getDifficultyEnumDisplayName.ts";

type AddSudokuGridProps = {
    user: string;
}

export default function AddSudokuGrid(props: Readonly<AddSudokuGridProps>) {
    const [difficultyEnum, setDifficultyEnum] = useState<DifficultyEnum | null>(null);
    const [initialGrid, setInitialGrid] = useState<number[][]>(DEFAULT_GRID);
    const [solutionGrid, setSolutionGrid] = useState<number[][]>(DEFAULT_GRID);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const postSudokuGrid = {
            initialGrid,
            solutionGrid,
            difficultyEnum,
            githubId: props.user
        };
        console.log("Sudoku Grid submitted:", postSudokuGrid);
        // Add your submission logic here (e.g., send the data to an API)
    };

    return (
        <>
            <div className="edit-form">
                <h3>Add Sudoku Grid</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Difficulty:
                        <select
                            className="input-small"
                            value={difficultyEnum || ""}
                            onChange={(e) => setDifficultyEnum(e.target.value as DifficultyEnum)}
                        >
                            <option value="">Please select a Category</option>
                            {ALL_DIFFICULTY.map((difficulty) => (
                                <option key={difficulty} value={difficulty}>
                                    {getDifficultyEnumDisplayName(difficulty)}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div>
                        <SudokuGridCard
                            grid={initialGrid}
                            setGrid={setInitialGrid}
                            title="Initial Grid"
                        />

                        <button
                            type="button"
                            className="button-group-button"
                            onClick={() => setSolutionGrid(initialGrid)}
                        >
                            Transfer InitialGrid Data to SolutionGrid
                        </button>

                        <SudokuGridCard
                            grid={solutionGrid}
                            setGrid={setSolutionGrid}
                            title="Solution Grid"
                        />
                    </div>

                    <button
                        type="submit"
                        className="button-group-button"
                    >
                        Add Sudoku Grid
                    </button>
                </form>
            </div>
        </>
    );
}