import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SudokuGridModel } from "./model/SudokuGridModel.ts";
import SudokuGridCard from "./SudokuGridCard.tsx";

export default function SudokuGridDetails() {
    const [sudokuGrid, setSudokuGrid] = useState<SudokuGridModel | null>(null);
    const [initialGrid, setInitialGrid] = useState<number[][]>([]);
    const [solutionGrid, setSolutionGrid] = useState<number[][]>([]);
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
            })
            .catch((error) => console.error("Error fetching sudoku grid details", error));
    }, [id]);

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
