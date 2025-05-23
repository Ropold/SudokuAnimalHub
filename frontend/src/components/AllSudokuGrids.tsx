import {SudokuGridModel} from "./model/SudokuGridModel.ts";
import {getDifficultyEnumDisplayName} from "./utils/getDifficultyEnumDisplayName.ts";
import {useNavigate} from "react-router-dom";

type AllSudokuGridsProps = {
    allSudokuGrids: SudokuGridModel[];
};

export default function AllSudokuGrids(props: Readonly<AllSudokuGridsProps>) {

    const navigate = useNavigate();

    const handleCardClick = (gridId: string) => {
        navigate(`/sudoku-grid/${gridId}`);
    };

    return (
            <div className="all-sudoku-grid-container">
                {props.allSudokuGrids.map((grid) => (
                    <div key={grid.id} className="all-sudoku-grid-cards" onClick={() => handleCardClick(grid.id)}>
                        <p>Difficulty: {getDifficultyEnumDisplayName(grid.difficultyEnum)}</p>
                        <p>GitHub ID: {grid.githubId}</p>
                        <p>ID: {grid.id}</p>
                    </div>
                ))}
            </div>
    );
}
