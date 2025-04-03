package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NumberToAnimalService {

    private final Map<Integer, String> numberToAnimalMap = new HashMap<>();

    public Map<Integer, String> getNumberToAnimalMap() {
        return new HashMap<>(numberToAnimalMap); // Gibt eine Kopie zurück, um direkte Änderungen zu vermeiden
    }

    public void saveNumberToAnimalsMap(Map<Integer, String> sudokuAnimals) {
        if (sudokuAnimals == null || sudokuAnimals.size() != 9) {
            throw new IllegalArgumentException("Die Map muss genau 9 Einträge enthalten.");
        }
        numberToAnimalMap.clear();
        numberToAnimalMap.putAll(sudokuAnimals);
    }
}
