package ropold.backend.model;

import java.util.List;

public record SudokuGridModel(
        String id,
        List<List<Integer>> initialGrid,
        List<List<Integer>> solutionGrid,
        DifficultyEnum difficultyEnum,
        String githubId
) {
}
