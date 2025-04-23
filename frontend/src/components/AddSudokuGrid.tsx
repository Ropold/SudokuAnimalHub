import {useState} from "react";
import {DEFAULT_GRID, EMPTY_GRID} from "./model/SudokuGridModel.ts";
import SudokuGridCard from "./SudokuGridCard.tsx";
import {ALL_DIFFICULTY, DifficultyEnum} from "./model/DifficultyEnum.ts";
import {getDifficultyEnumDisplayName} from "./utils/getDifficultyEnumDisplayName.ts";
import axios from "axios";
import {useNavigate} from "react-router-dom";

type AddSudokuGridProps = {
    user: string;
};

export default function AddSudokuGrid(props: Readonly<AddSudokuGridProps>) {
    const [difficultyEnum, setDifficultyEnum] = useState<DifficultyEnum | null>(null);
    const [initialGrid, setInitialGrid] = useState<number[][]>(EMPTY_GRID);
    const [solutionGrid, setSolutionGrid] = useState<number[][]>(DEFAULT_GRID);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    function isValidSudoku(grid: number[][]): boolean {
        const isValidGroup = (group: number[]): boolean => {
            const filtered = group.filter((n) => n !== 0);
            const unique = new Set(filtered);
            return filtered.length === unique.size;
        };

        // Rows
        for (let row = 0; row < 9; row++) {
            if (!isValidGroup(grid[row])) return false;
        }

        // Columns
        for (let col = 0; col < 9; col++) {
            const column = grid.map(row => row[col]);
            if (!isValidGroup(column)) return false;
        }

        // 3x3 Blocks
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                const block: number[] = [];
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        block.push(grid[boxRow * 3 + r][boxCol * 3 + c]);
                    }
                }
                if (!isValidGroup(block)) return false;
            }
        }

        return true;
    }

    function validateSudokuSubmission(
        difficultyEnum: DifficultyEnum | null,
        initialGrid: number[][],
        solutionGrid: number[][]
    ): string[] {
        const errors: string[] = [];

        if (!difficultyEnum) {
            errors.push("Difficulty must be selected.");
        }

        // Check: InitialGrid darf nicht komplett leer sein
        const hasAtLeastOneValue = initialGrid.some(row => row.some(val => val !== 0));
        if (!hasAtLeastOneValue) {
            errors.push("Initial Grid must have at least one predefined number.");
        }

        // Check: InitialGrid-Werte müssen mit SolutionGrid übereinstimmen
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const val = initialGrid[row][col];
                if (val !== 0 && val !== solutionGrid[row][col]) {
                    errors.push(`Mismatch at row ${row + 1}, column ${col + 1}.`);
                }
            }
        }

        // Check: SolutionGrid darf keine 0 enthalten
        const isComplete = solutionGrid.every(row => row.every(cell => cell >= 1 && cell <= 9));
        if (!isComplete) {
            errors.push("Solution Grid must be fully filled with numbers from 1 to 9.");
        }

        // Check: SolutionGrid muss gültiges Sudoku sein
        if (!isValidSudoku(solutionGrid)) {
            errors.push("Solution Grid is not a valid Sudoku.");
        }

        return errors;
    }



    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validateSudokuSubmission(difficultyEnum, initialGrid, solutionGrid);

        if (validationErrors.length > 0) {
            setErrorMessages(validationErrors);
            setShowPopup(true);
            return;
        }

        const postSudokuGrid = {
            initialGrid,
            solutionGrid,
            difficultyEnum,
            githubId: props.user
        };

        axios
            .post("api/sudoku-grid", postSudokuGrid)
            .then((response) => {
                console.log("Sudoku Grid saved:", response.data);
                navigate(`/sudoku-grid/${response.data.id}`);
            })
            .catch((error) => {
                console.error("Error saving Sudoku Grid:", error);
                setErrorMessages(["An unexpected error occurred."]);
                setShowPopup(true);
            });
    };

    return (
        <>
            <div className="edit-form margin-top-50">
                <form onSubmit={handleSubmit}>
                    <label>
                        Difficulty:
                        <select
                            className="input-small"
                            id="difficulty"
                            value={difficultyEnum || ""}
                            onChange={(e) => setDifficultyEnum(e.target.value as DifficultyEnum)}
                        >
                            <option value="">Please select a Difficulty</option>
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
                            className="button-group-button margin-top-20"
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
                        className="button-group-button margin-top-20"
                    >
                        Add Sudoku Grid
                    </button>
                </form>

                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <h3>Validation Errors</h3>
                            <ul>
                                {errorMessages.map((msg, index) => (
                                    <li key={index}>{msg}</li>
                                ))}
                            </ul>
                            <div className="popup-actions">
                                <button className="popup-cancel" onClick={() => setShowPopup(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
