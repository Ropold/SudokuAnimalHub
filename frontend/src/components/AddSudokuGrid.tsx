import {useState} from "react";
import {DEFAULT_GRID, EMPTY_GRID} from "./model/SudokuGridModel.ts";
import SudokuGridCard from "./SudokuGridCard.tsx";
import {ALL_DIFFICULTY, DifficultyEnum} from "./model/DifficultyEnum.ts";
import {getDifficultyEnumDisplayName} from "./utils/getDifficultyEnumDisplayName.ts";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {validateSudokuSubmission} from "./utils/SudokuValidation.ts";

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
    const isEditing = true;


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
            .post(`api/sudoku-grid`, postSudokuGrid)
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
                            isEditing={isEditing}
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
                            isEditing={isEditing    }
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
