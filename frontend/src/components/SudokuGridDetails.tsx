import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { SudokuGridModel } from "./model/SudokuGridModel.ts";
import SudokuGridCard from "./SudokuGridCard.tsx";
import { DifficultyEnum, ALL_DIFFICULTY } from "./model/DifficultyEnum.ts";
import { validateSudokuSubmission } from "./utils/SudokuValidation.ts";
import { getDifficultyEnumDisplayName } from "./utils/getDifficultyEnumDisplayName.ts";

export default function SudokuGridDetails() {
    const [sudokuGrid, setSudokuGrid] = useState<SudokuGridModel | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [initialGrid, setInitialGrid] = useState<number[][]>([]);
    const [solutionGrid, setSolutionGrid] = useState<number[][]>([]);
    const [difficultyEnum, setDifficultyEnum] = useState<DifficultyEnum | null>(null);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [sudokuGridToDelete, setSudokuGridToDelete] = useState<SudokuGridModel | null>(null); // Zustand für das Gitter zum Löschen
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

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

    function handleDeleteClick(grid: SudokuGridModel) {
        setSudokuGridToDelete(grid); // Setze das Gitter, das gelöscht werden soll
        setShowPopup(true); // Zeige das Bestätigungs-Pop-up
    }

    function handleConfirmDelete() {
        if (sudokuGridToDelete) {
            axios
                .delete(`/api/sudoku-grid/${sudokuGridToDelete.id}`)
                .then(() => {
                    console.log("Sudoku grid deleted successfully");
                    setSudokuGrid(null);
                    navigate(`/profile`);
                })
                .catch((error) => console.error("Error deleting sudoku grid", error));
        }
        setShowPopup(false); // Schließe das Pop-up
    }

    function handleCancel() {
        setShowPopup(false); // Schließe das Pop-up ohne zu löschen
        setSudokuGridToDelete(null); // Setze das zu löschende Gitter auf null
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

            {/* Difficulty Dropdown */}
            {isEditing && (
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
            )}

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
                            onClick={() => sudokuGrid && handleDeleteClick(sudokuGrid)}
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
            {showPopup && !sudokuGridToDelete && (
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

            {/* Delete Confirmation Popup */}
            {showPopup && sudokuGridToDelete && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this Sudoku grid?</p>
                        <div className="popup-actions">
                            <button onClick={handleConfirmDelete} className="popup-confirm">
                                Yes, Delete
                            </button>
                            <button onClick={handleCancel} className="popup-cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
