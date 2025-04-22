package ropold.backend.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.DifficultyEnum;
import ropold.backend.model.HighScoreModel;
import ropold.backend.repository.HighScoreRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HighScoreService {

    private final HighScoreRepository highScoreRepository;
    private final IdService idService;

    public List<HighScoreModel> getHighScoresByDifficulty(DifficultyEnum difficultyEnum) {
        return highScoreRepository.findByDifficultyEnumOrderByScoreTimeAsc(difficultyEnum);
    }

    public HighScoreModel addHighScore(@Valid HighScoreModel highScoreModel) {

        HighScoreModel newHighScoreModel = new HighScoreModel(
                idService.generateRandomId(),
                highScoreModel.playerName(),
                highScoreModel.githubId(),
                highScoreModel.difficultyEnum(),
                highScoreModel.deckEnum(),
                highScoreModel.scoreTime(),
                highScoreModel.date()
        );

        // Bestehende Scores nach Difficulty holen, sortiert nach Zeit (aufsteigend)
        List<HighScoreModel> existingScores = highScoreRepository
                .findByDifficultyEnumOrderByScoreTimeAsc(newHighScoreModel.difficultyEnum());

        // Wenn weniger als 10 Scores vorhanden → einfach speichern
        if (existingScores.size() < 10) {
            return highScoreRepository.save(newHighScoreModel);
        }

        // Falls Score nicht besser als schlechtester Eintrag → abbrechen
        HighScoreModel worstScore = existingScores.get(9);
        if (newHighScoreModel.scoreTime() >= worstScore.scoreTime()) {
            return null;
        }

        // Schlechtesten Score löschen und neuen speichern
        highScoreRepository.deleteById(worstScore.id());
        return highScoreRepository.save(newHighScoreModel);
    }

    public void deleteHighScore(String id) {
        highScoreRepository.deleteById(id);
    }
}
