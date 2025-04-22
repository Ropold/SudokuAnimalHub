package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.model.DifficultyEnum;
import ropold.backend.model.HighScoreModel;
import ropold.backend.repository.HighScoreRepository;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class HighScoreServiceTest {
    IdService idService = mock(IdService.class);
    HighScoreRepository highScoreRepository = mock(HighScoreRepository.class);
    HighScoreService highScoreService = new HighScoreService(highScoreRepository, idService);

    HighScoreModel highScoreModel1 = new HighScoreModel(
            "1",
            "player1",
            "123456",
            DifficultyEnum.EASY,
            10.2,
            LocalDateTime.of(2025, 3, 5, 12, 0, 0)
    );

    HighScoreModel highScoreModel2 = new HighScoreModel(
            "2",
            "player1",
            "123456",
            DifficultyEnum.MEDIUM,
            14.5,
            LocalDateTime.of(2025, 3, 5, 11, 55, 0)
    );

    List<HighScoreModel> highScores = List.of(highScoreModel1, highScoreModel2);

    @BeforeEach
    void setup() {
        highScoreRepository.deleteAll();
        highScoreRepository.saveAll(highScores);
    }

    @Test
    void getHighScoresByDifficulty_shouldReturnHighScores() {
        // Given
        when(highScoreRepository.findByDifficultyEnumOrderByScoreTimeAsc(DifficultyEnum.EASY)).thenReturn(List.of(highScoreModel1));

        List<HighScoreModel> expected = highScoreService.getHighScoresByDifficulty(DifficultyEnum.EASY);

        assertEquals(expected, List.of(highScoreModel1));
    }



}
