import { DifficultyEnum } from "./DifficultyEnum.ts";

export type SudokuGridModel = {
    id: string;
    initialGrid: number[][];
    solutionGrid: number[][];
    difficultyEnum: DifficultyEnum;
    githubId: string;
};

export const DEFAULT_GRID: number[][] = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
];

export const DefaultSudokuGrid: SudokuGridModel = {
    id: "",
    initialGrid: DEFAULT_GRID,
    solutionGrid: DEFAULT_GRID,
    difficultyEnum: "EASY",
    githubId: "",
};