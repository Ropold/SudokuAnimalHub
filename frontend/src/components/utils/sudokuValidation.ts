import {DifficultyEnum} from "../model/DifficultyEnum.ts";

export function isValidSudoku(grid: number[][]): boolean {
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

export function validateSudokuSubmission(
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