import { DifficultyEnum } from "./DifficultyEnum.ts";

export type SudokuGridModel = {
    id: string;
    initialGrid: number[][];
    solutionGrid: number[][];
    difficultyEnum: DifficultyEnum;
    githubId: string;
};

export const DEFAULT_GRID: number[][] = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

export const DEFAULT_INITIAL_GRID: number[][] = [
    [5, 3, 0, 6, 0, 8, 9, 0, 2],
    [0, 0, 2, 1, 9, 5, 3, 4, 0],
    [1, 0, 8, 3, 0, 0, 0, 6, 7],
    [8, 5, 0, 0, 6, 1, 4, 0, 3],
    [0, 2, 6, 8, 0, 3, 0, 9, 1],
    [7, 1, 3, 0, 2, 4, 8, 5, 0],
    [0, 6, 1, 5, 0, 7, 2, 0, 0],
    [2, 0, 7, 4, 1, 9, 6, 3, 0],
    [3, 4, 0, 2, 8, 6, 0, 7, 9]
];



export const EMPTY_GRID: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const DefaultSudokuGrid: SudokuGridModel = {
    id: "",
    initialGrid: DEFAULT_INITIAL_GRID,
    solutionGrid: DEFAULT_GRID,
    difficultyEnum: "EASY",
    githubId: "",
};