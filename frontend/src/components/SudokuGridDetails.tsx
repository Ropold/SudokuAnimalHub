import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SudokuGridModel } from "./model/SudokuGridModel.ts";
import SudokuGridCard from "./SudokuGridCard.tsx";
import * as React from "react";
import {DifficultyEnum} from "./model/DifficultyEnum.ts";

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

    function handleSaveChanges(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!sudokuGrid) {
            return;
        }

        const updatedGrid = {
            ...sudokuGrid,
            initialGrid: initialGrid,
            solutionGrid: solutionGrid,
            difficultyEnum: difficultyEnum,
        }

        axios
            .put(`/api/sudoku-grid/${sudokuGrid.id}`, updatedGrid)
            .then((response) => {
                console.log("Sudoku grid updated successfully", response.data);
                setSudokuGrid(response.data);
                setIsEditing(false);
            })
            .catch((error) => console.error("Error updating sudoku grid", error));

    }

    return (
        <div>
            <h3>Sudoku Grid Details of</h3>
            <p>{sudokuGrid?.id}</p>

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
    );
}
