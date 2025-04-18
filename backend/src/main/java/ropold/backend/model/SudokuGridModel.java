package ropold.backend.model;

import java.util.List;

public record SudokuGridModel(
        String id,
        List<List<Integer>> grid,
        DifficultyEnum difficultyEnum,
        String githubId
) {
}
