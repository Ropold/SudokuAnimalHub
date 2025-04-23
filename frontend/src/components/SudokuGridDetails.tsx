import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SudokuGridModel } from "./model/SudokuGridModel.ts";
import SudokuGridCard from "./SudokuGridCard.tsx";
import {DifficultyEnum} from "./model/DifficultyEnum.ts";
import { validateSudokuSubmission } from "./utils/sudokuValidation.ts";


export default function SudokuGridDetails() {
    const [sudokuGrid, setSudokuGrid] = useState<SudokuGridModel | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [initialGrid, setInitialGrid] = useState<number[][]>([]);
    const [solutionGrid, setSolutionGrid] = useState<number[][]>([]);
    const [difficultyEnum, setDifficultyEnum] = useState<DifficultyEnum | null>(null);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;
        axios
            .get(`/api/sudoku-grid/${id}`)
            .then((response) => {
                const gridData: SudokuGridModel = response.data;
                setSudokuGrid(gridData);
                setInitialGrid(gridData.initialGrid);
                setSolutionGrid(gridData.solutionGrid);
                setDifficultyEnum(gridData.difficultyEnum);
            })
            .catch((error) => console.error("Error fetching sudoku grid details", error));
    }, [id]);

    function handleConfirmDelete() {
        if (sudokuGrid) {
            axios
                .delete(`/api/sudoku-grid/${sudokuGrid.id}`)
                .then(() => {
                    console.log("Sudoku grid deleted successfully");
                    setSudokuGrid(null);
                })
                .catch((error) => console.error("Error deleting sudoku grid", error));
        }
    }

    // Handle Save Changes ohne FormEvent
    function handleSaveChanges() {
        if (!sudokuGrid) return;

        const validationErrors = validateSudokuSubmission(
            difficultyEnum,
            initialGrid,
            solutionGrid
        );

        if (validationErrors.length > 0) {
            setErrorMessages(validationErrors);
            setShowPopup(true);
            return;
        }

        const updatedGrid = {
            ...sudokuGrid,
            initialGrid,
            solutionGrid,
            difficultyEnum,
        };

        axios
            .put(`/api/sudoku-grid/${sudokuGrid.id}`, updatedGrid)
            .then((response) => {
                console.log("Sudoku grid updated successfully", response.data);
                setSudokuGrid(response.data);
                setIsEditing(false);
            })
            .catch((error) => {
                console.error("Error updating sudoku grid", error);
                setErrorMessages(["An unexpected error occurred."]);
                setShowPopup(true);
            });
    }



    return (
        <div>
            <h3>Sudoku Grid Details</h3>
            <p>ID: {sudokuGrid?.id}</p>

            {/* Edit / Save / Cancel / Delete Buttons */}
            <div className="space-between">
                {!isEditing && (
                    <>
                        <button
                            className="button-group-button"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                        <button
                            id="button-delete"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </button>
                    </>
                )}

                {isEditing && (
                    <>
                        <button
                            type="button"
                            id="button-is-inactive"
                            onClick={() => {
                                if (sudokuGrid) {
                                    setInitialGrid(sudokuGrid.initialGrid);
                                    setSolutionGrid(sudokuGrid.solutionGrid);
                                    setDifficultyEnum(sudokuGrid.difficultyEnum);
                                }
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button className="button-group-button" onClick={handleSaveChanges}>
                            Save Changes
                        </button>
                    </>
                )}

            </div>

            {sudokuGrid ? (
                <>
                    <SudokuGridCard
                        grid={initialGrid}
                        setGrid={setInitialGrid}
                        title="Initial Grid"
                    />
                    <SudokuGridCard
                        grid={solutionGrid}
                        setGrid={setSolutionGrid}
                        title="Solution Grid"
                    />
                </>
            ) : (
                <p>Loading...</p>
            )}

            {/* Validation Error Popup */}
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
                            <button
                                className="popup-cancel"
                                onClick={() => setShowPopup(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}